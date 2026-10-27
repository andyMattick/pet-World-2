/* Tiny Web Audio sounds (no files to load). Muting is remembered on this device. */
const MUTE_KEY = 'pax-muted';
let ctx: AudioContext | null = null;
export function isMuted() { try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; } }
export function setMuted(m: boolean) { try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch { /* private mode */ } }

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.08, delay = 0) {
  if (isMuted()) return;
  try {
    ctx ||= new AudioContext();
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur);
  } catch { /* no audio */ }
}
export const sfx = {
  click: () => tone(660, 0.06, 'triangle', 0.05),
  coin: () => { tone(988, 0.08, 'square', 0.04); tone(1319, 0.12, 'square', 0.04, 0.07); },
  build: () => { tone(220, 0.12, 'triangle'); tone(330, 0.14, 'triangle', 0.08, 0.1); },
  error: () => tone(150, 0.18, 'sawtooth', 0.05),
  raid: () => { tone(110, 0.3, 'sawtooth', 0.07); tone(90, 0.35, 'sawtooth', 0.06, 0.15); },
  fanfare: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.07, i * 0.12)),
  discover: () => [784, 988, 1175].forEach((f, i) => tone(f, 0.15, 'sine', 0.06, i * 0.08)),
};
