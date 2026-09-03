import { LearnerProfile, PracticeAttempt } from '../types';

const STORAGE_KEY = 'ielts_speaking_coach_profile_v1';

export const DEFAULT_PROFILE: LearnerProfile = {
  targetBand: 7.0,
  currentEstimate: 6.0,
  confidence: 'moderate',
  preferredLanguage: 'en',
  totalSessions: 0,
  totalSpeakingTimeSeconds: 0,
  completedRetries: 0,
  recurringWeaknesses: [],
  masteredSkills: [],
  criteriaTrends: {
    fluencyCoherence: 6.0,
    lexicalResource: 6.0,
    grammar: 5.5,
    pronunciation: 6.0,
  },
  recentAttempts: [],
};

export function loadLearnerProfile(): LearnerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch (e) {
    console.warn('Failed to parse learner profile from localStorage:', e);
    return DEFAULT_PROFILE;
  }
}

export function saveLearnerProfile(profile: LearnerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save learner profile to localStorage:', e);
  }
}

export function recordAttemptInProfile(
  attempt: PracticeAttempt,
  options?: {
    resolvedWeakness?: string;
    newWeakness?: string;
  }
): LearnerProfile {
  const current = loadLearnerProfile();

  const updatedAttempts = [attempt, ...current.recentAttempts.slice(0, 19)]; // Keep last 20

  const totalSessions = current.totalSessions + 1;
  const totalSpeakingTimeSeconds = current.totalSpeakingTimeSeconds + (attempt.audioDurationSeconds || 30);
  const completedRetries = current.completedRetries + (attempt.retryAttempt ? 1 : 0);

  // Update rolling estimate based on holistic evidence
  const newEstimate = Number(
    ((current.currentEstimate * 0.4) + (attempt.diagnosticEstimate * 0.6)).toFixed(1)
  );

  // Criteria trends
  const updatedTrends = {
    fluencyCoherence: Number(
      ((current.criteriaTrends.fluencyCoherence * 0.5) + (attempt.criteria.fluencyCoherence.estimate * 0.5)).toFixed(1)
    ),
    lexicalResource: Number(
      ((current.criteriaTrends.lexicalResource * 0.5) + (attempt.criteria.lexicalResource.estimate * 0.5)).toFixed(1)
    ),
    grammar: Number(
      ((current.criteriaTrends.grammar * 0.5) + (attempt.criteria.grammar.estimate * 0.5)).toFixed(1)
    ),
    pronunciation: Number(
      ((current.criteriaTrends.pronunciation * 0.5) + (attempt.criteria.pronunciation.estimate * 0.5)).toFixed(1)
    ),
  };

  const weaknesses = new Set(current.recurringWeaknesses);
  if (options?.newWeakness) {
    weaknesses.add(options.newWeakness);
  }
  if (attempt.priorityBottleneck) {
    weaknesses.add(attempt.priorityBottleneck);
  }
  if (options?.resolvedWeakness) {
    weaknesses.delete(options.resolvedWeakness);
  }

  const mastered = new Set(current.masteredSkills);
  if (attempt.retryAttempt && attempt.retryAttempt.comparison.didImprove) {
    mastered.add(attempt.retryAttempt.comparison.targetSkill);
    weaknesses.delete(attempt.retryAttempt.comparison.targetSkill);
  }

  const updatedProfile: LearnerProfile = {
    ...current,
    currentEstimate: newEstimate,
    confidence: attempt.confidence,
    totalSessions,
    totalSpeakingTimeSeconds,
    completedRetries,
    recurringWeaknesses: Array.from(weaknesses).slice(0, 8),
    masteredSkills: Array.from(mastered).slice(0, 10),
    criteriaTrends: updatedTrends,
    recentAttempts: updatedAttempts,
  };

  saveLearnerProfile(updatedProfile);
  return updatedProfile;
}
