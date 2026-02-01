/**
 * Emotional Factors - The Core Emotional Framework
 *
 * Based on sports psychology research, these are the factors that make
 * sporting events emotionally compelling to watch.
 */

/**
 * Core emotional engines that drive engagement with sporting events.
 * These are universal factors that apply across all sports.
 */
export interface EmotionalProfile {
  /**
   * Uncertainty of outcome - close scores, lead changes, late drama.
   * High suspense = viewer doesn't know what will happen next.
   * Range: 0-100
   */
  suspense: number;

  /**
   * Something meaningful at risk - playoff implications, rivalry, records.
   * High stakes = the outcome matters beyond just this game.
   * Range: 0-100
   */
  stakes: number;

  /**
   * Rapid hope/fear shifts - momentum swings, critical moments.
   * High volatility = emotional rollercoaster throughout the event.
   * Range: 0-100
   */
  volatility: number;

  /**
   * Asymmetry being corrected - underdog narrative, upset potential.
   * High underdog factor = David vs Goliath dynamic.
   * Range: 0-100
   */
  underdog: number;

  /**
   * "Instant classic" potential - transcendent moments, historic significance.
   * High transcendence = will be remembered and talked about.
   * Range: 0-100
   */
  transcendence: number;
}

/**
 * Factors used to calculate suspense score
 */
export interface SuspenseFactors {
  /** How close was the final score (margin of victory) */
  scoreMargin: number;
  /** Number of lead changes during the event */
  leadChanges: number;
  /** Was the result decided late in the event */
  lateDrama: boolean;
  /** Did the event go to overtime/extra time/tiebreaker */
  wentToOvertime: boolean;
  /** Percentage of event where outcome was uncertain */
  uncertaintyDuration: number;
}

/**
 * Factors used to calculate stakes score
 */
export interface StakesFactors {
  /** Playoff/tournament implications */
  playoffImplications: 'none' | 'clinch' | 'elimination' | 'championship';
  /** Historical rivalry between competitors */
  rivalryLevel: 'none' | 'division' | 'historic' | 'intense';
  /** Records or milestones at stake */
  recordsAtStake: string[];
  /** Tournament stage (group, knockout, final, etc.) */
  tournamentStage?: string;
  /** Season context (early, mid, late, postseason) */
  seasonContext: 'early' | 'mid' | 'late' | 'postseason';
}

/**
 * Factors used to calculate volatility score
 */
export interface VolatilityFactors {
  /** Number of significant momentum swings */
  momentumSwings: number;
  /** Number of critical/pivotal moments */
  criticalMoments: number;
  /** Frequency of scoring/key events */
  eventFrequency: number;
  /** Emotional intensity peaks */
  intensityPeaks: number;
}

/**
 * Factors used to calculate underdog score
 */
export interface UnderdogFactors {
  /** Pre-event ranking/seed differential */
  rankingDifferential: number;
  /** Betting odds differential (if available) */
  oddsDifferential?: number;
  /** Historical head-to-head imbalance */
  historicalImbalance: number;
  /** Did the underdog win or nearly win */
  underdogPerformance: 'lost_badly' | 'competitive' | 'upset' | 'dominant_upset';
}

/**
 * Factors used to calculate transcendence score
 */
export interface TranscendenceFactors {
  /** Did something historic happen */
  historicMoment: boolean;
  /** Community engagement level (social buzz) */
  communityBuzz: 'low' | 'moderate' | 'high' | 'viral';
  /** Expert/media recognition */
  mediaRecognition: 'none' | 'notable' | 'significant' | 'historic';
  /** Records broken or set */
  recordsBroken: string[];
  /** Memorable individual performances */
  standoutPerformances: string[];
}

/**
 * Complete emotional analysis input combining all factor categories
 */
export interface EmotionalAnalysisInput {
  suspense: SuspenseFactors;
  stakes: StakesFactors;
  volatility: VolatilityFactors;
  underdog: UnderdogFactors;
  transcendence: TranscendenceFactors;
}

/**
 * Emotional analysis result with computed scores and confidence
 */
export interface EmotionalAnalysisResult {
  /** The computed emotional profile */
  profile: EmotionalProfile;
  /** Confidence in the analysis (0-100) */
  confidence: number;
  /** Key emotional moments identified */
  keyMoments: EmotionalMoment[];
  /** Data sources used for analysis */
  dataSources: string[];
}

/**
 * A specific emotional moment within an event
 */
export interface EmotionalMoment {
  /** When in the event this occurred */
  timestamp: string;
  /** Type of emotional moment */
  type: EmotionalMomentType;
  /** Description of what happened */
  description: string;
  /** Impact on emotional profile (which factors affected) */
  impact: Partial<EmotionalProfile>;
}

/**
 * Types of emotional moments that can occur during an event
 */
export type EmotionalMomentType =
  | 'lead_change'
  | 'comeback'
  | 'clutch_play'
  | 'controversy'
  | 'record_broken'
  | 'upset_brewing'
  | 'dominant_stretch'
  | 'momentum_shift'
  | 'dramatic_finish'
  | 'historic_achievement';

/**
 * Thresholds for categorizing emotional intensity
 */
export const EMOTIONAL_THRESHOLDS = {
  LOW: 25,
  MODERATE: 50,
  HIGH: 75,
  EXTREME: 90,
} as const;

/**
 * Helper to determine emotional intensity category
 */
export type EmotionalIntensity = 'low' | 'moderate' | 'high' | 'extreme';

export function getEmotionalIntensity(score: number): EmotionalIntensity {
  if (score >= EMOTIONAL_THRESHOLDS.EXTREME) return 'extreme';
  if (score >= EMOTIONAL_THRESHOLDS.HIGH) return 'high';
  if (score >= EMOTIONAL_THRESHOLDS.MODERATE) return 'moderate';
  return 'low';
}

/**
 * Calculate the dominant emotional factor from a profile
 */
export function getDominantFactor(profile: EmotionalProfile): keyof EmotionalProfile {
  const factors = Object.entries(profile) as [keyof EmotionalProfile, number][];
  return factors.reduce((max, [key, value]) =>
    value > profile[max] ? key : max
  , 'suspense' as keyof EmotionalProfile);
}
