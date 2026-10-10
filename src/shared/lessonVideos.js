/* Pet Town lesson videos (docs: LESSON-VIDEOS.md).
   Every lesson that has our own video, keyed like lesson_links:
     "<courseId>:<groupId>"                 an English, History or Biology block (the Khan link at the top of the block)
     "<courseId>:<groupId>:<n>"             an extra reading in that block
     "math:<shopId>:<stationId>"            a math station, for example "math:cafe:2"
     "math:<skillId>"                       one math skill that needs its own example
   A lesson listed here shows "Watch the lesson" (played inside Pet Town) instead of its Khan link.
   A lesson not listed here keeps its Khan link. A teacher's own link (lesson_links) still wins for that class.

   Edit this list with scripts/set-video.mjs, not by hand:
     node scripts/set-video.mjs bio1:cells https://youtu.be/<id> --kind placeholder --minutes 4.5 --title "Cells"
   Everything between the two VIDEO LIST lines is rewritten by that script. */

/* VIDEO LIST START */
export const LESSON_VIDEOS = {
  "bio1:cells": {"title":"Cells: the building blocks of life","video":{"youtube":"TocmZ8cpXnc","kind":"placeholder","minutes":3.4,"updated":"2026-10-10"}}
};
/* VIDEO LIST END */

export const VIDEO_KINDS = ['placeholder', 'recorded'];
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/* A YouTube video id from an id or any usual YouTube link, or null. */
export function youtubeId(text){
  const value = String(text || '').trim();
  if (YOUTUBE_ID.test(value)) return value;
  let url;
  try { url = new URL(value); } catch { return null; }
  if (!/(^|\.)youtube(-nocookie)?\.com$|(^|\.)youtu\.be$/.test(url.hostname)) return null;
  const id = url.hostname.endsWith('youtu.be') ? url.pathname.slice(1)
    : url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1] || '';
  return YOUTUBE_ID.test(id) ? id : null;
}

/* The video for a lesson key, cleaned up, or null if the lesson has no usable video yet. */
export function lessonVideo(key, list = LESSON_VIDEOS){
  const entry = list && typeof key === 'string' ? list[key] : null;
  const id = entry && typeof entry === 'object' ? youtubeId(entry.video?.youtube) : null;
  if (!id) return null;
  const minutes = Number(entry.video.minutes);
  return {
    key, title: typeof entry.title === 'string' && entry.title.trim() ? entry.title.trim().slice(0, 120) : 'Watch the lesson',
    youtube: id, kind: VIDEO_KINDS.includes(entry.video.kind) ? entry.video.kind : 'placeholder',
    minutes: Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes * 10) / 10 : null
  };
}

/* The privacy-enhanced embed: captions on, no related videos from other channels, JS events for watched tracking. */
export function videoEmbedUrl(id, origin = ''){
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', cc_load_policy: '1', playsinline: '1', enablejsapi: '1' });
  if (origin) params.set('origin', origin);
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}
