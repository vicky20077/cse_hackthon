'use client';

export class VoiceSynthesizer {
  private isSpeaking = false;
  private voices: SpeechSynthesisVoice[] = [];
  private onSpeakingChange: ((speaking: boolean) => void) | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private safetyTimeout: ReturnType<typeof setTimeout> | null = null;
  // Chrome bug fix: resume() keepalive to prevent silent pause after ~15s
  private keepAliveInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        this.voices = v;
      }
    }
  }

  // Wait for voices to be available before speaking (async-safe)
  private async ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
    if (this.voices.length > 0) return this.voices;
    return new Promise((resolve) => {
      let attempts = 0;
      const check = () => {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          this.voices = v;
          resolve(this.voices);
        } else if (attempts < 10) {
          attempts++;
          setTimeout(check, 150);
        } else {
          resolve([]);
        }
      };
      check();
    });
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  speak(
    text: string,
    gender: 'male' | 'female' = 'female',
    onState?: (speaking: boolean) => void,
    onFinish?: () => void
  ) {
    if (!this.isSupported() || !text.trim()) {
      onState?.(false);
      onFinish?.();
      return;
    }

    // Stop any in-progress speech first
    this.stop();
    this.onSpeakingChange = onState || null;

    // Clean markdown/code symbols from text for natural TTS
    const cleanText = text
      .replace(/[*_~`#>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Async voice loading to avoid race condition on first load
    this.ensureVoicesLoaded().then((voices) => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;
      utterance.rate = 0.95;
      utterance.pitch = gender === 'female' ? 1.05 : 0.88;
      utterance.volume = 1;

      // Voice selection: prefer natural-sounding English voices
      const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
      let chosenVoice: SpeechSynthesisVoice | undefined;

      if (gender === 'female') {
        chosenVoice =
          englishVoices.find((v) =>
            /samantha|zira|victoria|karen|moira|google us english|jenny|aria|natural|female/i.test(v.name)
          ) || englishVoices.find((v) => v.name.toLowerCase().includes('female'));
      } else {
        chosenVoice =
          englishVoices.find((v) =>
            /david|george|alex|daniel|oliver|guy|mark|natural|male/i.test(v.name)
          ) || englishVoices.find((v) => v.name.toLowerCase().includes('male'));
      }

      // Fallback to first available English voice
      if (!chosenVoice && englishVoices.length > 0) {
        chosenVoice = englishVoices[0];
      }
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      const cleanup = () => {
        if (this.safetyTimeout) {
          clearTimeout(this.safetyTimeout);
          this.safetyTimeout = null;
        }
        // Clear Chrome keepalive
        if (this.keepAliveInterval) {
          clearInterval(this.keepAliveInterval);
          this.keepAliveInterval = null;
        }
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.onSpeakingChange?.(false);
      };

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.onSpeakingChange?.(true);

        // --- Chrome bug fix ---
        // Chrome silently pauses speechSynthesis after ~15s of audio.
        // Calling resume() on a small interval keeps it alive.
        if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
        this.keepAliveInterval = setInterval(() => {
          if (this.isSpeaking && typeof window !== 'undefined') {
            window.speechSynthesis.resume();
          }
        }, 5000);
      };

      utterance.onend = () => {
        cleanup();
        onFinish?.();
      };

      utterance.onerror = (e) => {
        // 'interrupted' is not a real error — happens when stop() is called
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis error:', e.error);
        }
        cleanup();
        onFinish?.();
      };

      try {
        // Resume in case Chrome auto-paused
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);

        // Safety timeout: estimate reading time + generous buffer
        const wordsPerSec = 2.8;
        const approxDurationMs = Math.max(5000, (cleanText.split(' ').length / wordsPerSec) * 1000 + 3000);
        this.safetyTimeout = setTimeout(() => {
          if (this.isSpeaking) {
            cleanup();
            onFinish?.();
          }
        }, approxDurationMs);
      } catch (err) {
        console.warn('Failed to speak with SpeechSynthesis:', err);
        cleanup();
        onFinish?.();
      }
    });
  }

  stop() {
    if (this.safetyTimeout) {
      clearTimeout(this.safetyTimeout);
      this.safetyTimeout = null;
    }
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.onSpeakingChange?.(false);
    }
  }
}

export const voiceSynthesizer = new VoiceSynthesizer();
