import { describe, expect, it } from 'vitest';
import { PLAN_EVENTS, rankPlan } from './planFixtures';

describe('rankPlan', () => {
  it('uses pre-event ordering in No hints mode', () => {
    const ranked = rankPlan(PLAN_EVENTS, 'no-hints', 15);
    expect(ranked.map((event) => event.id)).toEqual([
      'mock-f1-aurora-gp',
      'mock-tennis-northstar-final',
      'mock-nhl-harbour-ridge',
      'mock-tennis-atp-quarter'
    ]);
  });

  it('uses the full assessment ordering in Full story mode', () => {
    const ranked = rankPlan(PLAN_EVENTS, 'full-story', 120);
    expect(ranked[0].id).toBe('mock-tennis-northstar-final');
  });

  it('promotes events which fit the selected time budget', () => {
    const ranked = rankPlan(PLAN_EVENTS, 'guidance', 15);
    expect(ranked[0].id).toBe('mock-tennis-atp-quarter');
    expect(ranked[0].minutes).toBeLessThanOrEqual(15);
  });
});
