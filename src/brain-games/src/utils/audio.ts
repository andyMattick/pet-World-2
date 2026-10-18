// Zero-dependency Web Audio API synthesizer for instant tactile game feedback

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let zenModeActive = false;
let zenMusicPlaying = false;
let zenMasterGain: GainNode | null = null;
let zenOscillators: OscillatorNode[] = [];
let zenLfoNode: OscillatorNode | null = null;
let zenBellTimeout: NodeJS.Timeout | null = null;
let zenVolume = 0.22;

export const initAudio = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('neuro_sound_enabled', enabled ? '1' : '0');
  }
  if (!enabled && zenMusicPlaying) {
    stopZenMusic();
  }
};

export const getSoundEnabled = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('neuro_sound_enabled');
    if (saved !== null) {
      return saved === '1';
    }
  }
  return true;
};

export const getZenModeEnabled = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('neuro_zen_mode_enabled') === '1';
  }
  return false;
};

export const setZenModeEnabled = (enabled: boolean) => {
  zenModeActive = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('neuro_zen_mode_enabled', enabled ? '1' : '0');
  }
  if (enabled) {
    startZenMusic();
  } else {
    stopZenMusic();
  }
};

export const getZenVolume = (): number => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('neuro_zen_volume');
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return zenVolume;
};

export const setZenVolume = (vol: number) => {
  zenVolume = Math.max(0, Math.min(1, vol));
  if (typeof window !== 'undefined') {
    localStorage.setItem('neuro_zen_volume', zenVolume.toString());
  }
  if (zenMasterGain && audioCtx) {
    zenMasterGain.gain.setTargetAtTime(zenVolume * 0.45, audioCtx.currentTime, 0.1);
  }
};

export const isZenMusicActive = (): boolean => {
  return zenMusicPlaying;
};

// Generates an ethereal, peaceful Tibetan bowl and ambient drone soundscape
export const startZenMusic = () => {
  if (zenMusicPlaying) return;
  initAudio();
  if (!audioCtx) return;

  zenMusicPlaying = true;
  const now = audioCtx.currentTime;

  // Master Gain for ambient music with smooth fade-in
  const masterGain = audioCtx.createGain();
  const currentVol = getZenVolume();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(currentVol * 0.45, now + 1.8);
  masterGain.connect(audioCtx.destination);
  zenMasterGain = masterGain;

  // Lowpass filter for warm, soothing, non-distracting analog tone
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(360, now);
  filter.Q.setValueAtTime(1.8, now);
  filter.connect(masterGain);

  // LFO (Low-frequency oscillator) that slowly sweeps the filter like calm breathing
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.08, now); // 12.5 second breath period
  lfoGain.gain.setValueAtTime(140, now); // Sweeps between 220Hz and 500Hz
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start(now);
  zenLfoNode = lfo;

  // Calming open pentatonic drone frequencies (C3, G3, D4, A4, E4)
  const droneFrequencies = [130.81, 196.00, 293.66, 329.63, 440.00];
  zenOscillators = [];

  droneFrequencies.forEach((freq, idx) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    // Slight detune for warm analog chorus warmth
    const detuneCents = (idx - 2) * 3.5;
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detuneCents, now);

    const relativeVol = idx === 0 ? 0.09 : idx === 1 ? 0.07 : 0.04;
    oscGain.gain.setValueAtTime(relativeVol, now);

    osc.connect(oscGain);
    oscGain.connect(filter);

    osc.start(now);
    zenOscillators.push(osc);
  });

  // Generative Tibetan Singing Bowl / Wind Chime bells generator
  const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C, D, E, G, A
  const scheduleNextBell = () => {
    if (!zenMusicPlaying || !audioCtx) return;

    const chimeDelayMs = 4000 + Math.random() * 4500;
    zenBellTimeout = setTimeout(() => {
      if (!zenMusicPlaying || !audioCtx) return;
      playZenChime(pentatonicScale);
      scheduleNextBell();
    }, chimeDelayMs);
  };

  scheduleNextBell();
};

const playZenChime = (notes: number[]) => {
  if (!audioCtx || !zenMasterGain) return;
  const now = audioCtx.currentTime;
  const freq = notes[Math.floor(Math.random() * notes.length)];

  // Bell fundamental
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, now);
  gain1.gain.setValueAtTime(0.04, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

  // Bell partial harmonic (overtone ~2.76x characteristic of singing bowl)
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2.76, now);
  gain2.gain.setValueAtTime(0.015, now);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

  osc1.connect(gain1);
  gain1.connect(zenMasterGain);
  osc2.connect(gain2);
  gain2.connect(zenMasterGain);

  osc1.start(now);
  osc1.stop(now + 3.9);
  osc2.start(now);
  osc2.stop(now + 2.5);
};

export const stopZenMusic = () => {
  if (!zenMusicPlaying) return;
  zenMusicPlaying = false;

  if (zenBellTimeout) {
    clearTimeout(zenBellTimeout);
    zenBellTimeout = null;
  }

  if (zenMasterGain && audioCtx) {
    const now = audioCtx.currentTime;
    zenMasterGain.gain.setValueAtTime(zenMasterGain.gain.value, now);
    zenMasterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

    setTimeout(() => {
      zenOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore if already stopped
        }
      });
      zenOscillators = [];

      if (zenLfoNode) {
        try {
          zenLfoNode.stop();
          zenLfoNode.disconnect();
        } catch {
          // Ignore
        }
        zenLfoNode = null;
      }

      if (zenMasterGain) {
        try {
          zenMasterGain.disconnect();
        } catch {
          // Ignore
        }
        zenMasterGain = null;
      }
    }, 1300);
  }
};

// Play a pleasant acoustic tap
export const playTap = () => {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  const baseGain = zenModeActive ? 0.045 : 0.08;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(540, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.04);

  gain.gain.setValueAtTime(baseGain, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.04);
};

// Play a positive harmonic chime for correct responses
export const playSuccess = () => {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 triad
  const baseGain = zenModeActive ? 0.035 : 0.06;

  notes.forEach((freq, idx) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.04);

    gain.gain.setValueAtTime(baseGain, now + idx * 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + idx * 0.04);
    osc.stop(now + idx * 0.04 + 0.16);
  });
};

// Play a subtle low thud for incorrect answers
export const playError = () => {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  const baseGain = zenModeActive ? 0.04 : 0.08;
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

  gain.gain.setValueAtTime(baseGain, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
};

// Play high-frequency chime for milestone streaks
export const playStreak = () => {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const notes = [659.25, 783.99, 1046.5]; // E5, G5, C6

  notes.forEach((freq, idx) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);

    gain.gain.setValueAtTime(0.07, now + idx * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.22);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + idx * 0.05);
    osc.stop(now + idx * 0.05 + 0.22);
  });
};

// Play victory chime at end of session
export const playVictory = () => {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const chord = [523.25, 659.25, 783.99, 1046.5];

  chord.forEach((freq, idx) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.08, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.4);
  });
};

// Letter voice prompt simulation for N-Back (spoken letter synth or distinct tones)
export const playLetterTone = (letter: string) => {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  // Map letters A-Z to unique harmonic frequencies in pentatonic range
  const code = letter.charCodeAt(0) - 65;
  const baseFreq = 300 + (code % 8) * 60;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.18);
};
