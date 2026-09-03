import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Support large audio base64 uploads
app.use(express.json({ limit: '30mb' }));

// Lazy getter for Google GenAI client
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint: Generate dynamic original IELTS question
app.post('/api/question', async (req, res) => {
  try {
    const { part = 1, topic, targetBand = 6.5 } = req.body;
    const ai = getGenAI();

    const prompt = `Generate an ORIGINAL IELTS Speaking practice prompt.
IMPORTANT RULES:
- Do not copy or reproduce proprietary or copyrighted IELTS test bank questions.
- Match official IELTS characteristics:
  * Part 1: Everyday personal topic (home, work, studies, hobbies, routines, hometown, transport, free time, weather, food).
  * Part 2: Cue card with a descriptive topic and 4 bullet points to guide a 2-minute response + 1 follow-up question.
  * Part 3: Abstract, analytical, evaluative question exploring societal trends, comparisons, or future implications.
- Target learner band: ${targetBand}
- Requested part: Part ${part}
- Desired theme/topic (optional): ${topic || 'any appropriate topic'}

Return pure JSON matching this schema:
{
  "id": "generated-${Date.now()}",
  "part": ${part},
  "topic": "Short Topic Title",
  "question": "The main spoken question",
  "cuePoints": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"], // only if part == 2, else null
  "followUpQuestion": "One natural follow-up question"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: unknown) {
    console.error('Error generating question:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate question',
    });
  }
});

// Endpoint: Multimodal IELTS Speaking Assessment
app.post('/api/assess', async (req, res) => {
  try {
    const {
      audioBase64,
      mimeType = 'audio/webm',
      transcript: incomingTranscript,
      promptText,
      part = 1,
      targetBand = 7.0,
      currentEstimate = 6.0,
      language = 'en',
    } = req.body;

    const ai = getGenAI();

    const systemInstruction = `You are an expert, supportive IELTS Speaking AI Coach grounded in the official IELTS Speaking assessment framework and band descriptors.
YOUR MISSION:
You are a TEACHER FIRST, SCORER SECOND.
The score is merely a diagnostic signal; the improvement and actionable coaching is the real product.

OFFICIAL ASSESSMENT PRINCIPLES (Strict rules from knowledge base):
1. Four criteria (equally weighted):
   - Fluency and Coherence (FC)
   - Lexical Resource (LR)
   - Grammatical Range and Accuracy (GRA)
   - Pronunciation (PR)
2. FORBIDDEN SCORING SHORTCUTS:
   - NEVER use WPM as an IELTS formula.
   - NEVER use fixed pause count as an IELTS formula.
   - NEVER use count of "advanced words" or complex sentences as a formula.
   - NEVER penalize accent simply because it is non-native; evaluate intelligibility and comprehensibility.
   - NEVER penalize a single grammatical error automatically.
3. GROUND EVERYTHING IN EVIDENCE:
   - Quote exact phrases from the learner's actual speech for grammar errors, vocabulary limits, and coherence breakdowns.
   - State confidence honestly: "high", "moderate", or "low". If audio is brief or acoustic quality is imperfect, mark pronunciation confidence as "moderate" or "low" and state uncertainty openly.
4. IDENTIFY THE SINGLE HIGHEST-VALUE BOTTLENECK:
   - Do not overwhelm the learner with dozens of corrections.
   - Focus on ONE priority bottleneck: communication-breaking > recurring high-impact > useful improvement > polishing.
5. MICRO-LESSON:
   - Provide a short, actionable teaching intervention (Notice -> Explain -> Model -> Practice).
   - What happened in their answer, why it matters for IELTS communication, concrete strategy, 1-2 realistic examples.
6. TARGETED RETRY:
   - Provide a related practice prompt that naturally activates the same skill/vocabulary/grammar/structure without rote memorization.
7. LANGUAGE:
   - If language is 'uz', provide all explanations, coaching notes, and feedback in natural, high-quality human Uzbek using official terminology ("ravonlik", "mantiqiy bog'lanish", "lug'at boyligi", "grammatik diapazon va aniqlik", "talaffuz", "takroriy urinish", "xato"). The learner's speaking prompt and quotes remain in English.
   - If language is 'en', provide feedback in clear, encouraging, precise English.`;

    const assessmentSchema = {
      type: Type.OBJECT,
      properties: {
        transcript: {
          type: Type.STRING,
          description: 'Full accurate transcription of the learner speaking.',
        },
        diagnosticEstimate: {
          type: Type.NUMBER,
          description: 'Approximate holistic IELTS practice level (e.g. 5.5, 6.0, 6.5, 7.0).',
        },
        confidence: {
          type: Type.STRING,
          description: 'Overall diagnostic confidence: high, moderate, or low.',
        },
        disclaimer: {
          type: Type.STRING,
          description: 'Educational disclaimer stating this is an approximate diagnostic estimate, not an official IELTS score.',
        },
        criteria: {
          type: Type.OBJECT,
          properties: {
            fluencyCoherence: {
              type: Type.OBJECT,
              properties: {
                estimate: { type: Type.NUMBER },
                confidence: { type: Type.STRING },
                heading: { type: Type.STRING },
                summary: { type: Type.STRING },
                observations: { type: Type.ARRAY, items: { type: Type.STRING } },
                positiveEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['estimate', 'confidence', 'heading', 'summary', 'observations', 'positiveEvidence', 'growthAreas'],
            },
            lexicalResource: {
              type: Type.OBJECT,
              properties: {
                estimate: { type: Type.NUMBER },
                confidence: { type: Type.STRING },
                heading: { type: Type.STRING },
                summary: { type: Type.STRING },
                observations: { type: Type.ARRAY, items: { type: Type.STRING } },
                positiveEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['estimate', 'confidence', 'heading', 'summary', 'observations', 'positiveEvidence', 'growthAreas'],
            },
            grammar: {
              type: Type.OBJECT,
              properties: {
                estimate: { type: Type.NUMBER },
                confidence: { type: Type.STRING },
                heading: { type: Type.STRING },
                summary: { type: Type.STRING },
                observations: { type: Type.ARRAY, items: { type: Type.STRING } },
                positiveEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['estimate', 'confidence', 'heading', 'summary', 'observations', 'positiveEvidence', 'growthAreas'],
            },
            pronunciation: {
              type: Type.OBJECT,
              properties: {
                estimate: { type: Type.NUMBER },
                confidence: { type: Type.STRING },
                heading: { type: Type.STRING },
                summary: { type: Type.STRING },
                observations: { type: Type.ARRAY, items: { type: Type.STRING } },
                positiveEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['estimate', 'confidence', 'heading', 'summary', 'observations', 'positiveEvidence', 'growthAreas'],
            },
          },
          required: ['fluencyCoherence', 'lexicalResource', 'grammar', 'pronunciation'],
        },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2-3 specific things the learner did well with evidence.',
        },
        priorityBottleneck: {
          type: Type.STRING,
          description: 'Single highest-value issue holding the learner back.',
        },
        microLesson: {
          type: Type.OBJECT,
          properties: {
            bottleneckTitle: { type: Type.STRING },
            criterionAffected: { type: Type.STRING },
            priorityLevel: { type: Type.STRING },
            whatHappened: { type: Type.STRING },
            whyItMatters: { type: Type.STRING },
            concreteStrategy: { type: Type.STRING },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  before: { type: Type.STRING },
                  after: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['before', 'after'],
              },
            },
            practiceTip: { type: Type.STRING },
          },
          required: ['bottleneckTitle', 'criterionAffected', 'priorityLevel', 'whatHappened', 'whyItMatters', 'concreteStrategy', 'examples', 'practiceTip'],
        },
        retryTask: {
          type: Type.OBJECT,
          properties: {
            promptText: { type: Type.STRING },
            contextHint: { type: Type.STRING },
            targetSkillToDemonstrate: { type: Type.STRING },
            scaffoldingPhrase: { type: Type.STRING },
          },
          required: ['promptText', 'contextHint', 'targetSkillToDemonstrate'],
        },
        coachSpokenSummary: {
          type: Type.STRING,
          description: 'Concise spoken feedback (2-3 natural sentences) that the coach speaks aloud to the learner.',
        },
      },
      required: [
        'transcript',
        'diagnosticEstimate',
        'confidence',
        'disclaimer',
        'criteria',
        'strengths',
        'priorityBottleneck',
        'microLesson',
        'retryTask',
        'coachSpokenSummary',
      ],
    };

    const textInstruction = `Question asked in Part ${part}: "${promptText}".
Target band: ${targetBand}. Current estimated baseline: ${currentEstimate}. Preferred explanation language: ${language}.
Evaluate the learner's response thoroughly. If the response is very short or hesitant, evaluate accurately without harshness and state moderate/low confidence where appropriate. Provide the structured assessment JSON.`;

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    if (audioBase64) {
      parts.push({
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      });
      parts.push({
        text: `Transcribe this audio recording of the candidate's answer and perform the complete assessment against the question: "${promptText}". ${textInstruction}`,
      });
    } else {
      parts.push({
        text: `The candidate provided this spoken response transcript: "${incomingTranscript || ''}". Perform the complete assessment against the question: "${promptText}". ${textInstruction}`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: assessmentSchema,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: unknown) {
    console.error('Error assessing IELTS speaking response:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Assessment failed',
    });
  }
});

// Endpoint: Compare initial attempt and retry
app.post('/api/compare', async (req, res) => {
  try {
    const {
      initialTranscript,
      retryTranscript,
      targetSkill,
      microLesson,
      retryPrompt,
      language = 'en',
    } = req.body;

    const ai = getGenAI();

    const prompt = `Compare the candidate's initial attempt with their retry attempt.
Target skill taught in micro-lesson: "${targetSkill}".
Micro-lesson context: ${JSON.stringify(microLesson)}.
Initial Attempt Transcript: "${initialTranscript}".
Retry Attempt Transcript: "${retryTranscript}".
Retry Question: "${retryPrompt}".
Language: "${language}".

Evaluate objectively:
1. Did the candidate apply the taught strategy in the retry?
2. What observable gains were demonstrated (e.g. fewer hesitations, more precise collocations, corrected grammar structure, clearer phrasing)?
3. Compare exact quotes from Attempt 1 vs Attempt 2.
4. Provide an encouraging, honest coach commentary.
5. What is the recommended next step?

Return JSON matching this schema:
{
  "targetSkill": "${targetSkill}",
  "summary": "1-2 sentence overview of the comparison",
  "didImprove": true, // boolean
  "specificGains": ["gain 1 with evidence", "gain 2 with evidence"],
  "beforeQuote": "quote from initial attempt",
  "afterQuote": "improved quote from retry attempt",
  "coachComment": "warm, encouraging feedback celebrating authentic improvement",
  "nextStepRecommendation": "what to focus on next"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: unknown) {
    console.error('Error comparing attempts:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Comparison failed',
    });
  }
});

// Endpoint: Text-to-Speech using Gemini
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: text.slice(0, 500) }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audioBase64: base64Audio, mimeType: 'audio/mp3' });
    } else {
      res.json({ fallback: true });
    }
  } catch (err: unknown) {
    // Graceful fallback to browser speech synthesis
    console.warn('TTS API unavailable or key issue, client fallback will be used:', err);
    res.json({ fallback: true });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
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
    console.log(`IELTS Speaking AI Coach server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
