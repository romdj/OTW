import {
  aggregateAttributes,
  calculateOtwScore,
  confidenceAdjustedValue,
} from '../../src/prioritization/scoring/otwScore';
import type { RatedPillar } from '../../src/prioritization/scoring/types';

function pillars(values: number[], confidence = 1): RatedPillar[] {
  const keys: RatedPillar['key'][] = [
    'COMPETITIVENESS',
    'EVENTFULNESS',
    'AESTHETIC_QUALITY',
    'IMPORTANCE',
  ];
  return values.map((value, index) => ({ key: keys[index], value, confidence }));
}

describe('OTW Score', () => {
  it('preserves a strong single route without awarding a landmark score', () => {
    const result = calculateOtwScore(pillars([100]));
    expect(result.value).toBe(74);
    expect(result.band).toBe('VERY_GOOD');
  });

  it('rewards independent supporting pillars', () => {
    const one = calculateOtwScore(pillars([100]), { independentEvidenceFamilies: 2 });
    const two = calculateOtwScore(pillars([100, 100]), { independentEvidenceFamilies: 2 });
    expect(one.value).toBe(82);
    expect(two.value).toBeGreaterThan(one.value);
  });

  it('is independent of pillar ordering', () => {
    const first = calculateOtwScore(pillars([92, 75, 64, 48]));
    const second = calculateOtwScore(pillars([48, 92, 64, 75]));
    expect(first.value).toBe(second.value);
  });

  it('attenuates uncertain evidence without treating missing data as a low event score', () => {
    expect(confidenceAdjustedValue(100, 0.49)).toBe(70);
    expect(confidenceAdjustedValue(80, 0)).toBe(0);
  });

  it('supports RMS aggregation for related qualitative attributes', () => {
    const value = aggregateAttributes(
      [
        { key: 'TACTICAL_TENSION', value: 100, confidence: 1, evidenceIds: ['fact-1'] },
        { key: 'FLOW', value: 20, confidence: 1, evidenceIds: ['fact-2'] },
      ],
      2
    );
    expect(value).toBeCloseTo(72.11, 2);
  });
});
