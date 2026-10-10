import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Sparkles,
  Headphones,
  Sliders
} from 'lucide-react';
import { LessonContent, LearnerProfile } from '../types';
import { SpeechCompanion, playBrownNoise, stopAmbientSoundscape } from '../utils/audioSynthesizer';

interface AudioModalityViewProps {
  lesson: LessonContent;
  profile: LearnerProfile;
  onRecordInteraction: () => void;
}

export const AudioModalityView: React.FC<AudioModalityViewProps> = ({
  lesson,
  profile,
  onRecordInteraction,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.95);
  const [ambientActive, setAmbientActive] = useState(false);

  useEffect(() => {
    return () => {
      SpeechCompanion.stop();
    };
  }, []);

  const handlePlayToggle = () => {
    onRecordInteraction();
    if (isPlaying) {
      SpeechCompanion.stop();
      setIsPlaying(false);
    } else {
      const activeChunk = lesson.audioFormat.chunks[activeChunkIndex];
      const textToSpeak = activeChunk
        ? `${activeChunk.title}. ${activeChunk.text}`
        : lesson.audioFormat.scriptNarrative;

      setIsPlaying(true);
      SpeechCompanion.speak(textToSpeak, {
        rate: playbackSpeed,
        onEnd: () => {
          setIsPlaying(false);
          // Advance chunk if available
          if (activeChunkIndex < lesson.audioFormat.chunks.length - 1) {
            setActiveChunkIndex((prev) => prev + 1);
          }
        },
      });
    }
  };

  const handleSelectChunk = (index: number) => {
    onRecordInteraction();
    setActiveChunkIndex(index);
    SpeechCompanion.stop();
    setIsPlaying(false);
  };

  const toggleAmbientFocus = () => {
    onRecordInteraction();
    if (ambientActive) {
      stopAmbientSoundscape();
      setAmbientActive(false);
    } else {
      playBrownNoise(0.18);
      setAmbientActive(true);
    }
  };

  const currentChunk = lesson.audioFormat.chunks[activeChunkIndex] || lesson.audioFormat.chunks[0];

  return (
    <div className="space-y-6">
      {/* Audio Player Primary Card */}
      <div className="rounded-2xl border border-indigo-200/80 bg-linear-to-br from-indigo-50/70 via-white to-purple-50/50 p-6 shadow-xs relative overflow-hidden">
        {/* Decorative Waveform Accent */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Headphones className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Paced Audio Companion
              </span>
              <h3 className="text-lg font-extrabold text-neutral-900 leading-tight">
                {lesson.audioFormat.chunks[activeChunkIndex]?.title || lesson.topic}
              </h3>
            </div>
          </div>

          {/* Procedural Ambient Noise Toggle */}
          <button
            onClick={toggleAmbientFocus}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              ambientActive
                ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs ring-2 ring-amber-400/30'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${ambientActive ? 'animate-pulse text-amber-700' : ''}`} />
            {ambientActive ? 'Brown Noise Active' : 'Enable Brown Noise'}
          </button>
        </div>

        {/* Dynamic Simulated Audio Wave Visualizer */}
        <div className="h-14 rounded-xl bg-indigo-950/5 border border-indigo-100 flex items-center justify-center gap-1 px-4 my-4 overflow-hidden">
          {[
            18, 35, 60, 40, 85, 95, 70, 45, 30, 65, 80, 50, 90, 75, 40, 30, 55, 70, 85, 60, 40, 95, 65, 35, 20
          ].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-indigo-600 animate-pulse'
                  : 'bg-indigo-300/60'
              }`}
              style={{
                height: isPlaying ? `${Math.max(12, (h * (0.8 + Math.random() * 0.4)) * 0.45)}px` : `${h * 0.3}px`,
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>

        {/* Narration Script Box */}
        <div className="bg-white/80 border border-indigo-100/90 rounded-xl p-4.5 my-4 backdrop-blur-xs">
          <p className="text-base text-neutral-800 leading-relaxed font-medium">
            "{currentChunk.text}"
          </p>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-indigo-50 text-xs text-indigo-700 font-semibold">
            <span>💡 Spoken Anchor: {currentChunk.emphasis}</span>
            <span>~{currentChunk.durationSeconds}s</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Main Play / Pause Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayToggle}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause Narration</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Listen to Chunk {activeChunkIndex + 1}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                SpeechCompanion.stop();
                setIsPlaying(false);
              }}
              className="p-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
              title="Stop & Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-100/90 p-1 rounded-xl text-xs font-semibold text-neutral-700">
            {[
              { val: 0.85, label: '0.85x (Calm)' },
              { val: 1.0, label: '1.0x (Normal)' },
              { val: 1.2, label: '1.2x (Fast)' },
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => {
                  setPlaybackSpeed(s.val);
                  if (isPlaying) {
                    handlePlayToggle();
                  }
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  playbackSpeed === s.val
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'hover:text-neutral-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chunk Stepper Cards (Micro-steps for ADHD) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Bite-Sized Audio Segments (ADHD Chunking)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lesson.audioFormat.chunks.map((chunk, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectChunk(idx)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                activeChunkIndex === idx
                  ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-500/20'
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                  Part {idx + 1}
                </span>
                <span className="text-[11px] text-neutral-700 font-medium">~{chunk.durationSeconds}s</span>
              </div>
              <h5 className="text-sm font-bold text-neutral-900 mb-1 line-clamp-1">{chunk.title}</h5>
              <p className="text-xs text-neutral-700 line-clamp-2 leading-relaxed">{chunk.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Key Takeaways Checkpoints */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
        <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Key Auditory Takeaways
        </h4>
        <ul className="space-y-2.5">
          {lesson.audioFormat.keyTakeaways.map((point, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-neutral-800 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
