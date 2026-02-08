// Web Speech API wrapper for voice input

export type VoiceState = 'idle' | 'listening' | 'confirming' | 'processing' | 'resolved' | 'clarification' | 'error';

export interface VoiceInputConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
}

/** Check if Web Speech API is available */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/** Create a speech recognition instance */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSpeechRecognition(config: VoiceInputConfig): any | null {
  if (!isSpeechRecognitionSupported()) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognitionCtor = (window as any).webkitSpeechRecognition ?? (window as any).SpeechRecognition;
  const recognition = new SpeechRecognitionCtor();

  recognition.lang = config.language ?? 'en-US';
  recognition.continuous = config.continuous ?? false;
  recognition.interimResults = config.interimResults ?? true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    const last = event.results[event.results.length - 1];
    const transcript = last[0].transcript;
    config.onResult(transcript, last.isFinal);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    config.onError(event.error);
  };

  recognition.onstart = config.onStart;
  recognition.onend = config.onEnd;

  return recognition;
}
