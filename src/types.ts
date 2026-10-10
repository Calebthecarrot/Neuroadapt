/**
 * Types for NeuroAdapt: Hyper-Personalized Educational Companion
 * Tailored for Neurodivergent Learners (ADHD, Dyslexia)
 */

export type NeuroCondition = 'adhd' | 'dyslexia' | 'combined' | 'general_neurodivergent';

export type ModalityFormat = 'audio' | 'visual' | 'interactive' | 'auto_adaptive';

export type SensoryOverlay = 'none' | 'amber' | 'peach' | 'sage' | 'cyan' | 'night';

export type FocusSoundType = 'none' | 'brown_noise' | 'binaural_beats' | 'gentle_rain';

export interface AdhdSettings {
  dopamineRewards: boolean;
  countdownTimer: boolean;
  microSteps: boolean;
  focusSound: FocusSoundType;
  fidgetToolsEnabled: boolean;
  timerMinutes: number;
}

export interface DyslexiaSettings {
  fontFamily: 'lexend' | 'system' | 'mono';
  bionicReading: boolean;
  letterSpacing: number; // 0 to 4 px
  lineSpacing: number; // 1.4 to 2.2
  colorOverlay: SensoryOverlay;
  readingRuler: boolean;
  syllableBreakdown: boolean;
}

export interface LearnerProfile {
  name: string;
  condition: NeuroCondition;
  preferredFormat: ModalityFormat;
  activeFormat: 'audio' | 'visual' | 'interactive';
  adhdSettings: AdhdSettings;
  dyslexiaSettings: DyslexiaSettings;
  readingSpeed: number; // 0.75x to 1.5x
  dopamineStreak: number;
  totalXP: number;
}

export interface EngagementMetrics {
  attentionScore: number; // 0 - 100
  interactionVelocity: number; // actions/minute
  dwellTimeSeconds: number;
  fidgetIndex: number; // 0 - 100
  cognitiveLoad: 'low' | 'optimal' | 'high' | 'fatigue';
  trend: 'rising' | 'stable' | 'dropping';
  detectedBehavior: string;
  recommendedModality: 'audio' | 'visual' | 'interactive';
  adaptationTriggered: boolean;
  adaptationReason?: string;
}

export interface AudioChunk {
  title: string;
  text: string;
  emphasis: string;
  durationSeconds: number;
}

export interface VisualCard {
  title: string;
  description: string;
  mnemonic: string;
  accentColor: string;
  iconName: string;
}

export interface MindMapNode {
  title: string;
  detail: string;
  children?: string[];
}

export interface MicroChallenge {
  id: string;
  question: string;
  type: 'multiple_choice' | 'quick_tap' | 'true_false';
  options: string[];
  correctIndex: number;
  explanation: string;
  dopaminePraise: string;
}

export interface LessonContent {
  id: string;
  topic: string;
  summary: string;
  tags: string[];
  estimatedMinutes: number;
  audioFormat: {
    audioOverview: string;
    scriptNarrative: string;
    keyTakeaways: string[];
    chunks: AudioChunk[];
  };
  visualFormat: {
    bionicStory: string;
    plainText: string;
    cards: VisualCard[];
    mindMap: {
      centralConcept: string;
      branches: MindMapNode[];
    };
    takeawayBulletPoints: string[];
  };
  interactiveFormat: {
    quickGoal: string;
    challenges: MicroChallenge[];
    fidgetPrompt: string;
  };
}

export interface KotlinAndroidFile {
  id: string;
  fileName: string;
  relativePath: string;
  category: 'ui' | 'viewmodel' | 'sensor' | 'data' | 'config';
  description: string;
  code: string;
}
