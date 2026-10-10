import React, { useState } from 'react';
import {
  Sparkles,
  X,
  BookOpen,
  Zap,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LessonContent, NeuroCondition, ModalityFormat } from '../types';

interface LessonGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLessonGenerated: (lesson: LessonContent) => void;
  currentCondition: NeuroCondition;
}

export const LessonGeneratorModal: React.FC<LessonGeneratorModalProps> = ({
  isOpen,
  onClose,
  onLessonGenerated,
  currentCondition,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [condition, setCondition] = useState<NeuroCondition>(currentCondition);
  const [preferredFormat, setPreferredFormat] = useState<ModalityFormat>('visual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickTopics = [
    'How Neural Networks & AI Learn',
    'The Nervous System & Reflexes',
    'Quantum Computing Explained with Cats',
    'Ancient Egypt & Building the Pyramids',
    'How Music Alters Brain Chemistry',
  ];

  const handleGenerate = async (topicToUse?: string) => {
    const finalTopic = (topicToUse || topicInput).trim();
    if (!finalTopic) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/adapt-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: finalTopic,
          condition,
          preferredFormat,
        }),
      });

      if (!res.ok) {
        let msg = `Server returned ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.error) {
            msg = typeof errData.error === 'string' ? errData.error : JSON.stringify(errData.error);
          }
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const lesson: LessonContent = await res.json();
      onLessonGenerated(lesson);
      onClose();
    } catch (err: unknown) {
      console.error('Adaptive lesson error:', err);
      const msg = err instanceof Error ? err.message : 'Temporary connection delay';
      setError(`Notice: ${msg}. You can retry or select a curated topic below.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden text-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 leading-tight">
                AI Adaptive Lesson Generator
              </h3>
              <p className="text-xs text-neutral-700">Powered by Gemini 3.8 Flash</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Topic Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2">
              Enter Any Topic or Paste Study Notes
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. How electricity flows, The French Revolution, Mitochondria..."
              className="w-full p-3.5 rounded-xl border border-neutral-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium outline-hidden transition-all"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
            />
          </div>

          {/* Quick Suggestions Chips */}
          <div>
            <span className="text-xs font-semibold text-neutral-700 block mb-2">
              Or Try a Curated Prompt:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickTopics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTopicInput(t);
                    handleGenerate(t);
                  }}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-indigo-400 bg-neutral-50 hover:bg-indigo-50 text-xs font-medium text-neutral-800 transition-colors text-left"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>

          {/* Target Learner Profile */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100">
            {[
              { id: 'adhd', label: 'ADHD Mode', icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
              { id: 'dyslexia', label: 'Dyslexia Mode', icon: <Eye className="w-3.5 h-3.5 text-emerald-600" /> },
              { id: 'combined', label: 'Combined', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCondition(c.id as NeuroCondition)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  condition === c.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {c.icon}
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading || !topicInput.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Adapting for Neurodiversity...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Multimodal Lesson</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
