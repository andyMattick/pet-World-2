/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  GameState, 
  GameRole, 
  Position, 
  ActionDieFace, 
  GameLogEntry,
  TileData,
  SmokeCloud 
} from './types/game';
import { 
  BOARD_SIZE, 
  POWER_ROOM_POS, 
  generateBoardTiles, 
  createInitialPaintings, 
  createInitialCameras, 
  createInitialLocks, 
  createInitialDetectives, 
  createInitialThief,
  getRoomForCoord 
} from './utils/boardLayout';
import { 
  getValidMoveTiles, 
  findShortestPath,
  hasDirectLineOfSight, 
  checkDetectivesLineOfSight, 
  checkCameraLineOfSight 
} from './utils/rulesEngine';
import { getAIDetectiveMove, getAICameraScanSelection, getAIThiefMove } from './utils/ai';
import { sounds } from './utils/audio';
import { MuseumBoard } from './components/MuseumBoard';
import { DetectiveDials } from './components/DetectiveDials';
import { HiddenTrackingSheet } from './components/HiddenTrackingSheet';
import { RulesWalkthroughModal } from './components/RulesWalkthroughModal';
import { CameraScanModal } from './components/CameraScanModal';
import { GameOverModal } from './components/GameOverModal';
import { TurnOrderTracker } from './components/TurnOrderTracker';
import { ArtQuizModal } from './components/ArtQuizModal';
import { InfiltrationSelectorModal } from './components/InfiltrationSelectorModal';
import { ArtInspectorModal } from './components/ArtInspectorModal';
import { ExhibitionGalleryModal } from './components/ExhibitionGalleryModal';
import { Painting } from './types/game';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Box, 
  EyeOff, 
  Eye, 
  ShieldAlert, 
  Sparkles, 
  Info,
  Layers,
  ChevronRight,
  Shield,
  Loader2,
  Moon,
  Footprints,
  Flame,
  CloudFog,
  Image as ImageIcon
} from 'lucide-react';

