import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Award,
  Flame,
  RotateCcw
} from 'lucide-react';
import { LessonContent, LearnerProfile, MicroChallenge } from '../types';

interface InteractiveModalityViewProps {
  lesson: LessonContent;
  profile: LearnerProfile;
  onRecordInteraction: () => void;
  onAwardXP: (points: number) => void;
}

export const InteractiveModalityView: React.FC<InteractiveModalityViewProps> = ({
  lesson,
  profile,
  onRecordInteraction,
  onAwardXP,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [fidgetCount, setFidgetCount] = useState(0);
  const [activeFidgetIndex, setActiveFidgetIndex] = useState<number | null>(null);

  const handleSelectOption = (challenge: MicroChallenge, optionIndex: number) => {
    onRecordInteraction();
    if (selectedAnswers[challenge.id] !== undefined) return; // already answered

    setSelectedAnswers((prev) => ({ ...prev, [challenge.id]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [challenge.id]: true }));

    if (optionIndex === challenge.correctIndex) {
      onAwardXP(50);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // ignore confetti errors in iframe
      }
    }
  };

  const handleFidgetTap = (index: number) => {
    onRecordInteraction();
    setActiveFidgetIndex(index);
    setFidgetCount((prev) => prev + 1);
    setTimeout(() => setActiveFidgetIndex(null), 250);
  };

  const completedCount = Object.keys(selectedAnswers).length;
  const totalChallenges = lesson.interactiveFormat.challenges.length;

  return (
    <div className="space-y-6">
      {/* Interactive Header & Dopamine Progress */}
      <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                ADHD Tactile Micro-Challenges
              </span>
              <h3 className="text-base font-extrabold text-neutral-900 leading-tight">
                {lesson.interactiveFormat.quickGoal}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              {completedCount} of {totalChallenges} Solved
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-200/80 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${(completedCount / Math.max(1, totalChallenges)) * 100}%` }}
          />
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {lesson.interactiveFormat.challenges.map((challenge, cIdx) => {
          const selected = selectedAnswers[challenge.id];
          const isAnswered = selected !== undefined;
          const isCorrect = isAnswered && selected === challenge.correctIndex;

          return (
            <div
              key={challenge.id}
              className={`p-5 rounded-2xl border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-rose-300 bg-rose-50/40'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 text-neutral-700">
                  Step {cIdx + 1}
                </span>
                {isAnswered && (
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+50 XP)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Almost! Review note below
                      </>
                    )}
                  </span>
                )}
              </div>

              <h4 className="text-base font-extrabold text-neutral-900 mb-4 leading-snug">
                {challenge.question}
              </h4>

              {/* Options */}
              <div className="space-y-2">
                {challenge.options.map((option, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  const isThisCorrect = challenge.correctIndex === optIdx;

                  let btnStyle = 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/60 text-neutral-800';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (isThisSelected && !isThisCorrect) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 line-through';
                    } else {
                      btnStyle = 'border-neutral-200 bg-neutral-50 text-neutral-700 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(challenge, optIdx)}
                      className={`w-full p-3.5 text-left rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dopamine Feedback & Explanation */}
              {showExplanations[challenge.id] && (
                <div
                  className={`mt-4 p-4 rounded-xl text-xs leading-relaxed border ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <p className="font-bold text-sm mb-1">{challenge.dopaminePraise}</p>
                  <p>{challenge.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tactile Sensory Fidget Pad for ADHD Motor Restlessness */}
      {profile.adhdSettings.fidgetToolsEnabled && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  Sensory Fidget Pad (Tactile Motor Grounding)
                </h4>
                <p className="text-xs text-neutral-700">
                  Tap rhythm bubbles to release motor tension without losing focus
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {fidgetCount} Taps
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-2">
            {[...Array(8)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleFidgetTap(i)}
                className={`h-12 rounded-xl border flex items-center justify-center font-bold text-xs transition-transform duration-150 active:scale-90 ${
                  activeFidgetIndex === i
                    ? 'bg-amber-400 border-amber-500 text-white scale-95 shadow-inner'
                    : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
                }`}
              >
                {activeFidgetIndex === i ? '💥' : '🫧'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
