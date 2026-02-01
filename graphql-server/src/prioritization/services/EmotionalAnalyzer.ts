/**
 * EmotionalAnalyzer Service
 *
 * Analyzes sporting events for emotional factors that make them compelling to watch.
 * This is the core engine that evaluates suspense, stakes, volatility, underdog
 * dynamics, and transcendence potential.
 */

import type {
  EmotionalProfile,
  EmotionalAnalysisInput,
  EmotionalAnalysisResult,
  EmotionalMoment,
  SuspenseFactors,
  StakesFactors,
  VolatilityFactors,
  UnderdogFactors,
  TranscendenceFactors,
} from '../types/index.js';

/**
 * Configuration for emotional analysis weights
 */
interface AnalysisWeights {
  suspense: SuspenseWeights;
  stakes: StakesWeights;
  volatility: VolatilityWeights;
  underdog: UnderdogWeights;
  transcendence: TranscendenceWeights;
}

interface SuspenseWeights {
  scoreMargin: number;
  leadChanges: number;
  lateDrama: number;
  overtime: number;
  uncertaintyDuration: number;
}

interface StakesWeights {
  playoffImplications: Record<string, number>;
  rivalryLevel: Record<string, number>;
  recordsAtStake: number;
  tournamentStage: Record<string, number>;
  seasonContext: Record<string, number>;
}

interface VolatilityWeights {
  momentumSwings: number;
  criticalMoments: number;
  eventFrequency: number;
  intensityPeaks: number;
}

interface UnderdogWeights {
  rankingDifferential: number;
  oddsDifferential: number;
  historicalImbalance: number;
  performance: Record<string, number>;
}

interface TranscendenceWeights {
  historicMoment: number;
  communityBuzz: Record<string, number>;
  mediaRecognition: Record<string, number>;
  recordsBroken: number;
  standoutPerformances: number;
}

/**
 * Default weights for emotional analysis
 */
const DEFAULT_WEIGHTS: AnalysisWeights = {
  suspense: {
    scoreMargin: 0.35,
    leadChanges: 0.20,
    lateDrama: 0.20,
    overtime: 0.15,
    uncertaintyDuration: 0.10,
  },
  stakes: {
    playoffImplications: {
      none: 0,
      clinch: 60,
      elimination: 85,
      championship: 100,
    },
    rivalryLevel: {
      none: 0,
      division: 30,
      historic: 60,
      intense: 90,
    },
    recordsAtStake: 15, // per record
    tournamentStage: {
      group: 20,
      knockout: 50,
      semifinal: 75,
      final: 100,
    },
    seasonContext: {
      early: 10,
      mid: 30,
      late: 60,
      postseason: 90,
    },
  },
  volatility: {
    momentumSwings: 15, // per swing
    criticalMoments: 12, // per moment
    eventFrequency: 0.5, // multiplier
    intensityPeaks: 10, // per peak
  },
  underdog: {
    rankingDifferential: 3, // per ranking position
    oddsDifferential: 0.8, // multiplier
    historicalImbalance: 2, // multiplier
    performance: {
      lost_badly: 0,
      competitive: 40,
      upset: 85,
      dominant_upset: 100,
    },
  },
  transcendence: {
    historicMoment: 50,
    communityBuzz: {
      low: 10,
      moderate: 30,
      high: 60,
      viral: 90,
    },
    mediaRecognition: {
      none: 0,
      notable: 25,
      significant: 50,
      historic: 90,
    },
    recordsBroken: 20, // per record
    standoutPerformances: 15, // per performance
  },
};

/**
 * EmotionalAnalyzer - Singleton service for analyzing sporting events
 */
export class EmotionalAnalyzer {
  private static instance: EmotionalAnalyzer;
  private weights: AnalysisWeights;

  private constructor(weights?: Partial<AnalysisWeights>) {
    this.weights = { ...DEFAULT_WEIGHTS, ...weights };
  }

