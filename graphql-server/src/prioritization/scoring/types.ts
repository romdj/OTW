export type ScoreBand = 'LIMITED' | 'SOLID' | 'VERY_GOOD' | 'EXCELLENT' | 'EXCEPTIONAL';

export type OtwPillarKey =
  | 'COMPETITIVENESS'
  | 'EVENTFULNESS'
  | 'AESTHETIC_QUALITY'
  | 'IMPORTANCE';

export interface RatedAttribute {
  key: string;
  value: number;
  confidence: number;
  weight?: number;
  evidenceIds: string[];
}

export interface RatedPillar {
  key: OtwPillarKey;
  value: number;
  confidence: number;
}

export interface OtwScoreOptions {
  interactionBonus?: number;
  deduction?: number;
  independentEvidenceFamilies?: number;
}

export interface OtwScoreResult {
  value: number;
  band: ScoreBand;
  pillars: RatedPillar[];
  confidence: number;
}
