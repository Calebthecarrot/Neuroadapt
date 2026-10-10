import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { synthesizeCurriculumLesson } from './server/curriculumSynthesizer.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with required User-Agent header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Candidate models to try in sequence if one experiences temporary 503 spikes
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

/**
 * Execute a promise with a specified timeout
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Timeout after ${timeoutMs}ms while calling ${label}`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

/**
 * Robust multimodal lesson generation with retry, multi-model fallback,
 * and seamless fallback to procedural neurodivergent curriculum synthesizer
 */
async function generateMultimodalLesson(
  topic: string,
  condition: string = 'combined',
  preferredFormat: string = 'visual'
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[NeuroAdapt] GEMINI_API_KEY is not configured. Utilizing built-in curriculum synthesizer.');
    return synthesizeCurriculumLesson(topic, condition, preferredFormat);
  }

  const ai = getGeminiClient();

  const systemPrompt = `You are an elite neurodivergent educational psychologist specializing in ADHD and Dyslexia.
Transform the provided topic into a structured, hyper-personalized multi-modal learning experience.
Target Profile:
- Condition: ${condition} (ADHD benefits from novelty, dopamine rewards, micro-chunks; Dyslexia benefits from visual anchors, clear typography, audio support).
- Initial Preferred Modality: ${preferredFormat}

Generate a valid JSON object matching this structure:
{
  "topic": string,
  "summary": string,
  "tags": string[],
  "estimatedMinutes": number,
  "audioFormat": {
    "audioOverview": string,
    "scriptNarrative": string,
    "keyTakeaways": string[],
    "chunks": [
      { "title": string, "text": string, "emphasis": string, "durationSeconds": number }
    ]
  },
  "visualFormat": {
    "plainText": string,
    "bionicStory": string,
    "cards": [
      { "title": string, "description": string, "mnemonic": string, "accentColor": string, "iconName": string }
    ],
    "mindMap": {
      "centralConcept": string,
      "branches": [
        { "title": string, "detail": string, "children": string[] }
      ]
    },
    "takeawayBulletPoints": string[]
  },
  "interactiveFormat": {
    "quickGoal": string,
    "challenges": [
      {
        "id": string,
        "question": string,
        "type": "multiple_choice",
        "options": string[],
        "correctIndex": number,
        "explanation": string,
        "dopaminePraise": string
      }
    ],
    "fidgetPrompt": string
  }
}`;

  for (const modelName of CANDIDATE_MODELS) {
    // Retry up to 2 times per model for transient errors (e.g. 503 high demand, 429 rate limit)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[NeuroAdapt] Calling ${modelName} (attempt ${attempt}) for topic: "${topic}"...`);

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: `Create a comprehensive, personalized lesson for neurodivergent learners about: "${topic}". Provide 3 audio chunks, 3 visual memory cards, 3 mind map branches, and 3 interactive challenges.`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        // 14-second timeout limit to prevent hanging connections
        const response = await withTimeout(generatePromise, 14000, modelName);

        if (response && response.text) {
          let rawText = response.text.trim();
          if (rawText.startsWith('```json')) {
            rawText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
          } else if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```\s*/, '').replace(/```\s*$/, '');
          }

          const parsed = JSON.parse(rawText);
          if (parsed && parsed.topic && parsed.audioFormat && parsed.visualFormat && parsed.interactiveFormat) {
            parsed.id = `ai_${Date.now()}`;
            console.log(`[NeuroAdapt] Successfully generated lesson with ${modelName}!`);
            return parsed;
          }
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        const isTransient =
          errorMsg.includes('503') ||
          errorMsg.includes('UNAVAILABLE') ||
          errorMsg.includes('high demand') ||
          errorMsg.includes('429') ||
          errorMsg.includes('RESOURCE_EXHAUSTED') ||
          errorMsg.includes('Timeout');

        console.warn(`[NeuroAdapt] ${modelName} attempt ${attempt} failed: ${errorMsg.slice(0, 140)}`);

        if (isTransient && attempt < 2) {
          // Brief backoff before retry
          await new Promise((r) => setTimeout(r, 800 * attempt));
        } else {
          // Move to next candidate model
          break;
        }
      }
    }
  }

  // If all models hit temporary 503 high-demand spikes or timeout, use the intelligent fallback synthesizer
  console.warn(`[NeuroAdapt] All candidate Gemini models are currently under high demand. Seamlessly engaging procedural curriculum synthesizer for "${topic}".`);
  return synthesizeCurriculumLesson(topic, condition, preferredFormat);
}

// Hyper-personalized lesson generator for neurodivergent learners
app.post('/api/adapt-content', async (req, res) => {
  try {
    const { topic, condition = 'combined', preferredFormat = 'visual' } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      res.status(400).json({ error: 'Topic is required and must be non-empty.' });
      return;
    }

    const lesson = await generateMultimodalLesson(topic.trim(), condition, preferredFormat);
    res.json(lesson);
  } catch (error: unknown) {
    console.error('Error generating adaptive lesson:', error);
    // If an unexpected error occurs, still gracefully fallback so learner isn't blocked
    try {
      const { topic, condition = 'combined', preferredFormat = 'visual' } = req.body || {};
      const fallback = synthesizeCurriculumLesson(topic || 'Adaptive Learning Fundamentals', condition, preferredFormat);
      res.json(fallback);
    } catch {
      const errMessage = error instanceof Error ? error.message : 'Failed to generate adaptive lesson';
      res.status(500).json({ error: errMessage });
    }
  }
});

// Real-time Engagement Signal Analysis & Adaptive Modality Recommender
app.post('/api/analyze-engagement', async (req, res) => {
  try {
    const { metrics, currentFormat, condition = 'combined' } = req.body;
    const { attentionScore = 80, fidgetIndex = 20, dwellTimeSeconds = 30, interactionVelocity = 10 } = metrics || {};

    let recommendedModality: 'audio' | 'visual' | 'interactive' = currentFormat;
    let reason = 'Optimal engagement flow detected.';
    let triggered = false;

    // Fast, clinically grounded neurodivergent adaptation heuristic
    if (fidgetIndex > 55 && currentFormat !== 'interactive') {
      recommendedModality = 'interactive';
      reason = 'High fidget tremor detected: Your body has motor energy looking for a release. Let’s switch to tactile micro-challenges to channel that dopamine!';
      triggered = true;
    } else if ((attentionScore < 50 || dwellTimeSeconds > 90) && currentFormat === 'visual') {
      recommendedModality = 'audio';
      reason = 'Visual gaze fatigue detected: Reading dense text is draining working memory. Let’s switch to relaxing narrated audio to let your eyes rest!';
      triggered = true;
    } else if (attentionScore < 50 && currentFormat === 'audio') {
      recommendedModality = 'interactive';
      reason = 'Auditory drift detected: Mind is wandering away from audio narration. Let’s do a 30-second tactile checkpoint!';
      triggered = true;
    } else if (attentionScore > 80 && currentFormat === 'audio' && condition.includes('dyslexia')) {
      recommendedModality = 'visual';
      reason = 'High cognitive readiness: You are primed for visual-spatial exploration with Bionic Reading.';
      triggered = false;
    }

    res.json({
      recommendedModality,
      triggered,
      reason,
      metricsSnapshot: {
        attentionScore,
        fidgetIndex,
        dwellTimeSeconds,
        interactionVelocity,
      },
    });
  } catch (error: unknown) {
    console.error('Error in engagement analysis:', error);
    res.status(500).json({ error: 'Failed to analyze engagement' });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NeuroAdapt server running at http://localhost:${PORT}`);
  });
}

startServer();
