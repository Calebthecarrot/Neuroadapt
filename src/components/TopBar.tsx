import React from 'react';
import {
  Headphones,
  Eye,
  Zap,
  Sliders,
  Sparkles,
  Smartphone,
  Code,
  Flame,
  Award,
  Bot,
  Activity,
  Layers,
  Monitor
} from 'lucide-react';
import { ModalityFormat, LearnerProfile, EngagementMetrics } from '../types';

interface TopBarProps {
  profile: LearnerProfile;
  metrics: EngagementMetrics;
  onSelectModality: (format: 'audio' | 'visual' | 'interactive') => void;
  onToggleAutoAdaptive: () => void;
  onOpenAccommodations: () => void;
  onOpenGenerator: () => void;
  onToggleKotlinStudio: () => void;
  isKotlinStudioOpen: boolean;
  isDeviceMode: boolean;
  onToggleDeviceMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  profile,
  metrics,
  onSelectModality,
  onToggleAutoAdaptive,
  onOpenAccommodations,
  onOpenGenerator,
  onToggleKotlinStudio,
  isKotlinStudioOpen,
  isDeviceMode,
  onToggleDeviceMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Persona Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
            NA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-neutral-900 tracking-tight leading-none">
                NeuroAdapt
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                {profile.condition === 'adhd'
                  ? 'ADHD Companion'
                  : profile.condition === 'dyslexia'
                  ? 'Dyslexia Companion'
                  : 'AuDHD Companion'}
              </span>
            </div>
            <p className="text-xs text-neutral-700 mt-0.5 hidden sm:block">
              Hyper-Personalized Multimodal Learning Engine
            </p>
          </div>
        </div>

        {/* Central Modality Segmented Switcher */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
          <button
            onClick={() => onSelectModality('audio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              profile.activeFormat === 'audio'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-neutral-200'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Audio</span>
          </button>

          <button
            onClick={() => onSelectModality('visual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              profile.activeFormat === 'visual'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-neutral-200'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual</span>
          </button>

          <button
            onClick={() => onSelectModality('interactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              profile.activeFormat === 'interactive'
                ? 'bg-white text-amber-700 shadow-xs ring-1 ring-neutral-200'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive</span>
          </button>

          <button
            onClick={onToggleAutoAdaptive}
            title="Auto-switch based on real-time fatigue or fidget signals"
            className={`ml-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
              profile.preferredFormat === 'auto_adaptive'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300'
            }`}
          >
            <Bot className="w-3 h-3" />
            <span>Auto</span>
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Dopamine XP Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{profile.totalXP} XP</span>
            <span className="text-[11px] text-amber-700">({profile.dopamineStreak}d streak)</span>
          </div>

          {/* New AI Topic Generator */}
          <button
            onClick={onOpenGenerator}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Lesson</span>
          </button>

          {/* Accommodations Drawer Button */}
          <button
            onClick={onOpenAccommodations}
            className="p-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors"
            title="Dyslexia & ADHD Sensory Accommodations"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Device Frame Switcher */}
          <button
            onClick={onToggleDeviceMode}
            className={`p-2 rounded-xl border transition-colors ${
              isDeviceMode
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700'
            }`}
            title={isDeviceMode ? 'Switch to Full Screen View' : 'Switch to Android Pixel Device View'}
          >
            {isDeviceMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Kotlin Android Code Inspector Button */}
          <button
            onClick={onToggleKotlinStudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isKotlinStudioOpen
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden md:inline">Kotlin Android Source</span>
            <span className="md:hidden">Kotlin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
