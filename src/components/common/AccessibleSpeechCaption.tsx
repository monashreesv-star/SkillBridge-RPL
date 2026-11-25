import React, { useState, useEffect } from 'react';
import { SpeechService, CAPTION_EVENT, SpeechCaptionEvent } from '../../services/speechService';
import { Volume2, VolumeX } from 'lucide-react';

export const AccessibleSpeechCaption: React.FC = () => {
  const [caption, setCaption] = useState<SpeechCaptionEvent | null>(null);

  useEffect(() => {
    const handleCaption = (e: Event) => {
      const customEvent = e as CustomEvent<SpeechCaptionEvent>;
      if (customEvent.detail && customEvent.detail.isSpeaking) {
        setCaption(customEvent.detail);
      } else {
        setCaption(null);
      }
    };

    window.addEventListener(CAPTION_EVENT, handleCaption);
    return () => {
      window.removeEventListener(CAPTION_EVENT, handleCaption);
    };
  }, []);

  if (!caption || !caption.isSpeaking || !caption.text) {
    return null;
  }

  const langLabel = caption.lang === 'ta' ? 'தமிழ் ஒலி வாசிப்பு (Tamil Audio)' : caption.lang === 'hi' ? 'हिंदी ध्वनि वाचन (Hindi Audio)' : 'English Voice Read-Aloud';

  return (
    <div
      role="region"
      aria-label="Live Voice Caption Bar"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-indigo-950 text-white p-4 rounded-2xl shadow-2xl border-2 border-indigo-400 z-50 animate-bounce-subtle backdrop-blur-md bg-opacity-95"
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-800">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            {langLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={() => SpeechService.stop()}
          className="flex items-center space-x-1 text-xs bg-indigo-800 hover:bg-rose-600 px-2 py-1 rounded-lg text-indigo-100 transition"
          title="Stop reading aloud"
          aria-label="Stop audio"
        >
          <VolumeX className="h-3.5 w-3.5" />
          <span>Stop</span>
        </button>
      </div>
      <p className="text-sm font-medium text-slate-100 leading-relaxed max-h-24 overflow-y-auto">
        "{caption.text}"
      </p>
    </div>
  );
};
