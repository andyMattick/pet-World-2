import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

/* The smoke test (scripts/smoke.mjs) can stand in for Supabase before the page loads: 'local' forces local mode, and an
   object with makeClient() is used instead of a real client. Nothing in the app sets this. */
const fake = (globalThis as unknown as { __PET_TOWN_FAKE_BACKEND__?: 'local' | { makeClient: (storageKey: string) => SupabaseClient } }).__PET_TOWN_FAKE_BACKEND__;

/** True when the app is built with Supabase settings. Without them the game runs in local (browser-only) mode. */
export const backendConfigured = fake === 'local' ? false : !!fake || !!(url && anonKey);

/**
 * Students and teachers get separate auth storage so a teacher testing the game
 * in the same browser never collides with a student's sign-in.
 */
export function makeClient(storageKey: 'pt-student' | 'pt-teacher'): SupabaseClient | null {
  if (!backendConfigured) return null;
  if (fake && fake !== 'local') return fake.makeClient(storageKey);
  return createClient(url as string, anonKey as string, {
    auth: { storageKey, persistSession: true, autoRefreshToken: true }
  });
}
