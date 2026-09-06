'use client';

// SpeechRecognition type declarations for browsers
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export class VoiceRecognizer {
  private recognition: ISpeechRecognition | null = null;
  private isListening = false;
  private isDesiredActive = false;
  private onTranscriptChange: ((transcript: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStateChange: ((listening: boolean) => void) | null = null;
  private baseTranscript = '';
  private restartTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        try {
          this.recognition = new SpeechRecognitionClass();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';

          this.recognition.onstart = () => {
            this.isListening = true;
            this.onStateChange?.(true);
          };

          this.recognition.onend = () => {
            this.isListening = false;
            // Auto-restart only if still desired active (Chrome 5-sec silence cutoff fix)
            // Add a small delay to prevent rapid restart loops
            if (this.isDesiredActive) {
              if (this.restartTimeout) clearTimeout(this.restartTimeout);
              this.restartTimeout = setTimeout(() => {
                if (this.isDesiredActive && this.recognition) {
                  try {
                    this.recognition.start();
                    return;
                  } catch {
                    // Already started or aborted — safe to ignore
                  }
                }
                this.onStateChange?.(false);
              }, 300);
              return;
            }
            this.onStateChange?.(false);
          };

          this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            // 'no-speech' and 'aborted' are non-fatal — ignore silently
            if (event.error === 'no-speech' || event.error === 'aborted') {
              return;
            }
            console.warn('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
              this.isDesiredActive = false;
              this.onStateChange?.(false);
              this.onErrorCallback?.(
                'Microphone access was denied. Please allow mic access or type your answer below.'
              );
            } else if (event.error === 'audio-capture') {
              this.isDesiredActive = false;
              this.onStateChange?.(false);
              this.onErrorCallback?.('No microphone detected. Please type your answer below.');
            } else if (event.error === 'network') {
              // Network errors can be transient — just notify, don't kill session
              console.warn('Speech recognition network error — will retry on next start.');
            }
          };

          this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            let sessionFinal = '';
            let sessionInterim = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                sessionFinal += res[0].transcript + ' ';
              } else {
                sessionInterim += res[0].transcript;
              }
            }

            // Accumulate finals into base; interim shows live preview
            if (sessionFinal) {
              this.baseTranscript = (this.baseTranscript + ' ' + sessionFinal).replace(/\s+/g, ' ').trim();
            }

            const currentFull = (
              this.baseTranscript +
              (this.baseTranscript && sessionInterim ? ' ' : '') +
              sessionInterim
            )
              .replace(/\s+/g, ' ')
              .trim();

            this.onTranscriptChange?.(currentFull);
          };
        } catch (err) {
          console.warn('Failed to initialize speech recognition:', err);
        }
      }
    }
  }

  isSupported(): boolean {
    return Boolean(this.recognition);
  }

  start(
    onTranscript: (transcript: string) => void,
    onState: (listening: boolean) => void,
    onError: (err: string) => void,
    initialText: string = ''
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    this.onTranscriptChange = onTranscript;
    this.onStateChange = onState;
    this.onErrorCallback = onError;
    this.baseTranscript = initialText;
    this.isDesiredActive = true;

    if (this.isListening) {
      // Already running — update callbacks but don't restart
      return;
    }

    try {
      this.recognition.start();
    } catch {
      // If already started, force-stop then restart
      try {
        this.recognition.stop();
      } catch {}
      if (this.restartTimeout) clearTimeout(this.restartTimeout);
      this.restartTimeout = setTimeout(() => {
        if (this.isDesiredActive) {
          try {
            this.recognition?.start();
          } catch {}
        }
      }, 300);
    }
  }

  stop() {
    this.isDesiredActive = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.isListening = false;
    this.onStateChange?.(false);
  }

  reset() {
    this.baseTranscript = '';
    this.stop();
  }
}
