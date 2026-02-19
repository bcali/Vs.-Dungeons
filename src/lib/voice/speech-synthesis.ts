// Text-to-speech for combat narration
// Prioritizes natural-sounding voices available in Chrome on iPad/desktop

/** Ranked voice preferences — Chrome has Google voices, macOS/iOS has Apple voices */
const VOICE_PREFERENCES = [
  'Google UK English Male',
  'Google UK English Female',
  'Google US English',
  'Daniel (Enhanced)',
  'Samantha (Enhanced)',
  'Daniel',
  'Samantha',
];

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

/** Resolve the best available voice, caching the result */
function getBestVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice && voicesLoaded) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  voicesLoaded = true;

  // Try each preferred voice in priority order
  for (const pref of VOICE_PREFERENCES) {
    const match = voices.find(v => v.name === pref);
    if (match) {
      cachedVoice = match;
      return match;
    }
  }

  // Fallback: any English voice
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) {
    cachedVoice = englishVoice;
    return englishVoice;
  }

  cachedVoice = voices[0] ?? null;
  return cachedVoice;
}

// Pre-load voices (Chrome fires voiceschanged async)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = false;
    cachedVoice = null;
    getBestVoice();
  };
  // Trigger initial load
  window.speechSynthesis.getVoices();
}

/** Speak a narration string with natural pacing via sentence splitting */
export function speakNarration(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any in-progress speech
  window.speechSynthesis.cancel();

  // Split into sentences for more natural pacing
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);

  const voice = getBestVoice();

  for (const sentence of sentences) {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.volume = 0.85;

    if (voice) utterance.voice = voice;

    utterance.onerror = (event) => {
      console.warn('[speech-synthesis] Error:', event.error);
    };

    window.speechSynthesis.speak(utterance);
  }
}

export function stopNarration(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
