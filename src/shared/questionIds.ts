/* Stable ids for bank questions, so a class can hide or edit a built-in question without the banks
   needing ids of their own. The id comes from the question's text: if a built-in prompt or its correct
   answer is later changed in code, any hide or edit saved for the old text stops applying (the question
   simply shows again as built-in). That's acceptable; the teacher can hide or edit it again. */

const normalize = (text: string) => String(text ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

/* FNV-1a 32-bit hash, in base 36 */
export function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/* `${courseId}:${skillId}:${hash}`. The correct answer is part of the hash because a few lessons
   have two questions with the same prompt ("Which sentence is correct?"). */
export function questionId(courseId: string, skillId: string, prompt: string, correct = ''): string {
  return `${courseId}:${skillId}:${fnv1a(normalize(prompt) + (correct ? `\u0000${normalize(correct)}` : ''))}`;
}
