import React, { useState, useEffect } from 'react';
import {
  GameCase,
  InvestigationSite,
  PlayerCareer,
  Suspect,
  CityDestination,
} from './types/game';
import {
  generateNewCase,
  getPlayerCareer,
  updatePlayerCareer,
  calculateFlightHours,
} from './services/gameEngine';
import { sounds } from './services/soundEffects';
import { Header } from './components/Header';
import { WorldMap } from './components/WorldMap';
import { InvestigationHub } from './components/InvestigationHub';
import { TravelDepartures } from './components/TravelDepartures';
import { WarrantTerminal } from './components/WarrantTerminal';
import { FieldResearchTerminal } from './components/FieldResearchTerminal';
import { CaseBriefingModal } from './components/CaseBriefingModal';
import { ArrestSceneModal } from './components/ArrestSceneModal';
import { CareerModal } from './components/CareerModal';
import { TravelCinematicModal } from './components/TravelCinematicModal';
import { MissionLog } from './components/MissionLog';

export default function App() {
  const [career, setCareer] = useState<PlayerCareer>(() => getPlayerCareer());
  const [currentCase, setCurrentCase] = useState<GameCase>(() => generateNewCase('Detective', 1));
  const [activeTab, setActiveTab] = useState<'investigate' | 'travel' | 'warrant' | 'research' | 'mission_log'>('investigate');
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(true);
  const [isArrestModalOpen, setIsArrestModalOpen] = useState<boolean>(false);
  const [isCareerOpen, setIsCareerOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());
  
  // Cinematic Travel Animation State
  const [isTravelCinematicOpen, setIsTravelCinematicOpen] = useState<boolean>(false);
  const [pendingFlightDestination, setPendingFlightDestination] = useState<CityDestination | null>(null);
  const [pendingFlightHours, setPendingFlightHours] = useState<number>(0);

  const [researchKeyword, setResearchKeyword] = useState<string>('');
  const [visitedCities, setVisitedCities] = useState<CityDestination[]>(() => [currentCase.currentCity]);
  const [wrongTurnNotification, setWrongTurnNotification] = useState<string | null>(null);
  const [timeCostNotice, setTimeCostNotice] = useState<string | null>(null);

  // Sync mute state
  const handleToggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  // Start mission from briefing
  const handleStartMission = () => {
    setIsBriefingOpen(false);
    sounds.play('beep');
  };

  const triggerTimeCostAlert = (message: string) => {
    setTimeCostNotice(message);
    setTimeout(() => {
      setTimeCostNotice(null);
    }, 2800);
  };

  // Investigate a site in the current city
  const handleInvestigateSite = (site: InvestigationSite) => {
    const currentLeg = currentCase.legs[currentCase.currentLegIndex];
    if (!currentLeg) return;

    const alreadyVisited = currentLeg.visitedSiteIds.includes(site.id);
    const costHours = alreadyVisited ? 0 : 2;

    if (costHours > 0) {
      triggerTimeCostAlert(`-2 Hours: Witness Interview with ${site.witnessRole}`);
    }

    const newHours = Math.max(0, currentCase.hoursRemaining - costHours);
    const newVisitedSiteIds = alreadyVisited ? currentLeg.visitedSiteIds : [...currentLeg.visitedSiteIds, site.id];

    // Gather discovered clues
    const clueBundle = currentLeg.siteClues[site.id];
    const newClues = [...currentCase.clueLog];

    if (!alreadyVisited && clueBundle) {
      // Add destination clue
      newClues.push({
        id: `${site.id}-dest-${Date.now()}`,
        text: clueBundle.destinationClue.text,
        category: 'destination',
        siteName: site.name,
        cityName: currentCase.currentCity.name,
        timestamp: `${currentCase.currentCity.name} (${site.witnessRole})`,
      });

      // Add suspect clue if available
      if (clueBundle.suspectClue) {
        newClues.push({
          id: `${site.id}-susp-${Date.now()}`,
          text: clueBundle.suspectClue.text,
          category: 'suspect',
          siteName: site.name,
          cityName: currentCase.currentCity.name,
          suspectTraitName: clueBundle.suspectClue.traitName,
          suspectTraitValue: clueBundle.suspectClue.traitValue,
          timestamp: `${currentCase.currentCity.name} (${site.witnessRole})`,
        });
      }

      sounds.play('clue');
    }

    const updatedLegs = currentCase.legs.map((leg, idx) =>
      idx === currentCase.currentLegIndex ? { ...leg, visitedSiteIds: newVisitedSiteIds } : leg
    );

    // Check if time expired
    if (newHours <= 0) {
      const failedCase: GameCase = {
        ...currentCase,
        hoursRemaining: 0,
        legs: updatedLegs,
        clueLog: newClues,
        status: 'escaped_time',
      };
      setCurrentCase(failedCase);
      const updatedCareer = updatePlayerCareer(failedCase, false, 0);
      setCareer(updatedCareer);
      setIsArrestModalOpen(true);
      return;
    }

    setCurrentCase({
      ...currentCase,
      hoursRemaining: newHours,
      legs: updatedLegs,
      clueLog: newClues,
    });
  };

  // Initiate flight transit cinematic
  const handleSelectFlight = (destination: CityDestination) => {
    const flightHours = calculateFlightHours(currentCase.currentCity, destination);
    setPendingFlightDestination(destination);
    setPendingFlightHours(flightHours);
    setIsTravelCinematicOpen(true);
  };

  // Complete flight transit after cinematic animation
  const handleCompleteFlightTransit = () => {
    setIsTravelCinematicOpen(false);
    if (!pendingFlightDestination) return;

    const destination = pendingFlightDestination;
    const flightHours = pendingFlightHours;
    const remainingAfterFlight = Math.max(0, currentCase.hoursRemaining - flightHours);

    triggerTimeCostAlert(`-${flightHours} Hours: Intercontinental Flight Transit`);

    // Is this destination the correct next city in the trail?
    const nextLeg = currentCase.legs[currentCase.currentLegIndex + 1];
    const isCorrectNext = nextLeg && nextLeg.destination.id === destination.id;

    // Check if ran out of time during flight
    if (remainingAfterFlight <= 0) {
      const failedCase: GameCase = {
        ...currentCase,
        hoursRemaining: 0,
        status: 'escaped_time',
      };
      setCurrentCase(failedCase);
      const updatedCareer = updatePlayerCareer(failedCase, false, 0);
      setCareer(updatedCareer);
      setIsArrestModalOpen(true);
      return;
    }

    if (isCorrectNext) {
      // Advanced along true trail!
      const newLegIndex = currentCase.currentLegIndex + 1;
      const newVisited = [...visitedCities, destination];
      setVisitedCities(newVisited);
      setWrongTurnNotification(null);

      setCurrentCase((prev) => ({
        ...prev,
        currentLegIndex: newLegIndex,
        currentCity: destination,
        hoursRemaining: remainingAfterFlight,
        flightLog: [
          ...prev.flightLog,
          {
            from: prev.currentCity.name,
            to: destination.name,
            hoursSpent: flightHours,
            wasCorrect: true,
          },
        ],
      }));

      setActiveTab('investigate');
      sounds.play('beep');
    } else {
      // Decoy / dead end!
      setWrongTurnNotification(
        `Local port authorities in ${destination.name} report NO sightings of anyone matching your suspect! You lost ${flightHours} hours on a false lead and had to backtrack!`
      );

      setCurrentCase((prev) => ({
        ...prev,
        hoursRemaining: remainingAfterFlight,
        flightLog: [
          ...prev.flightLog,
          {
            from: prev.currentCity.name,
            to: destination.name,
            hoursSpent: flightHours,
            wasCorrect: false,
          },
        ],
      }));

      setActiveTab('investigate');
      sounds.play('loss');
    }

    setPendingFlightDestination(null);
  };

  // Issue arrest warrant in Crime Computer
  const handleIssueWarrant = (suspect: Suspect) => {
    setCurrentCase((prev) => ({
      ...prev,
      warrantIssuedFor: suspect.id,
    }));
  };

  // Revoke warrant
  const handleRevokeWarrant = () => {
    setCurrentCase((prev) => ({
      ...prev,
      warrantIssuedFor: null,
    }));
  };

  // Raid Safehouse at Final Hideout
  const handleRaidSafehouse = () => {
    const isWarrantIssued = !!currentCase.warrantIssuedFor;
    const isCorrectWarrant = currentCase.warrantIssuedFor === currentCase.culprit.id;

    let endStatus: GameCase['status'] = 'solved';
    if (!isWarrantIssued) {
      endStatus = 'escaped_no_warrant';
    } else if (!isCorrectWarrant) {
      endStatus = 'escaped_wrong_warrant';
    }

    const won = endStatus === 'solved';
    const scoreEarned = won
      ? currentCase.hoursRemaining * 100 +
        currentCase.clueLog.length * 50 +
        (currentCase.difficulty === 'Scholar' ? 3000 : currentCase.difficulty === 'Detective' ? 2000 : 1000)
      : 0;

    const finishedCase: GameCase = {
      ...currentCase,
      status: endStatus,
      score: scoreEarned,
    };

    setCurrentCase(finishedCase);
    const updatedCareer = updatePlayerCareer(finishedCase, won, scoreEarned);
    setCareer(updatedCareer);
    setIsArrestModalOpen(true);
  };

  // Start next case
  const handleNextCase = (difficulty?: 'Rookie' | 'Detective' | 'Scholar') => {
    const nextDiff = difficulty || currentCase.difficulty;
    const newCase = generateNewCase(nextDiff, currentCase.caseNumber + 1);
    setCurrentCase(newCase);
    setVisitedCities([newCase.currentCity]);
    setWrongTurnNotification(null);
    setIsArrestModalOpen(false);
    setIsBriefingOpen(true);
    setActiveTab('investigate');
  };

  // Open research terminal with specific keyword
  const handleOpenResearchForKeyword = (keyword: string) => {
    setResearchKeyword(keyword);
    setActiveTab('research');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        currentCase={currentCase}
        career={career}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setWrongTurnNotification(null);
        }}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenCareer={() => setIsCareerOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6 relative">
        {/* Animated Floating Time Cost Notification */}
        {timeCostNotice && (
          <div className="fixed top-24 right-6 z-40 bg-slate-950/90 border border-amber-500/80 rounded-xl px-4 py-2.5 shadow-2xl text-xs font-mono text-amber-300 flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold">{timeCostNotice}</span>
          </div>
        )}

        {/* Wrong Turn / Decoy Alert Banner */}
        {wrongTurnNotification && (
          <div className="bg-rose-950/80 border-2 border-rose-500/80 rounded-xl p-4 flex items-center justify-between gap-4 text-xs font-mono text-rose-200 shadow-xl animate-shake">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <strong className="text-rose-400 uppercase tracking-wider block">TRAIL RUN COLD (DECOY CITY)</strong>
                <span>{wrongTurnNotification}</span>
              </div>
            </div>
            <button
              onClick={() => setWrongTurnNotification(null)}
              className="px-3 py-1.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global World Reconnaissance Map */}
        <WorldMap
          currentCity={currentCase.currentCity}
          visitedCities={visitedCities}
          travelOptions={currentCase.legs[currentCase.currentLegIndex]?.travelOptions || []}
          onSelectDestination={(dest) => {
            setActiveTab('travel');
          }}
          isFlying={isTravelCinematicOpen}
          flyingFrom={currentCase.currentCity}
          flyingTo={pendingFlightDestination}
        />

        {/* Dynamic Interactive Section based on Active Tab */}
        <div className="pt-2">
          {activeTab === 'investigate' && (
            <InvestigationHub
              currentCase={currentCase}
              onInvestigateSite={handleInvestigateSite}
              onRaidSafehouse={handleRaidSafehouse}
              onOpenResearchForKeyword={handleOpenResearchForKeyword}
            />
          )}

          {activeTab === 'travel' && (
            <TravelDepartures
              currentCase={currentCase}
              onSelectFlight={handleSelectFlight}
              isFlying={false}
              flyingDestination={null}
            />
          )}

          {activeTab === 'warrant' && (
            <WarrantTerminal
              currentCase={currentCase}
              onIssueWarrant={handleIssueWarrant}
              onRevokeWarrant={handleRevokeWarrant}
            />
          )}

          {activeTab === 'research' && (
            <FieldResearchTerminal
              currentCase={currentCase}
              initialSearchQuery={researchKeyword}
            />
          )}

          {activeTab === 'mission_log' && (
            <MissionLog
              career={career}
              onOpenAntiquitiesVault={() => setIsCareerOpen(true)}
              onStartNewCase={() => handleNextCase()}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 px-3 sm:px-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            The Great Treasure Chase • G.L.O.B.E. Heritage Protection Directorate
          </div>
          <div className="flex items-center gap-4">
            <span>50+ Authentic Artifacts</span>
            <span>•</span>
            <span>40+ World Destinations</span>
            <span>•</span>
            <span>16 Master Thieves</span>
          </div>
        </div>
      </footer>

      {/* Cinematic Travel Animation Modal with Boarding Pass, Flight Arc & Ticking Timer */}
      {pendingFlightDestination && (
        <TravelCinematicModal
          currentCase={currentCase}
          originCity={currentCase.currentCity}
          destinationCity={pendingFlightDestination}
          hoursSpent={pendingFlightHours}
          isOpen={isTravelCinematicOpen}
          onComplete={handleCompleteFlightTransit}
        />
      )}

      {/* Modals */}
      <CaseBriefingModal
        currentCase={currentCase}
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        onStartMission={handleStartMission}
      />

      <ArrestSceneModal
        currentCase={currentCase}
        career={career}
        isOpen={isArrestModalOpen}
        onNextCase={handleNextCase}
        onOpenCareer={() => {
          setIsArrestModalOpen(false);
          setIsCareerOpen(true);
        }}
      />

      <CareerModal
        career={career}
        isOpen={isCareerOpen}
        onClose={() => setIsCareerOpen(false)}
      />
    </div>
  );
}
