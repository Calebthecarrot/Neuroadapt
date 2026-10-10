import React, { useState, useRef } from 'react';
import {
  Brain,
  Sparkles,
  Zap,
  Sun,
  Leaf,
  Wind,
  CircleDot,
  ShieldAlert,
  Flame,
  CheckCircle2,
  ChevronRight,
  Eye,
  Sliders
} from 'lucide-react';
import { LessonContent, LearnerProfile, VisualCard } from '../types';
import { parseBionicText } from '../utils/bionicReading';

interface VisualModalityViewProps {
  lesson: LessonContent;
  profile: LearnerProfile;
  onRecordInteraction: () => void;
}

export const VisualModalityView: React.FC<VisualModalityViewProps> = ({
  lesson,
  profile,
  onRecordInteraction,
}) => {
  const [rulerTop, setRulerTop] = useState<number | null>(null);
  const [expandedNodeIndex, setExpandedNodeIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const bionicWords = React.useMemo(() => {
    return parseBionicText(lesson.visualFormat.plainText);
  }, [lesson.visualFormat.plainText]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!profile.dyslexiaSettings.readingRuler || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    setRulerTop(relativeY);
  };

  const getCardIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'brain': return <Brain className="w-5 h-5" />;
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'sun': return <Sun className="w-5 h-5" />;
      case 'leaf': return <Leaf className="w-5 h-5" />;
      case 'wind': return <Wind className="w-5 h-5" />;
      case 'circledot': return <CircleDot className="w-5 h-5" />;
      case 'shieldalert': return <ShieldAlert className="w-5 h-5" />;
      case 'flame': return <Flame className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getOverlayClass = () => {
    switch (profile.dyslexiaSettings.colorOverlay) {
      case 'amber': return 'bg-amber-50/60 border-amber-200';
      case 'peach': return 'bg-orange-50/60 border-orange-200';
      case 'sage': return 'bg-emerald-50/60 border-emerald-200';
      case 'cyan': return 'bg-cyan-50/60 border-cyan-200';
      case 'night': return 'bg-slate-100/70 border-slate-300';
      default: return 'bg-white border-neutral-200';
    }
  };

  const getFontClass = () => {
    switch (profile.dyslexiaSettings.fontFamily) {
      case 'lexend': return 'font-[Lexend]';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Reading Card with Bionic Reading & Reading Ruler */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRulerTop(null)}
        className={`rounded-2xl border p-6 shadow-xs relative overflow-hidden transition-colors ${getOverlayClass()} ${getFontClass()}`}
      >
        {/* Visual Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200/80">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <Eye className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Visual & Bionic Reading Engine
              </span>
              <h3 className="text-base font-extrabold text-neutral-900 leading-tight">
                {lesson.topic}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile.dyslexiaSettings.bionicReading && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Bionic Fixations Active
              </span>
            )}
            {profile.dyslexiaSettings.colorOverlay !== 'none' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 capitalize">
                {profile.dyslexiaSettings.colorOverlay} Tint
              </span>
            )}
          </div>
        </div>

        {/* Focus Reading Ruler Guide Line */}
        {profile.dyslexiaSettings.readingRuler && rulerTop !== null && (
          <div
            className="absolute left-0 right-0 h-10 pointer-events-none bg-indigo-500/10 border-y-2 border-indigo-500/30 transition-all duration-75 z-10"
            style={{ top: `${Math.max(10, rulerTop - 20)}px` }}
          />
        )}

        {/* Text Body: Either Bionic or Plain */}
        <div className="relative z-0">
          <div className="text-lg leading-relaxed text-neutral-800 select-text">
            {profile.dyslexiaSettings.bionicReading ? (
              <p className="flex flex-wrap gap-x-1.5 gap-y-1">
                {bionicWords.map((word, i) => (
                  <span key={i} className="inline-block">
                    <strong className="font-extrabold text-neutral-950">{word.bold}</strong>
                    <span className="font-normal text-neutral-700">{word.normal}</span>
                  </span>
                ))}
              </p>
            ) : (
              <p>{lesson.visualFormat.plainText}</p>
            )}
          </div>
        </div>

        {/* Dyslexia Hint Footer */}
        <div className="mt-5 pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-700">
          <span>✨ Tip: Move cursor to activate the eye-tracking guide ruler.</span>
          <span className="font-semibold text-neutral-800">Lexend Typeface Support</span>
        </div>
      </div>

      {/* Visual Memory Cards (Mnemonic & High-Contrast Anchors) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Mnemonic Flash Anchors (Visual Working Memory)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lesson.visualFormat.cards.map((card: VisualCard, idx: number) => (
            <div
              key={idx}
              onClick={onRecordInteraction}
              className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer group"
              style={{ borderTopWidth: '4px', borderTopColor: card.accentColor }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="p-2 rounded-xl text-white shadow-xs"
                  style={{ backgroundColor: card.accentColor }}
                >
                  {getCardIcon(card.iconName)}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  Concept {idx + 1}
                </span>
              </div>

              <h5 className="text-base font-extrabold text-neutral-900 mb-1.5">
                {card.title}
              </h5>
              <p className="text-xs text-neutral-700 leading-relaxed mb-3">
                {card.description}
              </p>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150 text-xs font-semibold text-neutral-800 flex items-center gap-2">
                <span className="text-amber-600 font-bold">💡 Mnemonic:</span>
                <span className="line-clamp-1">{card.mnemonic}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Concept Mind Map */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            Interactive Concept Mind Map
          </h4>
          <span className="text-xs text-neutral-700">Tap branches to explore</span>
        </div>

        {/* Central Root Concept */}
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Central Core</span>
          <h5 className="text-base font-extrabold text-purple-950">
            {lesson.visualFormat.mindMap.centralConcept}
          </h5>
        </div>

        {/* Branches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lesson.visualFormat.mindMap.branches.map((branch, bIdx) => {
            const isExpanded = expandedNodeIndex === bIdx;
            return (
              <div
                key={bIdx}
                onClick={() => {
                  onRecordInteraction();
                  setExpandedNodeIndex(isExpanded ? null : bIdx);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isExpanded
                    ? 'border-purple-500 bg-purple-50/40 ring-2 ring-purple-500/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h6 className="text-sm font-bold text-neutral-900">{branch.title}</h6>
                  <ChevronRight
                    className={`w-4 h-4 text-neutral-700 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                <p className="text-xs text-neutral-700 mb-2">{branch.detail}</p>

                {isExpanded && branch.children && (
                  <div className="pt-2 border-t border-neutral-200/70 space-y-1.5">
                    {branch.children.map((child, cIdx) => (
                      <div
                        key={cIdx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-medium text-neutral-800 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        {child}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