export default function App() {
  const [tiles] = useState<TileData[][]>(() => generateBoardTiles());
  const [role, setRole] = useState<GameRole>('thief');
  const [is3dView, setIs3dView] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [rulesModalOpen, setRulesModalOpen] = useState<boolean>(false);
  const [cameraScanModalOpen, setCameraScanModalOpen] = useState<boolean>(false);
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [activeQuizPiece, setActiveQuizPiece] = useState<Painting | null>(null);
  const [infiltrationModalOpen, setInfiltrationModalOpen] = useState<boolean>(false);
  const [inspectorPiece, setInspectorPiece] = useState<Painting | null>(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState<boolean>(false);

  // Animation states for step-by-step walking
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkingPawn, setWalkingPawn] = useState<{
    type: 'thief' | 'detective';
    id: string;
    pos: Position;
  } | null>(null);
  const [activePathPreview, setActivePathPreview] = useState<Position[]>([]);

  // AI pacing state to prevent simultaneous actions
  const [aiActionPhase, setAiActionPhase] = useState<string | null>(null);

  // Screen shake and red flash overlay state
  const [spottedEffectKey, setSpottedEffectKey] = useState<number>(0);
  const [spottedReason, setSpottedReason] = useState<string | null>(null);

  const triggerSpottedAlert = useCallback((reason: string = 'INTRUDER DETECTED!') => {
    sounds.playAlarm();
    setSpottedReason(reason);
    setSpottedEffectKey(prev => prev + 1);
    setTimeout(() => {
      setSpottedReason(null);
    }, 1200);
  }, []);

  // Core Game State
  const [state, setState] = useState<GameState>(() => {
    const initialLocks = createInitialLocks();
    const initialThief = createInitialThief(initialLocks[0].pos);
    return {
      role: 'thief',
      turnNumber: 1,
      activePhase: 'thief',
      currentDetectiveIndex: 0,
      thief: initialThief,
      detectives: createInitialDetectives(),
      paintings: createInitialPaintings(),
      cameras: createInitialCameras(),
      locks: initialLocks,
      smokeClouds: [],
      powerOutageTurns: 0,
      uvTrackerActive: false,
      alarmLevel: 1,
      movementRoll: null,
      actionRoll: null,
      actionUsed: false,
      movesRemaining: 3,
      selectedCameraForScan: null,
      actionResultPrompt: null,
      gameOver: null,
      privacyShieldActive: false,
      quizState: null,
      isInfiltrationSetup: false,
      logs: [
        {
          id: 'log-start-1',
          turn: 1,
          phase: 'thief',
          actor: 'System',
          text: 'Game initiated: The Great Museum Caper. 9 paintings mounted. 6 cameras primed.',
          type: 'alarm',
          timestamp: '00:00',
        },
        {
          id: 'log-start-2',
          turn: 1,
          phase: 'thief',
          actor: 'Thief',
          text: 'Boris entered secretly through the perimeter. Gadgets armed: 2 Sleep Darts, 2 Smoke Bombs.',
          type: 'move',
          timestamp: '00:01',
        },
      ],
    };
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Pet Town Arcade: when this runs inside the Arcade frame (?arcadeRun=...), the game is saved and
  // resumed through the host page, and a finished game is reported (score = paintings stolen).
  const arcadeRunId = useMemo(() => new URLSearchParams(window.location.search).get('arcadeRun'), []);
  const embedded = !!arcadeRunId && window.parent !== window;
  const [arcadeLoaded, setArcadeLoaded] = useState<boolean>(!embedded);
  const reportedRef = useRef(false);

  useEffect(() => {
    if (!embedded) return;
    let done = false;
    const finish = () => { done = true; window.removeEventListener('message', onMessage); setArcadeLoaded(true); };
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (done || event.source !== window.parent || event.origin !== window.location.origin || !data
        || data.type !== 'arcade:state-load' || data.gameId !== 'museum-caper' || data.runId !== arcadeRunId) return;
      if (typeof data.state === 'string') {
        try {
          const saved = JSON.parse(data.state) as GameState;
          if (saved && saved.thief && Array.isArray(saved.paintings) && Array.isArray(saved.detectives) && !saved.gameOver) {
            setState(saved);
            setRole(saved.role);
          }
        } catch { /* a bad save starts a new game */ }
      }
      finish();
    }
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'arcade:state-load-request', gameId: 'museum-caper', runId: arcadeRunId }, window.location.origin);
    const fallback = setTimeout(() => { if (!done) finish(); }, 2000);
    return () => { done = true; window.removeEventListener('message', onMessage); clearTimeout(fallback); };
  }, [embedded, arcadeRunId]);

  useEffect(() => {
    if (!embedded || !arcadeLoaded || isWalking) return;
    const origin = window.location.origin;
    if (state.gameOver) {
      window.parent.postMessage({ type: 'arcade:state-clear', gameId: 'museum-caper', runId: arcadeRunId }, origin);
      if (!reportedRef.current) {
        reportedRef.current = true;
        const score = state.paintings.filter(p => p.status === 'stolen').length;
        window.parent.postMessage({ type: 'arcade:round-complete', gameId: 'museum-caper', runId: arcadeRunId, roundId: `game-${Date.now()}`, score }, origin);
      }
      return;
    }
    reportedRef.current = false;
    const timer = setTimeout(() => {
      const saved = JSON.stringify({ ...state, logs: state.logs.slice(0, 15) });
      if (saved.length <= 95000) window.parent.postMessage({ type: 'arcade:state-save', gameId: 'museum-caper', runId: arcadeRunId, state: saved }, origin);
    }, 800);
    return () => clearTimeout(timer);
  }, [state, isWalking, embedded, arcadeLoaded, arcadeRunId]);

  // Keep sound muted state synchronized
  const toggleMute = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sounds.muted = next;
  };

  // Helper to add to log
  const addLog = useCallback((
    text: string, 
    type: GameLogEntry['type'] = 'move', 
    phase: 'thief' | 'detective' = state.activePhase, 
    actor: string = state.activePhase === 'thief' ? 'Boris' : 'Detectives'
  ) => {
    const newEntry: GameLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      turn: state.turnNumber,
      phase,
      actor,
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setState(prev => ({
      ...prev,
      logs: [newEntry, ...prev.logs.slice(0, 49)],
    }));
  }, [state.turnNumber, state.activePhase]);

  // Restart game
  const handleRestart = (newRole: GameRole = role) => {
    setIsWalking(false);
    setWalkingPawn(null);
    setActivePathPreview([]);
    setAiActionPhase(null);
    setSpottedReason(null);

    const initialLocks = createInitialLocks();
    const initialThief = createInitialThief(initialLocks[0].pos);
    setState({
      role: newRole,
      turnNumber: 1,
      activePhase: 'thief',
      currentDetectiveIndex: 0,
      thief: initialThief,
      detectives: createInitialDetectives(),
      paintings: createInitialPaintings(),
      cameras: createInitialCameras(),
      locks: initialLocks,
      smokeClouds: [],
      powerOutageTurns: 0,
      uvTrackerActive: false,
      alarmLevel: 1,
      movementRoll: null,
      actionRoll: null,
      actionUsed: false,
      movesRemaining: 3,
      selectedCameraForScan: null,
      actionResultPrompt: null,
      gameOver: null,
      privacyShieldActive: false,
      quizState: null,
      isInfiltrationSetup: false,
      logs: [
        {
          id: `log-${Date.now()}`,
          turn: 1,
          phase: 'thief',
          actor: 'System',
          text: `New match started. Playing as ${newRole.toUpperCase()}.`,
          type: 'alarm',
          timestamp: '00:00',
        },
      ],
    });
    setRole(newRole);
    setInfiltrationModalOpen(newRole !== 'detectives');
  };

  // Turn transitions:
  // Thief -> Detective 0 -> Thief -> Detective 1 -> Thief -> Detective 2...
  const passTurnToDetective = () => {
    setState(prev => {
      const newPowerOutage = prev.powerOutageTurns > 0 ? prev.powerOutageTurns - 1 : 0;
      // Decrement smoke clouds
      const newSmokeClouds = prev.smokeClouds
        .map(s => ({ ...s, turnsRemaining: s.turnsRemaining - 1 }))
        .filter(s => s.turnsRemaining > 0);

      return {
        ...prev,
        activePhase: 'detective',
        powerOutageTurns: newPowerOutage,
        smokeClouds: newSmokeClouds,
        movementRoll: null,
        actionRoll: null,
        actionUsed: false,
        movesRemaining: 0,
        actionResultPrompt: null,
        privacyShieldActive: prev.role === 'pass_and_play',
      };
    });
    addLog('Thief completed stealth round. Detective team on patrol.', 'move', 'thief', 'Boris');
  };

  const passTurnToThief = () => {
    setState(prev => {
      const nextDetIndex = (prev.currentDetectiveIndex + 1) % prev.detectives.length;

      // Decrement sleep turns for detectives
      const updatedDetectives = prev.detectives.map(d => ({
        ...d,
        sleepTurns: d.sleepTurns > 0 ? d.sleepTurns - 1 : 0,
      }));

      // Add thief's current position to footstep trails for forensic tracking
      const newFootsteps = [
        ...prev.thief.footstepTrails,
        { pos: { ...prev.thief.pos }, turn: prev.turnNumber + 1 },
      ].slice(-16); // keep recent footprints

      return {
        ...prev,
        turnNumber: prev.turnNumber + 1,
        activePhase: 'thief',
        currentDetectiveIndex: nextDetIndex,
        detectives: updatedDetectives,
        thief: {
          ...prev.thief,
          movesRemaining: 3,
          footstepTrails: newFootsteps,
        },
        movementRoll: null,
        actionRoll: null,
        actionUsed: false,
        movesRemaining: 3,
        actionResultPrompt: null,
        privacyShieldActive: prev.role === 'pass_and_play',
      };
    });
    addLog(`Detectives turn concluded. Passing turn to Boris.`, 'move', 'detective', 'Detectives');
  };

  // Helper function to animate a piece walking step-by-step
  const animateWalkPath = async (
    path: Position[],
    type: 'thief' | 'detective',
    id: string
  ): Promise<void> => {
    if (path.length <= 1) return;

    setIsWalking(true);
    setActivePathPreview(path);

    for (let i = 1; i < path.length; i++) {
      const step = path[i];
      setWalkingPawn({ type, id, pos: step });
      sounds.playFootstep(type === 'thief');
      await new Promise(resolve => setTimeout(resolve, 180));
    }

    setWalkingPawn(null);
    setActivePathPreview([]);
    setIsWalking(false);
  };

  // Roll dice for detective
  const handleRollDice = () => {
    const moveVal = Math.floor(Math.random() * 6) + 1;
    const actions: ActionDieFace[] = ['eyes', 'camera_scan', 'motion_detector'];
    const actionVal = actions[Math.floor(Math.random() * actions.length)];

    setState(prev => ({
      ...prev,
      movementRoll: moveVal,
      movesRemaining: moveVal,
      actionRoll: actionVal,
      actionUsed: false,
    }));

    const currentDet = state.detectives[state.currentDetectiveIndex];
    addLog(
      `${currentDet.name} rolled [${moveVal}] on Movement Die and [${actionVal.toUpperCase()}] on Action Die!`,
      'dice',
      'detective',
      currentDet.clueName
    );
  };

  // Detective Action: Eyes (Line of sight check)
  const handleUseEyes = () => {
    const { spotted, spotterName } = checkDetectivesLineOfSight(
      state.detectives, 
      state.thief.pos, 
      tiles, 
      state.locks, 
      state.smokeClouds
    );

    setState(prev => ({
      ...prev,
      actionUsed: true,
      alarmLevel: spotted ? Math.max(prev.alarmLevel, 2) as 1 | 2 | 3 : prev.alarmLevel,
      thief: {
        ...prev.thief,
        isSpotted: prev.thief.isSpotted || spotted,
        spotReason: spotted ? `Spotted by ${spotterName}'s direct line of sight!` : prev.thief.spotReason,
      },
      actionResultPrompt: spotted 
        ? `EYES CONFIRMED: ${spotterName} sees the intruder through hallway/doorway! The gray pawn is placed on the board!`
        : `EYES CLEAR: No detectives have line of sight down corridors or through doors.`,
    }));

    if (spotted) {
      triggerSpottedAlert(`Spotted by ${spotterName}'s direct line of sight!`);
      addLog(`EYES ALERT: Intruder spotted by ${spotterName}! Gray pawn revealed!`, 'spotted', 'detective', 'Eyes');
    } else {
      addLog(`EYES SCAN: Clear. Intruder is hidden behind gallery walls.`, 'action', 'detective', 'Eyes');
    }
  };

  // Detective Action: Camera Scan
  const handleSelectCameraForScan = (camNumber: number) => {
    const targetCam = state.cameras.find(c => c.number === camNumber);
    if (!targetCam) return;

    const powerOut = state.powerOutageTurns > 0;
    const { seesThief, status } = checkCameraLineOfSight(
      targetCam, 
      state.thief.pos, 
      tiles, 
      powerOut, 
      state.locks, 
      state.smokeClouds
    );

    let prompt = '';
    if (status === 'cut') {
      prompt = `CAMERA #${camNumber} SIGNAL LOST: The wires have been cut!`;
      addLog(`CAMERA #${camNumber}: Signal dead. Thief snipped wires!`, 'alarm', 'detective', 'Camera Scan');
    } else if (status === 'power_down') {
      prompt = `CAMERA #${camNumber} OFFLINE: Museum generator sabotaged!`;
      addLog(`CAMERA #${camNumber}: Down due to power failure.`, 'alarm', 'detective', 'Camera Scan');
    } else if (seesThief) {
      prompt = `CAMERA #${camNumber} INTRUDER ALERT: Boris detected on live video feed! Gray pawn placed on board!`;
      triggerSpottedAlert(`Camera #${camNumber} CCTV feed detected Boris!`);
      setState(prev => ({
        ...prev,
        alarmLevel: Math.max(prev.alarmLevel, 2) as 1 | 2 | 3,
        thief: {
          ...prev.thief,
          isSpotted: true,
          spotReason: `Captured on Camera #${camNumber} feed!`,
        },
      }));
      addLog(`CAMERA #${camNumber} ALERT: Intruder captured on live CCTV feed!`, 'spotted', 'detective', 'Camera Scan');
    } else {
      prompt = `CAMERA #${camNumber} ALL CLEAR: Hallway and gallery are empty.`;
      addLog(`CAMERA #${camNumber}: Hallway clear. No intruder visible.`, 'action', 'detective', 'Camera Scan');
    }

    setState(prev => ({
      ...prev,
      actionUsed: true,
      actionResultPrompt: prompt,
    }));
  };

  // Detective Action: Motion Detector
  const handleUseMotionDetector = () => {
    const powerOut = state.powerOutageTurns > 0;
    if (powerOut) {
      setState(prev => ({
        ...prev,
        actionUsed: true,
        actionResultPrompt: `MOTION SENSORS OFFLINE: Power generator is cut! No readings available.`,
      }));
      addLog(`MOTION SENSORS: Offline due to power failure!`, 'alarm', 'detective', 'Motion Sensor');
      return;
    }

    const thiefRoom = getRoomForCoord(state.thief.pos.x, state.thief.pos.y);
    const roomDisplayName = thiefRoom.roomName;
    sounds.playCameraServo();

    setState(prev => ({
      ...prev,
      actionUsed: true,
      actionResultPrompt: `MOTION SENSOR PING: Electronic vibration detected in ${roomDisplayName}!`,
    }));
    addLog(`MOTION SENSORS: Movement detected in ${roomDisplayName}!`, 'action', 'detective', 'Motion Sensor');
  };

  // Forensic Tool: UV Footstep Tracker
  const handleToggleUVTracker = () => {
    setState(prev => ({
      ...prev,
      uvTrackerActive: !prev.uvTrackerActive,
    }));
    addLog(
      !state.uvTrackerActive 
        ? 'UV Blacklight turned ON: Illuminating recent footprint trails on gallery floors! 👣' 
        : 'UV Blacklight turned OFF.',
      'action',
      'detective',
      'UV Tracker'
    );
  };

  // Forensic Tool: K-9 Guard Dog Sniff
  const handleDeployK9Dog = () => {
    const currentDet = state.detectives[state.currentDetectiveIndex];
    const dist = Math.abs(currentDet.pos.x - state.thief.pos.x) + Math.abs(currentDet.pos.y - state.thief.pos.y);

    if (dist <= 3) {
      triggerSpottedAlert(`K-9 GUARD DOG BARK: Intruder scent confirmed nearby (${dist} spaces away)! 🐶`);
      addLog(`K-9 Unit barks aggressively! Boris's scent is strong in this sector! (Distance: ${dist} spaces)`, 'spotted', 'detective', 'K-9 Unit');
    } else {
      addLog(`K-9 Unit sniffs the museum air... No intruder scent in this wing.`, 'action', 'detective', 'K-9 Unit');
      setState(prev => ({
        ...prev,
        actionResultPrompt: `K-9 Unit sniffs the air: No scent detected within 3 spaces.`,
      }));
    }
  };

  // Detective Lockdown: permanently lock adjacent door or window
  const handleLockdownExit = (lockId: string) => {
    const currentDet = state.detectives[state.currentDetectiveIndex];
    const targetLock = state.locks.find(l => l.id === lockId);
    if (!targetLock) return;

    sounds.playWireCut();
    setState(prev => ({
      ...prev,
      locks: prev.locks.map(l => l.id === lockId ? {
        ...l,
        isLocked: true,
        revealed: true,
        isPermanentlyLocked: true,
        lockedDownBy: currentDet.name,
      } : l),
      actionResultPrompt: `LOCKDOWN SECURED: ${currentDet.name} permanently padlocked ${targetLock.name}!`,
    }));

    addLog(`LOCKDOWN ENFORCED: ${currentDet.name} permanently padlocked and chained ${targetLock.name}! The thief can never escape through this exit! 🔒`, 'alarm', 'detective', currentDet.clueName);
  };

  // Thief Gadget: Fire Sleep Dart
  const handleFireSleepDart = (targetDetectiveId: string) => {
    const targetDet = state.detectives.find(d => d.id === targetDetectiveId);
    if (!targetDet || state.thief.sleepDarts <= 0) return;

    setState(prev => ({
      ...prev,
      detectives: prev.detectives.map(d => d.id === targetDetectiveId ? { ...d, sleepTurns: 2 } : d),
      thief: {
        ...prev.thief,
        sleepDarts: prev.thief.sleepDarts - 1,
      },
    }));

    addLog(`Boris fired a tranquilizer dart! ${targetDet.name} collapsed into a deep snooze (Zzz for 2 turns)! 💤`, 'gadget', 'thief', 'Sleep Dart');
  };

  // Thief Gadget: Deploy Smoke Bomb
  const handleDeploySmokeBomb = () => {
    if (state.thief.smokeBombs <= 0) return;

    const newCloud: SmokeCloud = {
      id: `smoke-${Date.now()}`,
      pos: { ...state.thief.pos },
      turnsRemaining: 3,
    };

    setState(prev => ({
      ...prev,
      smokeClouds: [...prev.smokeClouds, newCloud],
      thief: {
        ...prev.thief,
        smokeBombs: prev.thief.smokeBombs - 1,
      },
    }));

    addLog(`Boris deployed a smoke bomb! Dense fog blocks camera beams & guard sightlines for 3 turns! 💨`, 'gadget', 'thief', 'Smoke Bomb');
  };

  // Thief Gadget: Adrenaline Sprint
  const handleUseAdrenaline = () => {
    if (state.thief.adrenalineUsed) return;

    setState(prev => ({
      ...prev,
      thief: {
        ...prev.thief,
        movesRemaining: prev.thief.movesRemaining + 2,
        adrenalineUsed: true,
      },
    }));

    addLog(`Adrenaline Surge! Boris gained +2 bonus movement steps to sprint away! 🏃`, 'gadget', 'thief', 'Adrenaline');
  };

  // Thief Actions
  const handleCutCamera = (camNumber: number) => {
    setState(prev => ({
      ...prev,
      cameras: prev.cameras.map(c => c.number === camNumber ? { ...c, isCut: true } : c),
    }));
    addLog(`Boris snipped the wires on Security Camera #${camNumber}!`, 'cut', 'thief', 'Boris');
  };

  const handleCutPower = () => {
    setState(prev => ({
      ...prev,
      powerOutageTurns: 3,
      alarmLevel: Math.max(prev.alarmLevel, 2) as 1 | 2 | 3,
    }));
    addLog(`Boris tripped the main generator! All cameras & sensors down for 3 turns!`, 'alarm', 'thief', 'Boris');
  };

  const handleStartCuttingPainting = (paintingId: string) => {
    setState(prev => ({
      ...prev,
      paintings: prev.paintings.map(p => p.id === paintingId ? { ...p, status: 'cutting' } : p),
      thief: {
        ...prev.thief,
        cuttingPaintingId: paintingId,
      },
    }));
    const target = state.paintings.find(p => p.id === paintingId);
    addLog(`Boris reached ${target?.name} and began cutting the canvas. (Requires 1 full turn).`, 'theft', 'thief', 'Boris');
  };

  const handleFinishStealingPainting = (paintingId: string) => {
    const target = state.paintings.find(p => p.id === paintingId);
    if (!target) return;

    if (role === 'detectives' && state.activePhase === 'thief') {
      // AI Thief steals automatically
      handleQuizSuccess(target, null);
      return;
    }

    // Human player: Open Educational Art Heist Quiz!
    setActiveQuizPiece(target);
    setQuizModalOpen(true);
  };

  const handleQuizSuccess = (
    piece: Painting, 
    awardedGadget: 'dart' | 'smoke' | 'adrenaline' | 'lockpick' | null
  ) => {
    setQuizModalOpen(false);
    setActiveQuizPiece(null);

    setState(prev => {
      const newStolenCount = prev.thief.paintingsInBag.length + 1;
      const newAlarmLevel = newStolenCount >= 2 ? 3 : 2;

      let bonusDarts = 0;
      let bonusSmokes = 0;
      let bonusLockpicks = 0;
      let rechargeAdrenaline = false;

      if (awardedGadget === 'dart') bonusDarts = 1;
      if (awardedGadget === 'smoke') bonusSmokes = 1;
      if (awardedGadget === 'lockpick') bonusLockpicks = 1;
      if (awardedGadget === 'adrenaline') rechargeAdrenaline = true;

      return {
        ...prev,
        alarmLevel: Math.max(prev.alarmLevel, newAlarmLevel) as 1 | 2 | 3,
        paintings: prev.paintings.map(p => p.id === piece.id ? { ...p, status: 'stolen' } : p),
        thief: {
          ...prev.thief,
          cuttingPaintingId: null,
          paintingsInBag: [...prev.thief.paintingsInBag, piece.id],
          sleepDarts: prev.thief.sleepDarts + bonusDarts,
          smokeBombs: prev.thief.smokeBombs + bonusSmokes,
          lockpicks: prev.thief.lockpicks + bonusLockpicks,
          adrenalineUsed: rechargeAdrenaline ? false : prev.thief.adrenalineUsed,
        },
      };
    });

    sounds.playAlarm();
    addLog(
      `ART AUTHENTICATED & STOLEN! Boris verified and bagged "${piece.name}" by ${piece.artist}! ${
        awardedGadget ? `Bonus Gadget Earned: +1 ${awardedGadget.toUpperCase()}! 🎁` : ''
      }`,
      'theft',
      'thief',
      'Boris'
    );
  };

  const handleQuizDestroyed = (piece: Painting) => {
    triggerSpottedAlert(`PRESERVATION LASER: ${piece.name} DESTROYED!`);
    sounds.playAlarm();

    setState(prev => {
      const updatedPaintings = prev.paintings.map(p => p.id === piece.id ? { ...p, status: 'destroyed' as const } : p);
      const remainingIntact = updatedPaintings.filter(p => p.status === 'intact' || p.status === 'cutting').length;
      const stolenCount = prev.thief.paintingsInBag.length;

      // Check if impossible for thief to ever reach 3 stolen pieces
      const cannotWin = (stolenCount + remainingIntact) < 3;

      return {
        ...prev,
        alarmLevel: Math.max(prev.alarmLevel, 2) as 1 | 2 | 3,
        paintings: updatedPaintings,
        gameOver: cannotWin ? 'thief_caught' : prev.gameOver,
        thief: {
          ...prev.thief,
          cuttingPaintingId: null,
        },
      };
    });

    addLog(
      `INCINERATOR ALARM: Incorrect answer at 2 options triggered high-voltage defenses! "${piece.name}" was PERMANENTLY DESTROYED! Boris must abandon this piece and target another! 💥`,
      'alarm',
      'thief',
      'Preservation System'
    );
  };

  const handleSelectInfiltrationPoint = (pos: Position, lockName: string) => {
    setState(prev => ({
      ...prev,
      thief: {
        ...prev.thief,
        pos: { ...pos },
        startPos: { ...pos },
        stepsHistory: [{ ...pos }],
      },
    }));
    addLog(`Infiltration Entry Selected: ${lockName} at (${pos.x}, ${pos.y})! 🚪`, 'move', 'thief', 'Boris');
  };

  // Valid move tiles calculation
  const validMoves = useMemo(() => {
    if (state.gameOver || isWalking) return [];

    if (state.activePhase === 'thief') {
      if (role === 'detectives') return []; // AI thief's turn
      return getValidMoveTiles(state.thief.pos, state.thief.movesRemaining, tiles, state.locks, state.paintings, false);
    } else {
      if (role === 'thief') return []; // AI detective's turn
      if (state.movementRoll === null || state.movesRemaining <= 0) return [];
      const currentDet = state.detectives[state.currentDetectiveIndex];
      if (currentDet.sleepTurns > 0) return []; // Asleep!
      return getValidMoveTiles(currentDet.pos, state.movesRemaining, tiles, state.locks, state.paintings, true);
    }
  }, [state, role, tiles, isWalking]);

  // Execute a human move to a tile with step-by-step walking animation
  const handleTileClick = async (targetPos: Position) => {
    if (state.gameOver || isWalking) return;

    if (state.activePhase === 'thief') {
      const path = findShortestPath(
        state.thief.pos,
        targetPos,
        state.thief.movesRemaining,
        tiles,
        state.locks,
        state.paintings,
        false
      );
      if (!path) return;

      // Animate walk step-by-step
      await animateWalkPath(path, 'thief', 'thief');

      const stepsUsed = path.length - 1;
      const newMovesRemaining = Math.max(0, state.thief.movesRemaining - stepsUsed);

      // Check if stepped into awake detective line-of-sight
      const losCheck = checkDetectivesLineOfSight(state.detectives, targetPos, tiles, state.locks, state.smokeClouds);
      if (losCheck.spotted) {
        triggerSpottedAlert(`Spotted by ${losCheck.spotterName}'s line of sight!`);
      }

      // Check if moving to an exit
      const exitLock = state.locks.find(l => l.pos.x === targetPos.x && l.pos.y === targetPos.y);
      if (exitLock) {
        if (exitLock.isPermanentlyLocked) {
          addLog(`${exitLock.name} is PERMANENTLY LOCKED DOWN by ${exitLock.lockedDownBy || 'detectives'} with heavy chains! Escape impossible!`, 'alarm', 'thief', 'Boris');
        } else {
          setState(prev => ({
            ...prev,
            locks: prev.locks.map(l => l.id === exitLock.id ? { ...l, revealed: true } : l),
          }));

          if (!exitLock.isLocked && state.thief.paintingsInBag.length >= 3) {
            sounds.playVictory();
            setState(prev => ({
              ...prev,
              gameOver: 'thief_escaped',
              thief: {
                ...prev.thief,
                pos: targetPos,
                escaped: true,
              },
            }));
            addLog(`VICTORY: Boris escaped through ${exitLock.name} with ${state.thief.paintingsInBag.length} stolen paintings!`, 'escape', 'thief', 'Boris');
            return;
          } else if (exitLock.isLocked) {
            addLog(`${exitLock.name} is LOCKED! Cannot escape here!`, 'alarm', 'thief', 'Boris');
          }
        }
      }

      setState(prev => ({
        ...prev,
        thief: {
          ...prev.thief,
          pos: targetPos,
          movesRemaining: newMovesRemaining,
          stepsHistory: [...prev.thief.stepsHistory, targetPos],
          isSpotted: prev.thief.isSpotted || losCheck.spotted,
        },
      }));
    } else {
      // Find shortest path for active detective
      const currentDet = state.detectives[state.currentDetectiveIndex];
      const path = findShortestPath(
        currentDet.pos,
        targetPos,
        state.movesRemaining,
        tiles,
        state.locks,
        state.paintings,
        true
      );
      if (!path) return;

      // Animate walk step-by-step
      await animateWalkPath(path, 'detective', currentDet.id);

      const stepsUsed = path.length - 1;
      const newMovesRemaining = Math.max(0, state.movesRemaining - stepsUsed);

      // Check if landed on thief!
      if (targetPos.x === state.thief.pos.x && targetPos.y === state.thief.pos.y) {
        triggerSpottedAlert(`APPREHENDED! ${currentDet.name} tackled Boris at (${targetPos.x}, ${targetPos.y})!`);
        sounds.playCaptured();
        setState(prev => ({
          ...prev,
          gameOver: 'thief_caught',
          detectives: prev.detectives.map((d, i) => i === prev.currentDetectiveIndex ? { ...d, pos: targetPos } : d),
          movesRemaining: 0,
        }));
        addLog(`APPREHENDED! ${currentDet.name} tackled Boris at (${targetPos.x}, ${targetPos.y})! The museum is saved!`, 'catch', 'detective', currentDet.clueName);
        return;
      }

      setState(prev => ({
        ...prev,
        detectives: prev.detectives.map((d, i) => i === prev.currentDetectiveIndex ? { ...d, pos: targetPos } : d),
        movesRemaining: newMovesRemaining,
      }));
    }
  };

  // AI Turn Automator: Paced sequence with 3D dice rolls & actions
  useEffect(() => {
    if (state.gameOver || isWalking) return;

    // AI Detective Turn (when user is Thief)
    if (role === 'thief' && state.activePhase === 'detective') {
      let isCancelled = false;

      const runAIDetectiveSequence = async () => {
        const currentDet = stateRef.current.detectives[stateRef.current.currentDetectiveIndex];

        // If current detective is asleep, skip their turn!
        if (currentDet.sleepTurns > 0) {
          setAiActionPhase('sleeping');
          addLog(`${currentDet.name} is fast asleep (Zzz). Skipping turn...`, 'action', 'detective', currentDet.clueName);
          await new Promise(r => setTimeout(r, 1200));
          if (isCancelled) return;
          setAiActionPhase(null);
          passTurnToThief();
          return;
        }

        // --- STAGE 1: Rolling Dice (with visible roll announcement) ---
        setAiActionPhase('rolling');
        sounds.playDiceRoll();
        await new Promise(r => setTimeout(r, 700));
        if (isCancelled) return;

        const moveVal = Math.floor(Math.random() * 6) + 1;
        const actions: ActionDieFace[] = ['eyes', 'camera_scan', 'motion_detector'];
        const actionVal = actions[Math.floor(Math.random() * actions.length)];

        setState(prev => ({
          ...prev,
          movementRoll: moveVal,
          movesRemaining: moveVal,
          actionRoll: actionVal,
          actionUsed: false,
        }));

        addLog(`${currentDet.name} (AI) rolled [${moveVal}] on Movement and [${actionVal.toUpperCase()}]!`, 'dice', 'detective', currentDet.clueName);

        // Pause to let player see the physical dice roll in tray
        await new Promise(r => setTimeout(r, 900));
        if (isCancelled) return;

        // --- STAGE 2: Step-by-Step Walking ---
        setAiActionPhase('moving');
        const nextTargetPos = getAIDetectiveMove(currentDet, moveVal, stateRef.current, tiles);
        const path = findShortestPath(
          currentDet.pos,
          nextTargetPos,
          moveVal,
          tiles,
          stateRef.current.locks,
          stateRef.current.paintings,
          true
        );

        if (path && path.length > 1) {
          await animateWalkPath(path, 'detective', currentDet.id);
        }

        if (isCancelled) return;

        // Check if landed on thief!
        if (nextTargetPos.x === stateRef.current.thief.pos.x && nextTargetPos.y === stateRef.current.thief.pos.y) {
          triggerSpottedAlert(`APPREHENDED! ${currentDet.name} caught Boris at (${nextTargetPos.x}, ${nextTargetPos.y})!`);
          sounds.playCaptured();
          setState(prev => ({
            ...prev,
            gameOver: 'thief_caught',
            detectives: prev.detectives.map((d, i) => i === prev.currentDetectiveIndex ? { ...d, pos: nextTargetPos } : d),
          }));
          addLog(`APPREHENDED! ${currentDet.name} caught Boris at (${nextTargetPos.x}, ${nextTargetPos.y})!`, 'catch', 'detective', currentDet.clueName);
          setAiActionPhase(null);
          return;
        }

        // Commit movement to state
        setState(prev => ({
          ...prev,
          detectives: prev.detectives.map((d, i) => i === prev.currentDetectiveIndex ? { ...d, pos: nextTargetPos } : d),
          movesRemaining: 0,
        }));

        await new Promise(r => setTimeout(r, 500));
        if (isCancelled) return;

        // --- STAGE 3: Executing Special Action ---
        setAiActionPhase('action');
        let spotted = false;
        let actionResultText = '';

        if (actionVal === 'eyes') {
          const check = checkDetectivesLineOfSight(
            stateRef.current.detectives, 
            stateRef.current.thief.pos, 
            tiles, 
            stateRef.current.locks, 
            stateRef.current.smokeClouds
          );
          spotted = check.spotted;
          if (spotted) {
            triggerSpottedAlert(`EYES: ${currentDet.name} spotted Boris through hallway/doorway!`);
            actionResultText = `EYES: ${currentDet.name} spotted Boris through hallway/doorway!`;
            addLog(actionResultText, 'spotted', 'detective', currentDet.clueName);
          } else {
            actionResultText = `EYES: ${currentDet.name} checked line of sight. All hallways clear.`;
            addLog(actionResultText, 'action', 'detective', currentDet.clueName);
          }
        } else if (actionVal === 'camera_scan') {
          const camNum = getAICameraScanSelection(stateRef.current);
          const cam = stateRef.current.cameras.find(c => c.number === camNum);
          if (cam) {
            const check = checkCameraLineOfSight(
              cam, 
              stateRef.current.thief.pos, 
              tiles, 
              stateRef.current.powerOutageTurns > 0, 
              stateRef.current.locks, 
              stateRef.current.smokeClouds
            );
            if (check.seesThief) {
              spotted = true;
              triggerSpottedAlert(`CAMERA #${camNum}: Boris detected on CCTV feed!`);
              actionResultText = `CAMERA #${camNum}: Boris detected on video feed!`;
              addLog(actionResultText, 'spotted', 'detective', 'CCTV');
            } else if (check.status === 'cut') {
              actionResultText = `CAMERA #${camNum}: Wire cut. Static noise!`;
              addLog(actionResultText, 'alarm', 'detective', 'CCTV');
            } else {
              actionResultText = `CAMERA #${camNum}: Feed scanned. Corridor is empty.`;
              addLog(actionResultText, 'action', 'detective', 'CCTV');
            }
          }
        } else if (actionVal === 'motion_detector') {
          if (stateRef.current.powerOutageTurns === 0) {
            const r = getRoomForCoord(stateRef.current.thief.pos.x, stateRef.current.thief.pos.y);
            actionResultText = `MOTION DETECTOR: Movement detected in ${r.roomName}!`;
            addLog(actionResultText, 'action', 'detective', 'Sensors');
          } else {
            actionResultText = `MOTION DETECTOR: Sensors offline (power cut).`;
            addLog(actionResultText, 'alarm', 'detective', 'Sensors');
          }
        }

        setState(prev => ({
          ...prev,
          actionUsed: true,
          actionResultPrompt: actionResultText,
          alarmLevel: spotted ? Math.max(prev.alarmLevel, 2) as 1 | 2 | 3 : prev.alarmLevel,
          thief: {
            ...prev.thief,
            isSpotted: prev.thief.isSpotted || spotted,
          },
        }));

        // Pause to let player read the action result
        await new Promise(r => setTimeout(r, 1100));
        if (isCancelled) return;

        // --- STAGE 4: Hand Off Turn to Thief ---
        setAiActionPhase(null);
        passTurnToThief();
      };

      runAIDetectiveSequence();
      return () => {
        isCancelled = true;
      };
    }

    // AI Thief Turn (when user is Detectives)
    if (role === 'detectives' && state.activePhase === 'thief') {
      let isCancelled = false;

      const runAIThiefSequence = async () => {
        setAiActionPhase('thief_moving');
        await new Promise(r => setTimeout(r, 700));
        if (isCancelled) return;

        const { nextPos } = getAIThiefMove(stateRef.current, tiles);
        const path = findShortestPath(
          stateRef.current.thief.pos,
          nextPos,
          3,
          tiles,
          stateRef.current.locks,
          stateRef.current.paintings,
          false
        );

        if (path && path.length > 1) {
          // Play footsteps for stealth presence
          for (let i = 1; i < path.length; i++) {
            sounds.playFootstep(true);
            await new Promise(r => setTimeout(r, 180));
          }
        }

        if (isCancelled) return;

        // Check if on painting
        const paintingOnTile = stateRef.current.paintings.find(
          p => p.pos.x === nextPos.x && p.pos.y === nextPos.y && p.status !== 'stolen'
        );

        let cuttingId = stateRef.current.thief.cuttingPaintingId;
        let inBag = [...stateRef.current.thief.paintingsInBag];
        let newPaintings = [...stateRef.current.paintings];

        if (stateRef.current.thief.cuttingPaintingId) {
          // Finished cutting 1 full turn!
          const finishedPainting = stateRef.current.paintings.find(p => p.id === stateRef.current.thief.cuttingPaintingId);
          if (finishedPainting) {
            inBag.push(finishedPainting.id);
            cuttingId = null;
            newPaintings = newPaintings.map(p => p.id === finishedPainting.id ? { ...p, status: 'stolen' } : p);
            sounds.playAlarm();
            addLog(`ALARM: ${finishedPainting.name} removed from wall in ${finishedPainting.roomName}!`, 'theft', 'thief', 'Boris');
          }
        } else if (paintingOnTile && paintingOnTile.status === 'intact') {
          // Start cutting!
          cuttingId = paintingOnTile.id;
          newPaintings = newPaintings.map(p => p.id === paintingOnTile.id ? { ...p, status: 'cutting' } : p);
          addLog(`Whispers detected in ${paintingOnTile.roomName}... someone is tampering with artwork!`, 'theft', 'thief', 'Boris');
        }

        // Check if on camera
        const cameraOnTile = stateRef.current.cameras.find(c => c.pos.x === nextPos.x && c.pos.y === nextPos.y && !c.isCut);
        let newCameras = [...stateRef.current.cameras];
        if (cameraOnTile && Math.random() > 0.4) {
          newCameras = newCameras.map(c => c.number === cameraOnTile.number ? { ...c, isCut: true } : c);
          addLog(`STATIC: Camera #${cameraOnTile.number} lost its video feed (wires cut)!`, 'cut', 'thief', 'Boris');
        }

        // Check escape
        const exitLock = stateRef.current.locks.find(l => l.pos.x === nextPos.x && l.pos.y === nextPos.y);
        if (exitLock && !exitLock.isLocked && !exitLock.isPermanentlyLocked && inBag.length >= 3) {
          sounds.playVictory();
          setState(prev => ({
            ...prev,
            gameOver: 'thief_escaped',
            thief: {
              ...prev.thief,
              pos: nextPos,
              paintingsInBag: inBag,
              escaped: true,
            },
          }));
          addLog(`BORIS ESCAPED with ${inBag.length} masterpieces! Detectives failed!`, 'escape', 'thief', 'Boris');
          setAiActionPhase(null);
          return;
        }

        // Check line of sight from detectives
        const losCheck = checkDetectivesLineOfSight(
          stateRef.current.detectives, 
          nextPos, 
          tiles, 
          stateRef.current.locks, 
          stateRef.current.smokeClouds
        );

        if (losCheck.spotted) {
          triggerSpottedAlert(`ALERT: Boris walked into detective line-of-sight!`);
          addLog(`ALERT: Boris walked into detective line-of-sight!`, 'spotted', 'detective', 'Eyes');
        } else {
          addLog(`Boris completed silent movement.`, 'move', 'thief', 'Boris');
        }

        setState(prev => ({
          ...prev,
          activePhase: 'detective',
          paintings: newPaintings,
          cameras: newCameras,
          alarmLevel: inBag.length >= 2 ? 3 : inBag.length >= 1 ? 2 : prev.alarmLevel,
          thief: {
            ...prev.thief,
            pos: nextPos,
            cuttingPaintingId: cuttingId,
            paintingsInBag: inBag,
            isSpotted: prev.thief.isSpotted || losCheck.spotted,
            stepsHistory: [...prev.thief.stepsHistory, nextPos],
            footstepTrails: [
              ...prev.thief.footstepTrails,
              { pos: nextPos, turn: prev.turnNumber },
            ].slice(-16),
          },
          movementRoll: null,
          actionRoll: null,
          actionUsed: false,
          movesRemaining: 0,
        }));

        setAiActionPhase(null);
      };

      runAIThiefSequence();
      return () => {
        isCancelled = true;
      };
    }
  }, [state.turnNumber, state.activePhase, state.gameOver, role, tiles, addLog, isWalking, triggerSpottedAlert]);

  // Contextual checks for current thief tile
  const currentTilePainting = state.paintings.find(
    p => p.pos.x === state.thief.pos.x && p.pos.y === state.thief.pos.y && p.status !== 'stolen'
  );
  const canCutCurrentPainting = currentTilePainting && currentTilePainting.status === 'intact' ? currentTilePainting.id : null;
  const canFinishCurrentPainting = state.thief.cuttingPaintingId && currentTilePainting?.id === state.thief.cuttingPaintingId ? currentTilePainting.id : null;

  const currentTileCamera = state.cameras.find(
    c => c.pos.x === state.thief.pos.x && c.pos.y === state.thief.pos.y && !c.isCut
  );
  const canCutCurrentCamera = currentTileCamera ? currentTileCamera.number : null;

  const canCutCurrentPower = state.thief.pos.x === POWER_ROOM_POS.x && state.thief.pos.y === POWER_ROOM_POS.y && state.powerOutageTurns === 0;

  const currentDetective = state.detectives[state.currentDetectiveIndex];

  // Detective adjacent locks available for Lockdown
  const adjacentLocks = useMemo(() => {
    return state.locks.filter(l => 
      !l.isPermanentlyLocked &&
      (Math.abs(currentDetective.pos.x - l.pos.x) + Math.abs(currentDetective.pos.y - l.pos.y) <= 1)
    );
  }, [state.locks, currentDetective.pos]);

  return (
    <div className={`min-h-screen bg-stone-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black ${
      spottedReason ? 'shake-screen' : ''
    }`}>
      {/* Top Navigation Bar */}
      <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-950 flex items-center justify-center shadow-lg border border-amber-400/30">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg text-white tracking-wide uppercase font-serif">
                  Museum Caper
                </h1>
                <span className="text-[10px] bg-amber-950/80 text-amber-400 border border-amber-500/50 px-1.5 py-0.5 rounded font-mono font-bold">
                  CLUE 1991
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                The classic Milton Bradley stealth & art heist deduction game
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1 bg-stone-950 border border-stone-800 p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => handleRestart('thief')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                role === 'thief'
                  ? 'bg-zinc-700 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Play as Thief
            </button>
            <button
              onClick={() => handleRestart('detectives')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                role === 'detectives'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Play as Detectives
            </button>
            <button
              onClick={() => handleRestart('pass_and_play')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                role === 'pass_and_play'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Pass & Play (2P)
            </button>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIs3dView(!is3dView)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                is3dView
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-stone-800 border-stone-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle 3D Isometric View"
            >
              <Box className="w-4 h-4" />
              <span className="hidden md:inline font-mono">{is3dView ? '3D View' : '2D View'}</span>
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-stone-800 border border-stone-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={soundMuted ? 'Unmute' : 'Mute'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {role !== 'detectives' && (
              <button
                onClick={() => setInfiltrationModalOpen(true)}
                className="px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-mono"
                title="Select Starting Door or Window"
              >
                <span>🚪 Infiltration Entry ({state.thief.pos.x},{state.thief.pos.y})</span>
              </button>
            )}

            {/* Exhibition Art Gallery Pictures Button */}
            <button
              onClick={() => setGalleryModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-mono shadow-sm"
              title="View all 9 exhibition masterpiece photographs & dossiers"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Exhibition Pictures</span>
            </button>

            <button
              onClick={() => setRulesModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Official Rules</span>
            </button>

            <button
              onClick={() => handleRestart(role)}
              className="p-2 rounded-lg bg-stone-800 border border-stone-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset Match"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Red Flash Overlay & Siren Vignette when spotted */}
      {spottedReason && (
        <div 
          key={spottedEffectKey}
          className="fixed inset-0 z-50 pointer-events-none red-flash-overlay siren-vignette flex flex-col items-center justify-center p-4 select-none"
        >
          <div className="bg-red-950/95 border-3 border-red-500 rounded-2xl px-6 py-4 shadow-[0_0_60px_rgba(239,68,68,0.9)] backdrop-blur-md flex items-center gap-3.5 animate-bounce max-w-lg text-center">
            <ShieldAlert className="w-10 h-10 text-red-400 animate-pulse shrink-0" />
            <div className="text-left">
              <div className="text-[11px] uppercase font-mono font-black tracking-widest text-red-300">
                🚨 SECURITY ALERT · INTRUDER SPOTTED! 🚨
              </div>
              <div className="text-base font-black text-white font-mono mt-0.5">
                {spottedReason}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Interface Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 flex flex-col gap-4">
        {/* Prominent Turn Order & Next Detective to Move Tracker */}
        <TurnOrderTracker state={state} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Detective Controls or Thief Ledger */}
          <div className="lg:col-span-4 space-y-4">
            {/* AI Action Indicator when AI is performing staged turn */}
            {aiActionPhase && (
              <div className="bg-amber-950/80 border border-amber-500/70 rounded-xl p-3 text-xs text-amber-200 font-mono shadow-md flex items-center gap-2.5 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                <span>
                  {aiActionPhase === 'rolling' && 'Detective is rolling the 2 dice...'}
                  {aiActionPhase === 'moving' && 'Detective is traversing corridors step-by-step...'}
                  {aiActionPhase === 'action' && 'Detective is executing electronic surveillance action...'}
                  {aiActionPhase === 'sleeping' && 'Detective was hit by a sleep dart! Snoozing (Zzz)...'}
                  {aiActionPhase === 'thief_moving' && 'Boris is sneaking through the shadows...'}
                </span>
              </div>
            )}

            {/* Prompt/Alert Banner */}
            {state.actionResultPrompt && (
              <div className="bg-cyan-950/70 border border-cyan-500/60 rounded-xl p-3 text-xs text-cyan-200 font-mono shadow-md flex items-start gap-2 animate-fade-in">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>{state.actionResultPrompt}</div>
              </div>
            )}

            {/* Interactive Player Controls */}
            {state.activePhase === 'thief' ? (
              <HiddenTrackingSheet
                thief={state.thief}
                paintings={state.paintings}
                cameras={state.cameras}
                locks={state.locks}
                detectives={state.detectives}
                powerOut={state.powerOutageTurns > 0}
                powerOutageTurns={state.powerOutageTurns}
                isThiefTurn={state.activePhase === 'thief' && !isWalking}
                isAiThief={role === 'detectives'}
                onCutCamera={handleCutCamera}
                onCutPower={handleCutPower}
                onStartCuttingPainting={handleStartCuttingPainting}
                onFinishStealingPainting={handleFinishStealingPainting}
                onEndThiefTurn={passTurnToDetective}
                onFireSleepDart={handleFireSleepDart}
                onDeploySmokeBomb={handleDeploySmokeBomb}
                onUseAdrenaline={handleUseAdrenaline}
                onOpenInfiltrationSelect={() => setInfiltrationModalOpen(true)}
                onInspectPainting={(p) => setInspectorPiece(p)}
                canCutCurrentCamera={canCutCurrentCamera}
                canCutCurrentPower={canCutCurrentPower}
                canCutCurrentPainting={canCutCurrentPainting}
                canFinishCurrentPainting={canFinishCurrentPainting}
              />
            ) : (
              <DetectiveDials
                movementRoll={state.movementRoll}
                actionRoll={state.actionRoll}
                actionUsed={state.actionUsed}
                movesRemaining={state.movesRemaining}
                currentDetective={currentDetective}
                adjacentLocks={adjacentLocks}
                isDetectiveTurn={state.activePhase === 'detective' && !isWalking}
                isAiTurn={role === 'thief'}
                workingCamerasCount={state.cameras.filter(c => !c.isCut).length}
                powerOut={state.powerOutageTurns > 0}
                uvTrackerActive={state.uvTrackerActive}
                onRollDice={handleRollDice}
                onUseEyes={handleUseEyes}
                onOpenCamScanModal={() => setCameraScanModalOpen(true)}
                onUseMotionDetector={handleUseMotionDetector}
                onToggleUVTracker={handleToggleUVTracker}
                onDeployK9Dog={handleDeployK9Dog}
                onLockdownExit={handleLockdownExit}
                onEndDetectiveTurn={passTurnToThief}
              />
            )}

            {/* Pass & Play Privacy Screen toggle */}
            {role === 'pass_and_play' && (
              <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3 text-xs text-amber-200">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <Shield className="w-4 h-4 text-amber-400" />
                  2-Player Pass & Play Controls
                </div>
                <p className="text-[11px] text-amber-300/80 mb-2">
                  Currently playing: <strong className="text-white">{state.activePhase === 'thief' ? 'Player 1 (Boris the Thief)' : `Player 2 (Detective: ${currentDetective.name})`}</strong>.
                </p>
                <button
                  onClick={() => setState(prev => ({ ...prev, privacyShieldActive: !prev.privacyShieldActive }))}
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  {state.privacyShieldActive ? 'Reveal Screen' : 'Shield Screen (Pass Device)'}
                </button>
              </div>
            )}

            {/* Turn event ticker / Dispatch Log */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 shadow-lg">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-stone-800 pb-2 mb-2 flex items-center justify-between">
                <span>Security Radio Dispatch</span>
                <span className="text-[10px] text-slate-500 font-normal">Real-time log</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-[11px] font-mono">
                {state.logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-1.5 rounded border transition-colors ${
                      log.type === 'alarm' || log.type === 'theft' || log.type === 'spotted'
                        ? 'bg-red-950/40 border-red-500/40 text-red-300'
                        : log.type === 'cut' || log.type === 'gadget'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                        : log.type === 'escape' || log.type === 'catch'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-stone-950/60 border-stone-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between opacity-70 text-[9px]">
                      <span>[{log.actor}]</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="mt-0.5">{log.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center / Right Column: Museum Board */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* Privacy cover modal when pass and play screen is shielded */}
            {state.privacyShieldActive ? (
              <div className="w-full h-96 bg-stone-900 border-2 border-amber-600/60 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-200 shadow-2xl animate-fade-in">
                <EyeOff className="w-16 h-16 text-amber-400 mb-4 animate-pulse" />
                <h2 className="text-xl font-black uppercase font-mono tracking-wider text-amber-300">
                  {state.activePhase === 'detective' 
                    ? 'PASS DEVICE TO THE DETECTIVES (PLAYER 2)' 
                    : 'PASS DEVICE TO BORIS THE THIEF (PLAYER 1)'}
                </h2>
                <p className="text-xs text-slate-300 mt-2 max-w-md">
                  {state.activePhase === 'detective'
                    ? 'Take the device. Boris\'s secret coordinates and pad are hidden. Inspect camera feeds, roll dice, and use your detective toolkit!'
                    : 'Take the device. Make sure the detective player is looking away before clicking reveal!'}
                </p>
                <button
                  onClick={() => setState(prev => ({ ...prev, privacyShieldActive: false }))}
                  className="mt-6 py-2.5 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black rounded-xl text-xs cursor-pointer shadow-lg font-mono uppercase tracking-wider"
                >
                  {state.activePhase === 'detective'
                    ? 'I am the Detectives — Reveal Security Console!'
                    : 'I am Boris — Reveal Secret Ledger!'}
                </button>
              </div>
            ) : (
              <MuseumBoard
                state={state}
                tiles={tiles}
                validMoves={validMoves}
                onTileClick={handleTileClick}
                is3dView={is3dView}
                walkingPawn={walkingPawn}
                activePathPreview={activePathPreview}
                isInfiltrationMode={infiltrationModalOpen}
                onInfiltrationSelect={(pos, name) => {
                  handleSelectInfiltrationPoint(pos, name);
                  setInfiltrationModalOpen(false);
                }}
                onInspectPainting={(p) => setInspectorPiece(p)}
              />
            )}

            {/* Quick interactive hints for user */}
            <div className="mt-4 p-3 bg-stone-900/60 border border-stone-800 rounded-xl text-xs text-slate-400 max-w-xl text-center">
              {role === 'thief' ? (
                <span>
                  <strong>Thief Arsenal:</strong> Use <strong>Sleep Darts (💤)</strong> to tranquilize guards for 2 turns, throw <strong>Smoke Bombs (💨)</strong> to block vision cones, or activate <strong>Adrenaline (+2 Moves)</strong>. Answer the <strong>Educational Art Quiz</strong> (2 options on 1st piece, +1 option per consecutive piece) to steal masterpieces! Escape with 3+ pieces through an unlocked door or window!
                </span>
              ) : (
                <span>
                  <strong>Detective Forensics:</strong> Watch the <strong>Dice Tray</strong> roll each turn. Toggle <strong>UV Blacklight Scanner (👣)</strong> to illuminate Boris's recent footstep trails, deploy the <strong>K-9 Guard Dog (🐶)</strong> to sniff within 3 spaces, enforce <strong>Lockdown (🔒)</strong> on exits, and catch Boris!
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Educational Art Acquisition Quiz Modal */}
      <ArtQuizModal
        isOpen={quizModalOpen}
        artPiece={activeQuizPiece}
        stolenCount={state.thief.paintingsInBag.length}
        onSuccess={handleQuizSuccess}
        onDestroyed={handleQuizDestroyed}
        onCancel={() => {
          setQuizModalOpen(false);
          setActiveQuizPiece(null);
        }}
      />

      {/* High-Resolution Masterpiece Photograph Inspector */}
      <ArtInspectorModal
        isOpen={inspectorPiece !== null}
        artPiece={inspectorPiece}
        onClose={() => setInspectorPiece(null)}
        canAttemptTheft={
          role !== 'detectives' && 
          state.activePhase === 'thief' && 
          inspectorPiece !== null && 
          state.thief.pos.x === inspectorPiece.pos.x && 
          state.thief.pos.y === inspectorPiece.pos.y && 
          inspectorPiece.status === 'cutting'
        }
        onAttemptTheft={(paintingId) => {
          handleFinishStealingPainting(paintingId);
        }}
      />

      {/* Exhibition Art Gallery Overview (All 9 Real Masterpieces) */}
      <ExhibitionGalleryModal
        isOpen={galleryModalOpen}
        paintings={state.paintings}
        onClose={() => setGalleryModalOpen(false)}
        onSelectPiece={(piece) => {
          setInspectorPiece(piece);
        }}
      />

      {/* Perimeter Infiltration Point Selection Modal */}
      <InfiltrationSelectorModal
        isOpen={infiltrationModalOpen}
        locks={state.locks}
        currentStartPos={state.thief.pos}
        onSelectStartPos={handleSelectInfiltrationPoint}
        onConfirm={() => setInfiltrationModalOpen(false)}
      />

      {/* Rules & Setup Walkthrough Modal */}
      <RulesWalkthroughModal
        isOpen={rulesModalOpen}
        onClose={() => setRulesModalOpen(false)}
      />

      {/* Camera Scan Selection Modal */}
      <CameraScanModal
        isOpen={cameraScanModalOpen}
        cameras={state.cameras}
        powerOut={state.powerOutageTurns > 0}
        onSelectCamera={handleSelectCameraForScan}
        onClose={() => setCameraScanModalOpen(false)}
      />

      {/* Game Over Modal */}
      {state.gameOver && (
        <GameOverModal
          outcome={state.gameOver}
          userRole={role}
          paintingsStolenCount={state.thief.paintingsInBag.length}
          totalPaintings={state.paintings.length}
          turnsTaken={state.turnNumber}
          onRestart={() => handleRestart(role)}
          onSwitchRole={(newRole) => handleRestart(newRole)}
        />
      )}
    </div>
  );
}
