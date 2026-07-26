import { describe, expect, it } from 'vitest';
import { getMockViewingPlan } from './planFixtures';

describe('mock viewing plan contract', () => {
  it('returns a composed plan whose duration fits the requested budget', async () => {
    const response = await getMockViewingPlan('guidance', 60);
    expect(response.totalMinutes).toBeLessThanOrEqual(60);
    expect(response.plan.map((event) => event.id)).toEqual(['wta-northstar']);
  });

  it('omits all outcome and post-event quality fields in No hints', async () => {
    const response = await getMockViewingPlan('no-hints', 60);
    for (const event of [...response.plan, ...response.excluded]) {
      expect(event.projection).toBe('no-hints');
      expect(event).not.toHaveProperty('score');
      expect(event).not.toHaveProperty('safeReasons');
      expect(event).not.toHaveProperty('result');
      expect(event).not.toHaveProperty('dimensions');
    }
  });

  it('returns scores but no outcomes in Guidance', async () => {
    const response = await getMockViewingPlan('guidance', 120);
    for (const event of [...response.plan, ...response.excluded]) {
      expect(event).toHaveProperty('score');
      expect(event).not.toHaveProperty('result');
      expect(event).not.toHaveProperty('dimensions');
    }
  });

  it('returns outcome analysis only in Full story', async () => {
    const response = await getMockViewingPlan('full-story', 60);
    expect(response.plan[0]).toMatchObject({ projection: 'full-story' });
    expect(response.plan[0]).toHaveProperty('result');
    expect(response.plan[0]).toHaveProperty('dimensions');
  });

  it('keeps unavailable events outside the composed plan', async () => {
    const response = await getMockViewingPlan('guidance', 15);
    expect(response.plan).toHaveLength(0);
    expect(response.excluded.find((event) => event.id === 'atp-meridian')?.availability).toBe('unavailable');
  });
});
