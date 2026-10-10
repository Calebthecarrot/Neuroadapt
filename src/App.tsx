import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_LESSONS } from './data/sampleLessons';
import {
  LearnerProfile,
  EngagementMetrics,
  LessonContent,
  ModalityFormat,
  SensoryOverlay
} from './types';
import { TopBar } from './components/TopBar';
import { AudioModalityView } from './components/AudioModalityView';
import { VisualModalityView } from './components/VisualModalityView';
import { InteractiveModalityView } from './components/InteractiveModalityView';
import { EngagementTelemetryPanel } from './components/EngagementTelemetryPanel';
import { AccommodationsDrawer } from './components/AccommodationsDrawer';
import { LessonGeneratorModal } from './components/LessonGeneratorModal';
import { KotlinAndroidStudio } from './components/KotlinAndroidStudio';
import { AndroidDeviceFrame } from './components/AndroidDeviceFrame';
import { AdaptiveNudgeBanner } from './components/AdaptiveNudgeBanner';
import { BookOpen, Sparkles, ChevronDown } from 'lucide-react';

export default function App() {
  // Learner Profile State with Dyslexia & ADHD Defaults
  const [profile, setProfile] = useState<LearnerProfile>({
    name: 'Alex',
    condition: 'combined',
    preferredFormat: 'auto_adaptive',
    activeFormat: 'visual',
    adhdSettings: {
      dopamineRewards: true,
      countdownTimer: true,
      microSteps: true,
      focusSound: 'none',
      fidgetToolsEnabled: true,
      timerMinutes: 10,
    },
    dyslexiaSettings: {
      fontFamily: 'lexend',
      bionicReading: true,
      letterSpacing: 1,
      lineSpacing: 1.6,
      colorOverlay: 'peach',
      readingRuler: true,
      syllableBreakdown: false,
    },
    readingSpeed: 1.0,
    dopamineStreak: 6,
    totalXP: 450,
  });

  // Current Lesson Content
  const [activeLesson, setActiveLesson] = useState<LessonContent>(SAMPLE_LESSONS[0]);

  // Real-time Engagement Telemetry
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    attentionScore: 84,
    interactionVelocity: 16,
    dwellTimeSeconds: 12,
    fidgetIndex: 22,
    cognitiveLoad: 'optimal',
    trend: 'stable',
    detectedBehavior: 'Steady reading cadence',
    recommendedModality: 'visual',
    adaptationTriggered: false,
  });

  // Adaptive Nudge State
  const [nudge, setNudge] = useState<{
    reason: string;
    recommendedModality: 'audio' | 'visual' | 'interactive';
  } | null>(null);

  // UI Views & Modals
  const [isAccommodationsOpen, setIsAccommodationsOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isKotlinStudioOpen, setIsKotlinStudioOpen] = useState(false);
  const [isDeviceMode, setIsDeviceMode] = useState(false);

  // Real Interaction Tracking Refs
  const interactionCountRef = useRef(0);
  const lastActiveTimestampRef = useRef(Date.now());

  // Listen to physical user interactions on the page
  const recordPhysicalInteraction = () => {
    interactionCountRef.current += 1;
    lastActiveTimestampRef.current = Date.now();
  };

  useEffect(() => {
    const handleEvent = () => recordPhysicalInteraction();
    window.addEventListener('mousemove', handleEvent, { passive: true });
    window.addEventListener('keydown', handleEvent, { passive: true });
    window.addEventListener('scroll', handleEvent, { passive: true });
    window.addEventListener('click', handleEvent, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleEvent);
      window.removeEventListener('keydown', handleEvent);
      window.removeEventListener('scroll', handleEvent);
      window.removeEventListener('click', handleEvent);
    };
  }, []);

  // Continuous Engagement Evaluation Loop (Every 2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const idleTimeSeconds = Math.floor((now - lastActiveTimestampRef.current) / 1000);
      const currentCount = interactionCountRef.current;
      interactionCountRef.current = 0; // reset for next window

      setMetrics((prev) => {
        const newDwell = prev.dwellTimeSeconds + 2;
        let newAttention = prev.attentionScore;
        let newFidget = prev.fidgetIndex;
        let behavior = prev.detectedBehavior;

        // Inactivity / stall detection
        if (idleTimeSeconds > 25) {
          newAttention = Math.max(20, newAttention - 4);
          behavior = 'Gaze stall / inactivity detected';
        } else if (idleTimeSeconds < 3 && currentCount > 0) {
          newAttention = Math.min(100, newAttention + 2);
          behavior = 'Active engagement & focused reading';
        }

        // Rapid scroll / erratic interaction detection
        if (currentCount > 15) {
          newFidget = Math.min(100, newFidget + 8);
          behavior = 'Rapid motor clicking / scrolling';
        } else {
          newFidget = Math.max(10, newFidget - 3);
        }

        // Check for Auto-Adaptive Modality Switch
        if (profile.preferredFormat === 'auto_adaptive') {
          if (newFidget > 65 && profile.activeFormat !== 'interactive' && !nudge) {
            setNudge({
              reason:
                'High motor fidgeting detected! Your brain is seeking dopamine & physical input. Switch to tactile micro-challenges?',
              recommendedModality: 'interactive',
            });
          } else if (newAttention < 45 && profile.activeFormat === 'visual' && !nudge) {
            setNudge({
              reason:
                'Visual fatigue detected: Reading dense text is straining working memory. Switch to relaxing narrated audio?',
              recommendedModality: 'audio',
            });
          }
        }

        return {
          ...prev,
          dwellTimeSeconds: newDwell,
          attentionScore: newAttention,
          fidgetIndex: newFidget,
          interactionVelocity: Math.round(currentCount * 30),
          detectedBehavior: behavior,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [profile.preferredFormat, profile.activeFormat, nudge]);

  const handleSelectModality = (format: 'audio' | 'visual' | 'interactive') => {
    recordPhysicalInteraction();
    setProfile((prev) => ({ ...prev, activeFormat: format }));
    setMetrics((prev) => ({ ...prev, dwellTimeSeconds: 0 }));
    setNudge(null);
  };

  const handleToggleAutoAdaptive = () => {
    recordPhysicalInteraction();
    setProfile((prev) => ({
      ...prev,
      preferredFormat: prev.preferredFormat === 'auto_adaptive' ? prev.activeFormat : 'auto_adaptive',
    }));
  };

  const handleAwardXP = (points: number) => {
    setProfile((prev) => ({
      ...prev,
      totalXP: prev.totalXP + points,
      dopamineStreak: prev.dopamineStreak + 1,
    }));
  };

  const getOverlayRgba = (overlay: SensoryOverlay): string | undefined => {
    switch (overlay) {
      case 'amber': return 'rgba(255, 193, 7, 0.08)';
      case 'peach': return 'rgba(255, 138, 101, 0.08)';
      case 'sage': return 'rgba(129, 199, 132, 0.08)';
      case 'cyan': return 'rgba(77, 208, 225, 0.08)';
      case 'night': return 'rgba(15, 23, 42, 0.06)';
      default: return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Application Header */}
      <TopBar
        profile={profile}
        metrics={metrics}
        onSelectModality={handleSelectModality}
        onToggleAutoAdaptive={handleToggleAutoAdaptive}
        onOpenAccommodations={() => setIsAccommodationsOpen(true)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onToggleKotlinStudio={() => setIsKotlinStudioOpen(!isKotlinStudioOpen)}
        isKotlinStudioOpen={isKotlinStudioOpen}
        isDeviceMode={isDeviceMode}
        onToggleDeviceMode={() => setIsDeviceMode(!isDeviceMode)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Real-time Adaptive Nudge Prompt */}
        {nudge && (
          <AdaptiveNudgeBanner
            reason={nudge.reason}
            recommendedModality={nudge.recommendedModality}
            onAccept={() => {
              handleSelectModality(nudge.recommendedModality);
              setNudge(null);
            }}
            onDismiss={() => setNudge(null)}
          />
        )}

        {/* Kotlin Android Studio Code Hub */}
        {isKotlinStudioOpen ? (
          <KotlinAndroidStudio onClose={() => setIsKotlinStudioOpen(false)} />
        ) : (
          <div className="space-y-6">
            {/* Lesson Selector Bar & Engagement Signal Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                    Current Study Topic
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <select
                      value={activeLesson.id}
                      onChange={(e) => {
                        const found = SAMPLE_LESSONS.find((l) => l.id === e.target.value);
                        if (found) {
                          setActiveLesson(found);
                          setMetrics((prev) => ({ ...prev, dwellTimeSeconds: 0 }));
                        }
                      }}
                      className="text-base font-extrabold text-neutral-900 bg-transparent border-0 pr-8 cursor-pointer focus:ring-0 outline-hidden"
                    >
                      {SAMPLE_LESSONS.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.topic}
                        </option>
                      ))}
                      {activeLesson.id.startsWith('ai_') && (
                        <option value={activeLesson.id}>{activeLesson.topic} (Custom AI)</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Format Badges */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-700 font-medium hidden sm:inline">Active Modality:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {profile.activeFormat}
                </span>
                {profile.preferredFormat === 'auto_adaptive' && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Auto-Adaptive Active
                  </span>
                )}
              </div>
            </div>

            {/* Real-time Hardware Telemetry & Sensor Simulator */}
            <EngagementTelemetryPanel
              metrics={metrics}
              activeModality={profile.activeFormat}
              onSimulateSignal={(patch) => {
                recordPhysicalInteraction();
                setMetrics((prev) => ({ ...prev, ...patch }));
              }}
              onAutoAdaptModality={(modality, reason) => {
                setNudge({ reason, recommendedModality: modality });
              }}
            />

            {/* Main Interactive Modality Experience (Rendered in optional Android Pixel Frame) */}
            <AndroidDeviceFrame
              isDeviceMode={isDeviceMode}
              onToggleDeviceMode={() => setIsDeviceMode(!isDeviceMode)}
              overlayColor={getOverlayRgba(profile.dyslexiaSettings.colorOverlay)}
            >
              {profile.activeFormat === 'audio' && (
                <AudioModalityView
                  lesson={activeLesson}
                  profile={profile}
                  onRecordInteraction={recordPhysicalInteraction}
                />
              )}

              {profile.activeFormat === 'visual' && (
                <VisualModalityView
                  lesson={activeLesson}
                  profile={profile}
                  onRecordInteraction={recordPhysicalInteraction}
                />
              )}

              {profile.activeFormat === 'interactive' && (
                <InteractiveModalityView
                  lesson={activeLesson}
                  profile={profile}
                  onRecordInteraction={recordPhysicalInteraction}
                  onAwardXP={handleAwardXP}
                />
              )}
            </AndroidDeviceFrame>
          </div>
        )}
      </main>

      {/* Accommodations Drawer Modal */}
      <AccommodationsDrawer
        isOpen={isAccommodationsOpen}
        onClose={() => setIsAccommodationsOpen(false)}
        profile={profile}
        onUpdateProfile={(patch) => setProfile((prev) => ({ ...prev, ...patch }))}
      />

      {/* AI Lesson Generator Modal */}
      <LessonGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onLessonGenerated={(newLesson) => {
          setActiveLesson(newLesson);
          setMetrics((prev) => ({ ...prev, dwellTimeSeconds: 0 }));
        }}
        currentCondition={profile.condition}
      />
    </div>
  );
}
