import React from 'react';
import {
  X,
  Sparkles,
  Eye,
  Zap,
  Volume2,
  Sliders,
  Type,
  Maximize2
} from 'lucide-react';
import { LearnerProfile, FocusSoundType, SensoryOverlay } from '../types';
import { playBrownNoise, playBinauralAlpha, stopAmbientSoundscape } from '../utils/audioSynthesizer';

interface AccommodationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LearnerProfile;
  onUpdateProfile: (updated: Partial<LearnerProfile>) => void;
}

export const AccommodationsDrawer: React.FC<AccommodationsDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const handleSoundChange = (sound: FocusSoundType) => {
    onUpdateProfile({
      adhdSettings: {
        ...profile.adhdSettings,
        focusSound: sound,
      },
    });

    if (sound === 'brown_noise') {
      playBrownNoise(0.18);
    } else if (sound === 'binaural_beats') {
      playBinauralAlpha(0.12);
    } else {
      stopAmbientSoundscape();
    }
  };

  const handleDyslexiaUpdate = (patch: Partial<LearnerProfile['dyslexiaSettings']>) => {
    onUpdateProfile({
      dyslexiaSettings: {
        ...profile.dyslexiaSettings,
        ...patch,
      },
    });
  };

  const handleAdhdUpdate = (patch: Partial<LearnerProfile['adhdSettings']>) => {
    onUpdateProfile({
      adhdSettings: {
        ...profile.adhdSettings,
        ...patch,
      },
    });
  };

  const overlays: { id: SensoryOverlay; label: string; bg: string; border: string }[] = [
    { id: 'none', label: 'Default', bg: 'bg-white', border: 'border-neutral-300' },
    { id: 'amber', label: 'Warm Amber', bg: 'bg-amber-100', border: 'border-amber-400' },
    { id: 'peach', label: 'Peach Tint', bg: 'bg-orange-100', border: 'border-orange-400' },
    { id: 'sage', label: 'Calm Sage', bg: 'bg-emerald-100', border: 'border-emerald-400' },
    { id: 'cyan', label: 'Cool Cyan', bg: 'bg-cyan-100', border: 'border-cyan-400' },
    { id: 'night', label: 'Soft Slate', bg: 'bg-slate-200', border: 'border-slate-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden text-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              ⚙️
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 leading-tight">Neurodivergent Accommodations</h2>
              <p className="text-xs text-neutral-700">Sensory, typography & stimulation settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-700 hover:bg-neutral-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Condition Persona Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2">
              Primary Learning Profile
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'adhd', label: 'ADHD Mode', desc: 'Novelty, dopamine, micro-steps' },
                { id: 'dyslexia', label: 'Dyslexia Mode', desc: 'Bionic text, tinted overlays' },
                { id: 'combined', label: 'AuDHD / Combined', desc: 'Audio-visual + micro-bursts' },
                { id: 'general_neurodivergent', label: 'Custom Sensory', desc: 'Fine-tuned preferences' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onUpdateProfile({ condition: item.id as LearnerProfile['condition'] })}
                  className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                    profile.condition === item.id
                      ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                  }`}
                >
                  <span className="font-semibold text-neutral-900 block">{item.label}</span>
                  <span className="text-[11px] text-neutral-700 block mt-0.5 leading-tight">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DYSLEXIA SUITE */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-neutral-900">Dyslexia Reading Suite</h3>
            </div>

            {/* Bionic Reading Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 mb-3">
              <div>
                <span className="text-xs font-semibold text-neutral-900 block">Bionic Reading Fixations</span>
                <span className="text-[11px] text-neutral-700 block">Bolds initial word graphemes to prevent saccadic skipping</span>
              </div>
              <input
                type="checkbox"
                checked={profile.dyslexiaSettings.bionicReading}
                onChange={(e) => handleDyslexiaUpdate({ bionicReading: e.target.checked })}
                className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Font Selector */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-neutral-700" /> Typography Family
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'lexend', label: 'Lexend (Dyslexia)', class: 'font-[Lexend]' },
                  { id: 'system', label: 'Clean Sans', class: 'font-sans' },
                  { id: 'mono', label: 'Spaced Mono', class: 'font-mono' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleDyslexiaUpdate({ fontFamily: f.id as 'lexend' | 'system' | 'mono' })}
                    className={`py-2 px-2 text-center rounded-lg border text-xs transition-all ${f.class} ${
                      profile.dyslexiaSettings.fontFamily === f.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sensory Color Overlay */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                Sensory Color Tint Overlay (Reduces Irlen Syndrome visual glare)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {overlays.map((ov) => (
                  <button
                    key={ov.id}
                    onClick={() => handleDyslexiaUpdate({ colorOverlay: ov.id })}
                    className={`py-2 px-2 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-all ${ov.bg} ${
                      profile.dyslexiaSettings.colorOverlay === ov.id
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30 text-neutral-900 font-bold'
                        : `${ov.border} text-neutral-700`
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-neutral-400 bg-current" />
                    {ov.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Ruler Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <div>
                <span className="text-xs font-semibold text-neutral-900 block">Focus Reading Ruler</span>
                <span className="text-[11px] text-neutral-700 block">Highlight bar that stays locked on the current reading line</span>
              </div>
              <input
                type="checkbox"
                checked={profile.dyslexiaSettings.readingRuler}
                onChange={(e) => handleDyslexiaUpdate({ readingRuler: e.target.checked })}
                className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* ADHD SUITE */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-neutral-900">ADHD Stimulation & Focus Suite</h3>
            </div>

            {/* Focus Soundscapes */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-neutral-700" /> Neural Soundscape (Procedural Web Audio)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'Off / Silent' },
                  { id: 'brown_noise', label: 'Warm Brown Noise' },
                  { id: 'binaural_beats', label: '10Hz Alpha Binaural' },
                  { id: 'gentle_rain', label: 'Gentle Rainfall' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSoundChange(s.id as FocusSoundType)}
                    className={`py-2 px-3 text-left rounded-lg border text-xs font-medium transition-all ${
                      profile.adhdSettings.focusSound === s.id
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-400/30'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {profile.adhdSettings.focusSound === s.id && '▶ '}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dopamine Rewards Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 mb-2">
              <div>
                <span className="text-xs font-semibold text-neutral-900 block">Dopamine XP & Confetti Bursts</span>
                <span className="text-[11px] text-neutral-700 block">Instant sensory celebrations on micro-challenge completion</span>
              </div>
              <input
                type="checkbox"
                checked={profile.adhdSettings.dopamineRewards}
                onChange={(e) => handleAdhdUpdate({ dopamineRewards: e.target.checked })}
                className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Tactile Fidget Pad Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <div>
                <span className="text-xs font-semibold text-neutral-900 block">Tactile Fidget Pad</span>
                <span className="text-[11px] text-neutral-700 block">On-screen sensory pop bubbles for restless motor energy</span>
              </div>
              <input
                type="checkbox"
                checked={profile.adhdSettings.fidgetToolsEnabled}
                onChange={(e) => handleAdhdUpdate({ fidgetToolsEnabled: e.target.checked })}
                className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <span className="text-xs text-neutral-700">Settings save to active session</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