  /**
   * Get the singleton instance
   */
  static getInstance(weights?: Partial<AnalysisWeights>): EmotionalAnalyzer {
    if (!EmotionalAnalyzer.instance) {
      EmotionalAnalyzer.instance = new EmotionalAnalyzer(weights);
    }
    return EmotionalAnalyzer.instance;
  }

  /**
   * Analyze an event and produce an emotional profile
   */
  analyze(input: EmotionalAnalysisInput): EmotionalAnalysisResult {
    const suspense = this.calculateSuspense(input.suspense);
    const stakes = this.calculateStakes(input.stakes);
    const volatility = this.calculateVolatility(input.volatility);
    const underdog = this.calculateUnderdog(input.underdog);
    const transcendence = this.calculateTranscendence(input.transcendence);

    const profile: EmotionalProfile = {
      suspense,
      stakes,
      volatility,
      underdog,
      transcendence,
    };

    const keyMoments = this.identifyKeyMoments(input);
    const confidence = this.calculateConfidence(input);

    return {
      profile,
      confidence,
      keyMoments,
      dataSources: this.identifyDataSources(input),
    };
  }

  /**
   * Quick analysis using only essential factors
   */
  quickAnalyze(
    scoreMargin: number,
    overtime: boolean,
    isPlayoff: boolean,
    isRivalry: boolean
  ): EmotionalProfile {
    // Simplified scoring for quick analysis
    const suspense = Math.max(0, 100 - scoreMargin * 15) + (overtime ? 25 : 0);
    const stakes = (isPlayoff ? 70 : 30) + (isRivalry ? 20 : 0);
    const volatility = overtime ? 60 : 40;
    const underdog = 50; // Default when unknown
    const transcendence = isPlayoff && overtime ? 60 : 30;

    return {
      suspense: this.clamp(suspense),
      stakes: this.clamp(stakes),
      volatility: this.clamp(volatility),
      underdog: this.clamp(underdog),
      transcendence: this.clamp(transcendence),
    };
  }

  /**
   * Calculate suspense score from factors
   */
  private calculateSuspense(factors: SuspenseFactors): number {
    const w = this.weights.suspense;

    // Score margin: closer = more suspense (inverse relationship)
    const marginScore = Math.max(0, 100 - factors.scoreMargin * 12);

    // Lead changes: more = more suspense (capped at 100)
    const leadChangeScore = Math.min(100, factors.leadChanges * 15);

    // Late drama bonus
    const lateDramaScore = factors.lateDrama ? 100 : 0;

    // Overtime bonus
    const overtimeScore = factors.wentToOvertime ? 100 : 0;

    // Uncertainty duration: percentage of event where outcome was uncertain
    const uncertaintyScore = factors.uncertaintyDuration;

    const totalScore =
      marginScore * w.scoreMargin +
      leadChangeScore * w.leadChanges +
      lateDramaScore * w.lateDrama +
      overtimeScore * w.overtime +
      uncertaintyScore * w.uncertaintyDuration;

    return this.clamp(totalScore);
  }

  /**
   * Calculate stakes score from factors
   */
  private calculateStakes(factors: StakesFactors): number {
    const w = this.weights.stakes;

    // Playoff implications
    const playoffScore = w.playoffImplications[factors.playoffImplications] || 0;

    // Rivalry level
    const rivalryScore = w.rivalryLevel[factors.rivalryLevel] || 0;

    // Records at stake
    const recordsScore = Math.min(50, factors.recordsAtStake.length * w.recordsAtStake);

    // Tournament stage
    const stageScore = factors.tournamentStage
      ? w.tournamentStage[factors.tournamentStage] || 30
      : 0;

    // Season context
    const contextScore = w.seasonContext[factors.seasonContext] || 30;

    // Weighted combination (playoff implications dominate)
    const totalScore =
      playoffScore * 0.35 +
      rivalryScore * 0.20 +
      recordsScore * 0.15 +
      stageScore * 0.15 +
      contextScore * 0.15;

    return this.clamp(totalScore);
  }

