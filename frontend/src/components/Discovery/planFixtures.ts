import type { DisclosureMode, PlanEvent, TimeBudget } from './planTypes';

export const PLAN_EVENTS: PlanEvent[] = [
  {
    id: 'mock-f1-aurora-gp',
    sport: 'Formula 1', accent: 'racing', competition: 'Formula 1', context: 'Aurora Grand Prix · Race',
    title: 'Aurora Grand Prix', dateLabel: 'Sunday', score: 94, scoreBand: 'Exceptional',
    percentile: 'Top 4% of races', fit: 'Great fit', format: 'Condensed', minutes: 52,
    safeReason: 'Championship relevance', guidanceTraits: ['Strategic tension', 'Unexpected momentum'],
    result: 'Mara Voss won from 11th on the grid after a late weather change.',
    fullReason: 'Repeated strategy branches and a late reversal kept the lead genuinely uncertain.',
    dimensions: [
      { label: 'Competitiveness', value: 94, band: 'Exceptional' },
      { label: 'Eventfulness', value: 88, band: 'High' },
      { label: 'Aesthetic quality', value: 84, band: 'High' },
      { label: 'Importance', value: 91, band: 'Exceptional' }
    ],
    preEventRank: 1, guidanceRank: 1, fullStoryRank: 2
  },
  {
    id: 'mock-tennis-northstar-final',
    sport: 'Tennis', accent: 'tennis', competition: 'WTA 1000 Northstar', context: 'Final · Hard court',
    title: 'Amara Okafor — Sofia Lind', dateLabel: 'Saturday', score: 96, scoreBand: 'Exceptional',
    percentile: 'Top 2% of tour matches', fit: 'Great fit', format: 'Condensed', minutes: 44,
    safeReason: 'A final between two players you follow', guidanceTraits: ['Sustained suspense', 'Expressive skill'],
    result: 'Okafor defeated Lind 4–6, 7–6, 7–5.',
    fullReason: 'Long pressure games and exceptional point construction sustained tension across all three sets.',
    dimensions: [
      { label: 'Competitiveness', value: 97, band: 'Exceptional' },
      { label: 'Eventfulness', value: 82, band: 'High' },
      { label: 'Aesthetic quality', value: 95, band: 'Exceptional' },
      { label: 'Importance', value: 89, band: 'High' }
    ],
    preEventRank: 2, guidanceRank: 2, fullStoryRank: 1
  },
  {
    id: 'mock-nhl-harbour-ridge',
    sport: 'NHL', accent: 'hockey', competition: 'NHL', context: 'Regular season',
    title: 'Harbour City — Ridge Wolves', dateLabel: 'Friday', score: 89, scoreBand: 'Excellent',
    percentile: 'Top 11% of NHL games', fit: 'Great fit', format: 'Condensed', minutes: 28,
    safeReason: 'Features your followed team', guidanceTraits: ['Tactical pressure', 'Strong finish'],
    result: 'Harbour City won 3–2 in overtime.',
    fullReason: 'Elite goaltending and special-teams pressure mattered more than raw shot volume.',
    dimensions: [
      { label: 'Competitiveness', value: 92, band: 'Exceptional' },
      { label: 'Eventfulness', value: 74, band: 'High' },
      { label: 'Aesthetic quality', value: 86, band: 'High' },
      { label: 'Importance', value: 68, band: 'Medium' }
    ],
    preEventRank: 3, guidanceRank: 3, fullStoryRank: 3
  },
  {
    id: 'mock-tennis-atp-quarter',
    sport: 'Tennis', accent: 'tennis', competition: 'ATP 500 Meridian', context: 'Quarter-final · Clay',
    title: 'Luca Marin — Theo Bernard', dateLabel: 'Thursday', score: 84, scoreBand: 'Very good',
    percentile: 'Top 24% of tour matches', fit: 'Good fit', format: 'Highlights', minutes: 14,
    safeReason: 'Matches your interest in clay-court tactics', guidanceTraits: ['Point construction', 'Momentum shifts'],
    result: 'Bernard defeated Marin 7–5, 6–4.',
    fullReason: 'Patient construction produced excellent passages despite a relatively settled conclusion.',
    dimensions: [
      { label: 'Competitiveness', value: 70, band: 'High' },
      { label: 'Eventfulness', value: 67, band: 'Medium' },
      { label: 'Aesthetic quality', value: 90, band: 'Exceptional' },
      { label: 'Importance', value: 61, band: 'Medium' }
    ],
    preEventRank: 5, guidanceRank: 4, fullStoryRank: 4
  }
];

/**
 * Prototype-only presentation helper. Production ordering is composed by the
 * backend from disclosure-safe projections; the client must not reproduce it.
 */
export function rankPlan(events: PlanEvent[], mode: DisclosureMode, budget: TimeBudget): PlanEvent[] {
  const rankKey = mode === 'no-hints' ? 'preEventRank' : mode === 'guidance' ? 'guidanceRank' : 'fullStoryRank';
  return [...events].sort((a, b) => {
    if (mode === 'no-hints') return a.preEventRank - b.preEventRank;
    const aFits = a.minutes <= budget ? 0 : 1;
    const bFits = b.minutes <= budget ? 0 : 1;
    if (aFits !== bFits) return aFits - bFits;
    return a[rankKey] - b[rankKey];
  });
}
