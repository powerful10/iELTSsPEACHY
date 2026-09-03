export type Language = 'en' | 'uz';

export type SpeakingPart = 1 | 2 | 3;

export type ConfidenceLevel = 'low' | 'moderate' | 'high';

export type SpeakingState =
  | 'idle'
  | 'ai-speaking'
  | 'listening'
  | 'processing'
  | 'feedback'
  | 'lesson'
  | 'retry'
  | 'comparing'
  | 'complete'
  | 'error';

export interface CriterionAssessment {
  estimate: number;
  confidence: ConfidenceLevel;
  heading: string;
  summary: string;
  observations: string[];
  positiveEvidence: string[];
  growthAreas: string[];
}

export interface OfficialCriteriaScores {
  fluencyCoherence: CriterionAssessment;
  lexicalResource: CriterionAssessment;
  grammar: CriterionAssessment;
  pronunciation: CriterionAssessment;
}

export interface MicroLesson {
  bottleneckTitle: string;
  criterionAffected: 'fluencyCoherence' | 'lexicalResource' | 'grammar' | 'pronunciation';
  priorityLevel: 'communication-breaking' | 'recurring-high-impact' | 'useful-improvement' | 'polishing';
  whatHappened: string;
  whyItMatters: string;
  concreteStrategy: string;
  examples: Array<{
    before: string;
    after: string;
    explanation?: string;
  }>;
  practiceTip: string;
}

export interface RetryTask {
  promptText: string;
  contextHint: string;
  targetSkillToDemonstrate: string;
  scaffoldingPhrase?: string;
}

export interface AttemptComparison {
  targetSkill: string;
  summary: string;
  didImprove: boolean;
  specificGains: string[];
  beforeQuote: string;
  afterQuote: string;
  coachComment: string;
  nextStepRecommendation: string;
}

export interface AssessmentResponse {
  transcript: string;
  diagnosticEstimate: number; // e.g. 5.5, 6.0, 6.5 (approximate)
  confidence: ConfidenceLevel;
  disclaimer: string;
  criteria: OfficialCriteriaScores;
  strengths: string[];
  priorityBottleneck: string;
  microLesson: MicroLesson;
  retryTask: RetryTask;
  coachSpokenSummary: string;
}

export interface SpeakingPrompt {
  id: string;
  part: SpeakingPart;
  topic: string;
  question: string;
  // Part 2 cue card attributes:
  cuePoints?: string[];
  followUpQuestion?: string;
}

export interface PracticeAttempt {
  id: string;
  timestamp: number;
  prompt: SpeakingPrompt;
  part: SpeakingPart;
  audioDurationSeconds: number;
  transcript: string;
  diagnosticEstimate: number;
  confidence: ConfidenceLevel;
  criteria: OfficialCriteriaScores;
  priorityBottleneck: string;
  strengths: string[];
  retryAttempt?: {
    timestamp: number;
    transcript: string;
    retryPrompt: string;
    comparison: AttemptComparison;
  };
}

export interface LearnerProfile {
  targetBand: number; // e.g., 6.5, 7.0, 7.5
  currentEstimate: number; // e.g. 5.5
  confidence: ConfidenceLevel;
  examDate?: string;
  preferredLanguage: Language;
  totalSessions: number;
  totalSpeakingTimeSeconds: number;
  completedRetries: number;
  recurringWeaknesses: string[];
  masteredSkills: string[];
  criteriaTrends: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammar: number;
    pronunciation: number;
  };
  recentAttempts: PracticeAttempt[];
}