  /**
   * Calculate volatility score from factors
   */
  private calculateVolatility(factors: VolatilityFactors): number {
    const w = this.weights.volatility;

    // Momentum swings (capped contribution)
    const swingsScore = Math.min(40, factors.momentumSwings * w.momentumSwings);

    // Critical moments (capped contribution)
    const momentsScore = Math.min(35, factors.criticalMoments * w.criticalMoments);

    // Event frequency multiplier
    const frequencyMultiplier = 1 + (factors.eventFrequency - 1) * w.eventFrequency;

    // Intensity peaks (capped contribution)
    const peaksScore = Math.min(25, factors.intensityPeaks * w.intensityPeaks);

    const baseScore = swingsScore + momentsScore + peaksScore;
    const totalScore = baseScore * frequencyMultiplier;

    return this.clamp(totalScore);
  }

  /**
   * Calculate underdog score from factors
   */
  private calculateUnderdog(factors: UnderdogFactors): number {
    const w = this.weights.underdog;

    // No underdog dynamic if differential is small
    if (factors.rankingDifferential < 3) {
      return 20; // Baseline for even matchups
    }

    // Ranking differential (more spread = more underdog potential)
    const rankingScore = Math.min(50, factors.rankingDifferential * w.rankingDifferential);

    // Odds differential if available
    const oddsScore = factors.oddsDifferential
      ? Math.min(30, factors.oddsDifferential * w.oddsDifferential)
      : 15;

    // Historical imbalance
    const historyScore = Math.min(20, factors.historicalImbalance * w.historicalImbalance);

    // Performance outcome (this is the key factor)
    const performanceScore = w.performance[factors.underdogPerformance] || 0;

    // Performance dominates the score
    const totalScore =
      (rankingScore + oddsScore + historyScore) * 0.3 + performanceScore * 0.7;

    return this.clamp(totalScore);
  }

  /**
   * Calculate transcendence score from factors
   */
  private calculateTranscendence(factors: TranscendenceFactors): number {
    const w = this.weights.transcendence;

    // Historic moment flag
    const historicScore = factors.historicMoment ? w.historicMoment : 0;

    // Community buzz
    const buzzScore = w.communityBuzz[factors.communityBuzz] || 0;

    // Media recognition
    const mediaScore = w.mediaRecognition[factors.mediaRecognition] || 0;

    // Records broken
    const recordsScore = Math.min(40, factors.recordsBroken.length * w.recordsBroken);

    // Standout performances
    const performanceScore = Math.min(
      30,
      factors.standoutPerformances.length * w.standoutPerformances
    );

    // Transcendence is rare - require multiple strong signals
    const signals = [
      historicScore > 0,
      buzzScore >= 60,
      mediaScore >= 50,
      recordsScore > 0,
      performanceScore > 0,
    ].filter(Boolean).length;

    // Apply signal multiplier (need at least 2 signals for high transcendence)
    const signalMultiplier = signals >= 3 ? 1.2 : signals >= 2 ? 1.0 : 0.7;

    const baseScore =
      historicScore * 0.25 +
      buzzScore * 0.25 +
      mediaScore * 0.20 +
      recordsScore * 0.15 +
      performanceScore * 0.15;

    return this.clamp(baseScore * signalMultiplier);
  }

  /**
   * Identify key emotional moments from the input
   */
  private identifyKeyMoments(input: EmotionalAnalysisInput): EmotionalMoment[] {
    const moments: EmotionalMoment[] = [];

    // Late drama moment
    if (input.suspense.lateDrama) {
      moments.push({
        timestamp: 'late',
        type: 'dramatic_finish',
        description: 'Event was decided in the final moments',
        impact: { suspense: 30 },
      });
    }

    // Overtime moment
    if (input.suspense.wentToOvertime) {
      moments.push({
        timestamp: 'overtime',
        type: 'dramatic_finish',
        description: 'Event went to overtime/extra time',
        impact: { suspense: 25, volatility: 15 },
      });
    }

    // Upset moment
    if (input.underdog.underdogPerformance === 'upset' ||
        input.underdog.underdogPerformance === 'dominant_upset') {
      moments.push({
        timestamp: 'result',
        type: 'upset_brewing',
        description: 'Underdog achieved the upset',
        impact: { underdog: 40, transcendence: 20 },
      });
    }

    // Historic moment
    if (input.transcendence.historicMoment) {
      moments.push({
        timestamp: 'event',
        type: 'historic_achievement',
        description: 'Historic moment occurred',
        impact: { transcendence: 50 },
      });
    }

    // Record broken moments
    for (const record of input.transcendence.recordsBroken) {
      moments.push({
        timestamp: 'event',
        type: 'record_broken',
        description: record,
        impact: { transcendence: 20 },
      });
    }

    // Comeback if there were significant lead changes
    if (input.suspense.leadChanges >= 3) {
      moments.push({
        timestamp: 'event',
        type: 'comeback',
        description: `Multiple lead changes (${input.suspense.leadChanges})`,
        impact: { suspense: 20, volatility: 25 },
      });
    }

    return moments;
  }

