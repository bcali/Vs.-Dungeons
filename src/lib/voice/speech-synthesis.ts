// Text-to-speech for combat narration

export function speakNarration(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 0.8;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Daniel') || v.name.includes('Samantha'));
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

export function stopNarration(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
