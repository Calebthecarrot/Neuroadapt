import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  Eye,
  Sliders,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { EngagementMetrics, ModalityFormat } from '../types';

interface EngagementTelemetryPanelProps {
  metrics: EngagementMetrics;
  activeModality: 'audio' | 'visual' | 'interactive';
  onSimulateSignal: (patch: Partial<EngagementMetrics>) => void;
  onAutoAdaptModality: (modality: 'audio' | 'visual' | 'interactive', reason: string) => void;
}

export const EngagementTelemetryPanel: React.FC<EngagementTelemetryPanelProps> = ({
  metrics,
  activeModality,
  onSimulateSignal,
  onAutoAdaptModality,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const triggerAdaptiveCheck = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics,
          currentFormat: activeModality,
        }),
      });
      const data = await res.json();
      if (data.recommendedModality && data.recommendedModality !== activeModality) {
        onAutoAdaptModality(data.recommendedModality, data.reason);
      }
    } catch {
      // Fallback local logic
      if (metrics.fidgetIndex > 50 && activeModality !== 'interactive') {
        onAutoAdaptModality('interactive', 'High motor fidgeting detected. Let’s channel that restlessness into tactile interactive challenges!');
      } else if (metrics.attentionScore < 50 && activeModality !== 'audio') {
        onAutoAdaptModality('audio', 'Reading fatigue detected. Switching to calming voice narration.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAttentionColor = () => {
    if (metrics.attentionScore >= 75) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (metrics.attentionScore >= 45) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
      {/* Mini Bar Preview (Always visible) */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/70 border-b border-neutral-200/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-neutral-900">
                Real-Time Engagement Telemetry
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getAttentionColor()}`}>
                {metrics.attentionScore}% Focus Flow
              </span>
            </div>
            <p className="text-xs text-neutral-700">
              {metrics.detectedBehavior} • Dwell {metrics.dwellTimeSeconds}s
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerAdaptiveCheck}
            disabled={isAnalyzing}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Evaluate Adaptation
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition-colors"
          >
            {isExpanded ? 'Hide Sensor Controls' : 'Sensor Simulator'}
          </button>
        </div>
      </div>

      {/* Expanded Signal & Sensor Sliders */}
      {isExpanded && (
        <div className="p-5 space-y-4 bg-white border-t border-neutral-100 text-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Attention Gaze */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-700">Attention Focus</span>
                <span className="text-xs font-bold text-indigo-700">{metrics.attentionScore}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={metrics.attentionScore}
                onChange={(e) => onSimulateSignal({ attentionScore: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-700 block mt-1">
                Simulates eye gaze consistency & dwell velocity
              </span>
            </div>

            {/* Fidget Tremor (Accelerometer) */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-700">Fidget Tremor (Android Sensor)</span>
                <span className="text-xs font-bold text-amber-700">{metrics.fidgetIndex}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={metrics.fidgetIndex}
                onChange={(e) => onSimulateSignal({ fidgetIndex: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-700 block mt-1">
                Simulates rapid device shaking & erratic taps (ADHD)
              </span>
            </div>

            {/* Interaction Speed */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-700">Interaction Velocity</span>
                <span className="text-xs font-bold text-emerald-700">{metrics.interactionVelocity}/min</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={metrics.interactionVelocity}
                onChange={(e) => onSimulateSignal({ interactionVelocity: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-700 block mt-1">
                Actions, scrolls, and touch events per minute
              </span>
            </div>
          </div>

          {/* Quick Simulation Presets */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-700">Quick Signal Presets:</span>
            <button
              onClick={() => {
                onSimulateSignal({ attentionScore: 30, fidgetIndex: 85, cognitiveLoad: 'high' });
              }}
              className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-medium hover:bg-amber-100 transition-colors"
            >
              Simulate ADHD Restlessness (High Fidget)
            </button>
            <button
              onClick={() => {
                onSimulateSignal({ attentionScore: 25, dwellTimeSeconds: 120, fidgetIndex: 10, cognitiveLoad: 'fatigue' });
              }}
              className="px-2.5 py-1 rounded-lg border border-rose-300 bg-rose-50 text-rose-900 text-xs font-medium hover:bg-rose-100 transition-colors"
            >
              Simulate Dyslexia Eye Fatigue (Long Stall)
            </button>
            <button
              onClick={() => {
                onSimulateSignal({ attentionScore: 92, fidgetIndex: 15, cognitiveLoad: 'optimal' });
              }}
              className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-medium hover:bg-emerald-100 transition-colors"
            >
              Simulate Hyperfocus Flow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
