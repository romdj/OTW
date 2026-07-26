import type {
  OtwScoreOptions,
  OtwScoreResult,
  RatedAttribute,
  RatedPillar,
  ScoreBand,
} from './types.js';

const RANK_WEIGHTS = [1, 0.8, 0.6, 0.4] as const;
const POWER = 1.5;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function assertNonEmpty<T>(values: T[], label: string): void {
  if (values.length === 0) throw new Error(`${label} must not be empty`);
}

export function confidenceAdjustedValue(value: number, confidence: number): number {
  return clamp(value, 0, 100) * Math.sqrt(clamp(confidence, 0, 1));
}

export function aggregateAttributes(attributes: RatedAttribute[], power = 1): number {
  assertNonEmpty(attributes, 'attributes');
  if (power <= 0) throw new Error('power must be greater than zero');

  const weighted = attributes.map((attribute) => {
    const weight = Math.max(0, attribute.weight ?? 1);
    const adjusted = confidenceAdjustedValue(attribute.value, attribute.confidence);
    return { weight, poweredValue: weight * adjusted ** power };
  });
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) throw new Error('at least one attribute must have a positive weight');

  return (weighted.reduce((sum, item) => sum + item.poweredValue, 0) / totalWeight) ** (1 / power);
}

export function calculateOtwScore(
  pillars: RatedPillar[],
  options: OtwScoreOptions = {}
): OtwScoreResult {
  assertNonEmpty(pillars, 'pillars');

  const adjustedPillars = pillars.slice(0, 4).map((pillar) => ({
    ...pillar,
    value: clamp(pillar.value, 0, 100),
    confidence: clamp(pillar.confidence, 0, 1),
  }));
  const ordered = [...adjustedPillars].sort((left, right) => right.value - left.value);
  const totalRankWeight = ordered.reduce((sum, _, index) => sum + RANK_WEIGHTS[index], 0);
  const magnitude = (
    ordered.reduce(
      (sum, pillar, index) => sum + RANK_WEIGHTS[index] * pillar.value ** POWER,
      0
    ) / totalRankWeight
  ) ** (1 / POWER);
  const supportingStrength = ordered.slice(1).reduce(
    (sum, pillar) => sum + (pillar.value / 65) ** 2,
    0
  );
  const supportFactor = 0.82 + 0.18 * (1 - Math.exp(-supportingStrength));
  const interactionBonus = clamp(options.interactionBonus ?? 0, 0, 6);
  const deduction = Math.max(0, options.deduction ?? 0);
  let value = magnitude * supportFactor + interactionBonus - deduction;

  if (ordered.length === 1) value = Math.min(value, 82);
  if ((options.independentEvidenceFamilies ?? ordered.length) < 2) value = Math.min(value, 74);

  const confidence = pillars.reduce(
    (sum, pillar) => sum + clamp(pillar.confidence, 0, 1),
    0
  ) / pillars.length;
  if (confidence < 0.65) value = Math.min(value, 79);

  const roundedValue = Math.round(clamp(value, 0, 100));
  return {
    value: roundedValue,
    band: scoreBand(roundedValue),
    pillars: adjustedPillars,
    confidence,
  };
}

export function scoreBand(value: number): ScoreBand {
  const normalized = clamp(value, 0, 100);
  if (normalized >= 90) return 'EXCEPTIONAL';
  if (normalized >= 80) return 'EXCELLENT';
  if (normalized >= 70) return 'VERY_GOOD';
  if (normalized >= 55) return 'SOLID';
  return 'LIMITED';
}
