/**
 * SpeechService
 * Provides robust Text-to-Speech (TTS) Voice Read-Aloud for low-literacy informal workers.
 * Supports English, Hindi (हिंदी), and Tamil (தமிழ்).
 *
 * Guaranteed Multi-Tier Voice Architecture:
 * Tier 1: Real Native Browser Voice (Google தமிழ், Microsoft Valluvar, ta-IN / Google हिन्दी, Microsoft Hemant, hi-IN).
 * Tier 2: Deterministic Indian Voice Phonetic Transliteration (speaks fluent Tamil/Hindi via Indian English engine en-IN when Windows lacks regional voice packs).
 * Tier 3: Real-time visual caption display with audio wave animation (WCAG 2.2 AA).
 */

import { Language } from './localizationService';

export interface SpeechCaptionEvent {
  text: string;
  isSpeaking: boolean;
  lang: Language;
}

export const CAPTION_EVENT = 'skillbridge:speech_caption';

/**
 * Phonetic Transliteration Engine for Tamil
 * Converts Tamil Unicode script to pronounceable Tamil phonetics for Indian speech synthesis engines.
 */
function convertTamilToPhonetic(tamilText: string): string {
  const vowels: Record<string, string> = {
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo',
    'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oa', 'ஔ': 'au',
    'ஃ': 'akh',
  };

  const consonants: Record<string, string> = {
    'க': 'ka', 'ங': 'nga', 'ச': 'sa', 'ஞ': 'nya', 'ட': 'ta',
    'ண': 'na', 'த': 'tha', 'ந': 'na', 'ப': 'pa', 'ம': 'ma',
    'ய': 'ya', 'ர': 'ra', 'ல': 'la', 'வ': 'va', 'ழ': 'zha',
    'ள': 'la', 'ற': 'ra', 'ன': 'na', 'ஜ': 'ja', 'ஷ': 'sha',
    'ஸ': 'sa', 'ஹ': 'ha',
  };

  const matras: Record<string, string> = {
    'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo',
    'ெ': 'e', 'ே': 'ae', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oa',
    'ௌ': 'au',
  };

  const PULLI = '்';

  let result = '';
  const chars = Array.from(tamilText);

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1];

    if (vowels[char]) {
      result += vowels[char];
    } else if (consonants[char]) {
      const base = consonants[char].slice(0, -1); // remove inherent 'a'
      if (nextChar === PULLI) {
        result += base;
        i++; // skip pulli
      } else if (nextChar && matras[nextChar]) {
        result += base + matras[nextChar];
        i++; // skip matra
      } else {
        result += consonants[char]; // keep inherent 'a'
      }
    } else {
      result += char;
    }
  }

  return result
    .replace(/\s+/g, ' ')
    .replace(/PTFE/gi, 'Teflon')
    .replace(/RCCB/gi, 'Earth Leakage Breaker')
    .trim();
}

/**
 * Phonetic Transliteration Engine for Hindi
 */
function convertHindiToPhonetic(hindiText: string): string {
  const vowels: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ं': 'n',
  };

  const consonants: Record<string, string> = {
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'च': 'cha', 'छ': 'chha',
    'ज': 'ja', 'झ': 'jha', 'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha',
    'ण': 'na', 'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma', 'य': 'ya',
    'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
  };

  const matras: Record<string, string> = {
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n',
  };

  const HALANT = '्';

  let result = '';
  const chars = Array.from(hindiText);

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1];

    if (vowels[char]) {
      result += vowels[char];
    } else if (consonants[char]) {
      const base = consonants[char].slice(0, -1);
      if (nextChar === HALANT) {
        result += base;
        i++;
      } else if (nextChar && matras[nextChar]) {
        result += base + matras[nextChar];
        i++;
      } else {
        result += consonants[char];
      }
    } else {
      result += char;
    }
  }

  return result.replace(/\s+/g, ' ').trim();
}