  /**
   * Calculate confidence in the analysis based on data completeness
   */
  private calculateConfidence(input: EmotionalAnalysisInput): number {
    let dataPoints = 0;
    let maxDataPoints = 0;

    // Check suspense factors
    maxDataPoints += 5;
    if (input.suspense.scoreMargin !== undefined) dataPoints++;
    if (input.suspense.leadChanges !== undefined) dataPoints++;
    if (input.suspense.lateDrama !== undefined) dataPoints++;
    if (input.suspense.wentToOvertime !== undefined) dataPoints++;
    if (input.suspense.uncertaintyDuration !== undefined) dataPoints++;

    // Check stakes factors
    maxDataPoints += 5;
    if (input.stakes.playoffImplications !== undefined) dataPoints++;
    if (input.stakes.rivalryLevel !== undefined) dataPoints++;
    if (input.stakes.recordsAtStake?.length >= 0) dataPoints++;
    if (input.stakes.seasonContext !== undefined) dataPoints++;
    if (input.stakes.tournamentStage !== undefined) dataPoints++;

    // Check volatility factors
    maxDataPoints += 4;
    if (input.volatility.momentumSwings !== undefined) dataPoints++;
    if (input.volatility.criticalMoments !== undefined) dataPoints++;
    if (input.volatility.eventFrequency !== undefined) dataPoints++;
    if (input.volatility.intensityPeaks !== undefined) dataPoints++;

    // Check underdog factors
    maxDataPoints += 4;
    if (input.underdog.rankingDifferential !== undefined) dataPoints++;
    if (input.underdog.historicalImbalance !== undefined) dataPoints++;
    if (input.underdog.underdogPerformance !== undefined) dataPoints++;
    if (input.underdog.oddsDifferential !== undefined) dataPoints++;

    // Check transcendence factors
    maxDataPoints += 5;
    if (input.transcendence.historicMoment !== undefined) dataPoints++;
    if (input.transcendence.communityBuzz !== undefined) dataPoints++;
    if (input.transcendence.mediaRecognition !== undefined) dataPoints++;
    if (input.transcendence.recordsBroken?.length >= 0) dataPoints++;
    if (input.transcendence.standoutPerformances?.length >= 0) dataPoints++;

    return Math.round((dataPoints / maxDataPoints) * 100);
  }

  /**
   * Identify data sources used in analysis
   */
  private identifyDataSources(input: EmotionalAnalysisInput): string[] {
    const sources: string[] = [];

    if (input.suspense.scoreMargin !== undefined) {
      sources.push('game_score');
    }
    if (input.suspense.leadChanges !== undefined) {
      sources.push('play_by_play');
    }
    if (input.stakes.playoffImplications !== 'none') {
      sources.push('standings');
    }
    if (input.transcendence.communityBuzz !== 'low') {
      sources.push('social_media');
    }
    if (input.transcendence.mediaRecognition !== 'none') {
      sources.push('media_coverage');
    }
    if (input.underdog.oddsDifferential !== undefined) {
      sources.push('betting_odds');
    }

    return sources;
  }

  /**
   * Clamp a value between 0 and 100
   */
  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}

// Export singleton instance
export const emotionalAnalyzer = EmotionalAnalyzer.getInstance();
