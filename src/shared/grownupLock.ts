/* The grown-up lock on the teacher app (docs/TEACHER-LOCK.md). On a computer the student also uses, the teacher app
   stays signed in, so a 4-digit PIN locks it on that device. The PIN is the student's grown-up PIN: the 👩‍🏫 button
   in the game asks for it, sets the lock if the device has none, and opens the teacher app unlocked for that tab.
   Only a hash is kept, in this browser's localStorage; an unlocked tab is remembered in sessionStorage. */

const LOCK_KEY = 'pw-teacher-lock', UNLOCK_KEY = 'pw-teacher-unlocked';

/** The same hash as the game's grown-up PIN (game.js pinHash), so one PIN works in both places. */
export const lockHash = (pin: string) => { let h = 5381; for (const c of 'pet-town:' + pin) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0; return h.toString(36); };

const read = (store: () => Storage, key: string) => { try { return store().getItem(key) || ''; } catch { return ''; } };
const write = (store: () => Storage, key: string, value: string | null) => { try { if (value == null) store().removeItem(key); else store().setItem(key, value); } catch { /* storage blocked: the lock just isn't kept */ } };

export const teacherLock = () => read(() => localStorage, LOCK_KEY);
export const setTeacherLock = (pin: string | null) => write(() => localStorage, LOCK_KEY, pin == null ? null : lockHash(pin));
export const isUnlocked = () => !teacherLock() || read(() => sessionStorage, UNLOCK_KEY) === teacherLock();
export const markUnlocked = () => write(() => sessionStorage, UNLOCK_KEY, teacherLock());
export const relock = () => write(() => sessionStorage, UNLOCK_KEY, null);
export const pinMatchesLock = (pin: string) => !!teacherLock() && lockHash(pin) === teacherLock();