class SpeechServiceImpl {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private isVoiceListLoaded = false;
  private isCurrentlySpeaking = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    try {
      const live = window.speechSynthesis.getVoices();
      if (live && live.length > 0) {
        this.cachedVoices = live;
        this.isVoiceListLoaded = true;
      }
    } catch {
      // ignore
    }
    return this.cachedVoices;
  }

  private loadVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        this.cachedVoices = v;
        this.isVoiceListLoaded = true;
      }
    } catch {
      // ignore
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  public isVoiceLoaded(): boolean {
    return this.isVoiceListLoaded;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public stop(): void {
    this.isCurrentlySpeaking = false;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('Error cancelling speech synthesis:', err);
      }
    }

    this.currentUtterance = null;
    this.emitCaption('', false, 'en');
  }

  private emitCaption(text: string, isSpeaking: boolean, lang: Language): void {
    if (typeof window === 'undefined') return;
    const event = new CustomEvent<SpeechCaptionEvent>(CAPTION_EVENT, {
      detail: { text, isSpeaking, lang },
    });
    window.dispatchEvent(event);
  }

  /**
   * Finds a genuine native voice for Tamil or Hindi if available on the client device.
   */
  public findNativeVoice(lang: Language): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    if (lang === 'ta') {
      return (
        voices.find((v) => {
          const l = (v.lang || '').toLowerCase().replace('_', '-');
          const n = (v.name || '').toLowerCase();
          return (
            l === 'ta-in' ||
            l === 'ta-lk' ||
            l.startsWith('ta') ||
            n.includes('tamil') ||
            n.includes('தமிழ்') ||
            n.includes('valluvar') ||
            n.includes('iniyan') ||
            n.includes('vani') ||
            n.includes('latha') ||
            n.includes('kavitha')
          );
        }) || null
      );
    }

    if (lang === 'hi') {
      return (
        voices.find((v) => {
          const l = (v.lang || '').toLowerCase().replace('_', '-');
          const n = (v.name || '').toLowerCase();
          return (
            l === 'hi-in' ||
            l.startsWith('hi') ||
            n.includes('hindi') ||
            n.includes('हिन्दी') ||
            n.includes('hemant') ||
            n.includes('kalpana') ||
            n.includes('madhur') ||
            n.includes('swara')
          );
        }) || null
      );
    }

    // English
    return (
      voices.find((v) => (v.lang || '').toLowerCase() === 'en-in') ||
      voices.find((v) => (v.lang || '').toLowerCase().startsWith('en')) ||
      null
    );
  }

  /**
   * Finds an Indian accent voice (en-IN) which authenticates and pronounces Tamil & Hindi phonetics clearly.
   */
  public findIndianVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    return (
      voices.find((v) => {
        const l = (v.lang || '').toLowerCase().replace('_', '-');
        const n = (v.name || '').toLowerCase();
        return (
          l === 'en-in' ||
          n.includes('india') ||
          n.includes('ravi') ||
          n.includes('heera') ||
          n.includes('neerja') ||
          n.includes('prabhat')
        );
      }) ||
      voices.find((v) => (v.lang || '').toLowerCase().startsWith('en')) ||
      voices[0] ||
      null
    );
  }

  /**
   * Speaks the requested text in the selected language.
   * If the host OS (e.g. standard Windows) lacks native Tamil or Hindi speech packages,
   * it dynamically applies phonetic conversion and vocalizes through an Indian speech engine.
   */
  public speak(
    text: string,
    lang: Language = 'en',
    onEnd?: () => void,
    captionText?: string,
    fallbackPhoneticText?: string
  ): boolean {
    if (!this.isSupported() || !text.trim()) return false;

    this.stop();
    this.isCurrentlySpeaking = true;

    // Show the authentic native script in the visual caption bar
    this.emitCaption(captionText || text, true, lang);

    const handleComplete = () => {
      this.isCurrentlySpeaking = false;
      this.currentUtterance = null;
      this.emitCaption('', false, lang);
      if (onEnd) onEnd();
    };

    try {
      // Resume speech synthesis queue if paused by browser idle state
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }

      const nativeVoice = this.findNativeVoice(lang);
      let textToVocalize = text;
      let voiceToUse = nativeVoice;
      let targetLang = 'en-IN';
      let speechRate = 0.85;

      if (lang === 'ta') {
        if (nativeVoice) {
          textToVocalize = (captionText || text)
            .replace(/\(PTFE\)/gi, 'டெப்லான்')
            .replace(/PTFE/gi, 'டெப்லான்')
            .replace(/RCCB/gi, 'ஆர்.சி.சி.பி.')
            .replace(/Voc/gi, 'வோல்டேஜ்')
            .replace(/Isc/gi, 'கரண்ட்')
            .replace(/sq\.mm/gi, 'சதுர மிமீ')
            .replace(/P-trap/gi, 'பி ட்ராப்')
            .replace(/S-trap/gi, 'எஸ் ட்ராப்')
            .replace(/OBD-II/gi, 'ஓ பி டி இரண்டு')
            .replace(/P0300/gi, 'பி 0 3 0 0')
            .replace(/WHO/gi, 'உலக சுகாதார அமைப்பு');
          voiceToUse = nativeVoice;
          targetLang = 'ta-IN';
          speechRate = 0.85;
        } else {
          // Fall back to clean, natural phonetic pronunciation when native Tamil voice pack is not on system
          textToVocalize = fallbackPhoneticText || (
            /[\u0B80-\u0BFF]/.test(text) ? convertTamilToPhonetic(text) : text
          );
          voiceToUse = this.findIndianVoice();
          targetLang = 'en-IN';
          speechRate = 0.80; // Slower cadence with distinct syllable timing for optimal comprehensibility
        }
      } else if (lang === 'hi') {
        if (nativeVoice) {
          textToVocalize = (captionText || text)
            .replace(/\(PTFE\)/gi, 'टेफ्लॉन')
            .replace(/PTFE/gi, 'टेफ्लॉन')
            .replace(/RCCB/gi, 'आर सी सी बी')
            .replace(/Voc/gi, 'वोल्टेज')
            .replace(/Isc/gi, 'करंट')
            .replace(/P-trap/gi, 'पी ट्रैप')
            .replace(/S-trap/gi, 'एस ट्रैप')
            .replace(/WHO/gi, 'डब्ल्यू एच ओ');
          voiceToUse = nativeVoice;
          targetLang = 'hi-IN';
          speechRate = 0.85;
        } else {
          textToVocalize = fallbackPhoneticText || (
            /[\u0900-\u097F]/.test(text) ? convertHindiToPhonetic(text) : text
          );
          voiceToUse = this.findIndianVoice();
          targetLang = 'en-IN';
          speechRate = 0.80;
        }
      } else {
        voiceToUse = this.findIndianVoice() || nativeVoice;
        targetLang = 'en-IN';
        speechRate = 0.88;
        textToVocalize = text
          .replace(/Voc\s*=\s*/gi, 'Voltage ')
          .replace(/Isc\s*=\s*/gi, 'Current ')
          .replace(/PTFE/gi, 'Teflon ')
          .replace(/RCCB/gi, 'Earth Leakage Breaker ');
      }

      const utterance = new SpeechSynthesisUtterance(textToVocalize);
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }
      utterance.lang = targetLang;
      utterance.rate = speechRate;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        handleComplete();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        handleComplete();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('Speech invocation failed:', err);
      handleComplete();
      return false;
    }
  }
}

export const SpeechService = new SpeechServiceImpl();
