import React from 'react';
import { Bot, ArrowRight, X, Sparkles } from 'lucide-react';
import { ModalityFormat } from '../types';

interface AdaptiveNudgeBannerProps {
  reason: string;
  recommendedModality: 'audio' | 'visual' | 'interactive';
  onAccept: () => void;
  onDismiss: () => void;
}

export const AdaptiveNudgeBanner: React.FC<AdaptiveNudgeBannerProps> = ({
  reason,
  recommendedModality,
  onAccept,
  onDismiss,
}) => {
  return (
    <div className="rounded-2xl border border-indigo-300 bg-linear-to-r from-indigo-900 to-slate-900 text-white p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-indigo-200" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Real-Time Adaptive Companion
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-neutral-100 max-w-xl leading-snug">
            {reason}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onAccept}
          className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 capitalize"
        >
          <span>Switch to {recommendedModality}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onDismiss}
          className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
