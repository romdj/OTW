import type { DisclosureMode, FullStoryEvent, GuidanceEvent, NoHintsEvent, TimeBudget, ViewingPlanResponse } from './planTypes';

const noHints: NoHintsEvent[] = [
  { id: 'f1-aurora', projection: 'no-hints', sport: 'Formula 1', accent: 'racing', context: 'Aurora Grand Prix · Race', title: 'Aurora Grand Prix', dateLabel: 'Sunday', format: 'Condensed', estimatedMinutes: 52, availability: 'available', availabilityLabel: 'Replay verified', preEventReason: 'Championship relevance and a circuit you follow' },
  { id: 'wta-northstar', projection: 'no-hints', sport: 'Tennis', accent: 'tennis', context: 'WTA 1000 Northstar · Final · Hard', title: 'Amara Okafor — Sofia Lind', dateLabel: 'Saturday', format: 'Condensed', estimatedMinutes: 44, availability: 'available', availabilityLabel: 'Replay verified', preEventReason: 'A final between two players you follow' },
  { id: 'nhl-harbour', projection: 'no-hints', sport: 'NHL', accent: 'hockey', context: 'Regular season', title: 'Harbour City — Ridge Wolves', dateLabel: 'Friday', format: 'Condensed', estimatedMinutes: 28, availability: 'available', availabilityLabel: 'Replay verified', preEventReason: 'Features your followed team' },
  { id: 'atp-meridian', projection: 'no-hints', sport: 'Tennis', accent: 'tennis', context: 'ATP 500 Meridian · Quarter-final · Clay', title: 'Luca Marin — Theo Bernard', dateLabel: 'Thursday', format: 'Highlights', estimatedMinutes: 14, availability: 'unavailable', availabilityLabel: 'Replay source unavailable', preEventReason: 'Matches your interest in clay-court tennis' }
];

const guidance: GuidanceEvent[] = [
  { id: 'wta-northstar', projection: 'guidance', sport: 'Tennis', accent: 'tennis', context: 'WTA 1000 Northstar · Final · Hard', title: 'Amara Okafor — Sofia Lind', dateLabel: 'Saturday', format: 'Condensed', estimatedMinutes: 44, availability: 'available', availabilityLabel: 'Replay verified', score: 96, scoreBand: 'Exceptional', percentile: 'Top 2% of tour matches', fit: 'Great fit', safeReasons: ['Sustained quality', 'Expressive skill'], confidence: 'High' },
  { id: 'f1-aurora', projection: 'guidance', sport: 'Formula 1', accent: 'racing', context: 'Aurora Grand Prix · Race', title: 'Aurora Grand Prix', dateLabel: 'Sunday', format: 'Condensed', estimatedMinutes: 52, availability: 'available', availabilityLabel: 'Replay verified', score: 94, scoreBand: 'Exceptional', percentile: 'Top 4% of races', fit: 'Great fit', safeReasons: ['Strategic quality', 'Competitive interest'], confidence: 'High' },
  { id: 'nhl-harbour', projection: 'guidance', sport: 'NHL', accent: 'hockey', context: 'Regular season', title: 'Harbour City — Ridge Wolves', dateLabel: 'Friday', format: 'Condensed', estimatedMinutes: 28, availability: 'available', availabilityLabel: 'Replay verified', score: 89, scoreBand: 'Excellent', percentile: 'Top 11% of NHL games', fit: 'Great fit', safeReasons: ['Tactical quality', 'Competitive interest'], confidence: 'Medium' },
  { id: 'atp-meridian', projection: 'guidance', sport: 'Tennis', accent: 'tennis', context: 'ATP 500 Meridian · Quarter-final · Clay', title: 'Luca Marin — Theo Bernard', dateLabel: 'Thursday', format: 'Highlights', estimatedMinutes: 14, availability: 'unavailable', availabilityLabel: 'Replay source unavailable', score: 84, scoreBand: 'Very good', fit: 'Good fit', safeReasons: ['Technical quality'], confidence: 'Low' }
];

const fullStory: FullStoryEvent[] = [
  { ...guidance[0], projection: 'full-story', result: 'Okafor defeated Lind 4–6, 7–6, 7–5.', analysis: 'Long pressure games and exceptional point construction sustained tension across all three sets.', dimensions: [{ label: 'Competitiveness', value: 97, band: 'Exceptional' }, { label: 'Eventfulness', value: 82, band: 'High' }, { label: 'Aesthetic quality', value: 95, band: 'Exceptional' }, { label: 'Importance', value: 89, band: 'High' }] },
  { ...guidance[1], projection: 'full-story', result: 'Mara Voss won from 11th after a late weather change.', analysis: 'Repeated strategy branches and a late reversal kept the lead genuinely uncertain.', dimensions: [{ label: 'Competitiveness', value: 94, band: 'Exceptional' }, { label: 'Eventfulness', value: 88, band: 'High' }, { label: 'Aesthetic quality', value: 84, band: 'High' }, { label: 'Importance', value: 91, band: 'Exceptional' }] },
  { ...guidance[2], projection: 'full-story', result: 'Harbour City won 3–2 in overtime.', analysis: 'Elite goaltending and special-teams pressure mattered more than raw shot volume.', dimensions: [{ label: 'Competitiveness', value: 92, band: 'Exceptional' }, { label: 'Eventfulness', value: 74, band: 'High' }, { label: 'Aesthetic quality', value: 86, band: 'High' }, { label: 'Importance', value: 68, band: 'Medium' }] },
  { ...guidance[3], projection: 'full-story', result: 'Bernard defeated Marin 7–5, 6–4.', analysis: 'Patient construction produced excellent passages despite a settled conclusion.', dimensions: [{ label: 'Competitiveness', value: 70, band: 'High' }, { label: 'Eventfulness', value: 67, band: 'Medium' }, { label: 'Aesthetic quality', value: 90, band: 'Exceptional' }, { label: 'Importance', value: 61, band: 'Medium' }] }
];

const responses: Record<DisclosureMode, Record<TimeBudget, { plan: string[]; excluded: string[] }>> = {
  'no-hints': {
    15: { plan: [], excluded: ['f1-aurora', 'wta-northstar', 'nhl-harbour', 'atp-meridian'] },
    30: { plan: ['nhl-harbour'], excluded: ['f1-aurora', 'wta-northstar', 'atp-meridian'] },
    60: { plan: ['f1-aurora'], excluded: ['wta-northstar', 'nhl-harbour', 'atp-meridian'] },
    120: { plan: ['f1-aurora', 'wta-northstar'], excluded: ['nhl-harbour', 'atp-meridian'] }
  },
  guidance: {
    15: { plan: [], excluded: ['wta-northstar', 'f1-aurora', 'nhl-harbour', 'atp-meridian'] },
    30: { plan: ['nhl-harbour'], excluded: ['wta-northstar', 'f1-aurora', 'atp-meridian'] },
    60: { plan: ['wta-northstar'], excluded: ['f1-aurora', 'nhl-harbour', 'atp-meridian'] },
    120: { plan: ['wta-northstar', 'f1-aurora'], excluded: ['nhl-harbour', 'atp-meridian'] }
  },
  'full-story': {
    15: { plan: [], excluded: ['wta-northstar', 'f1-aurora', 'nhl-harbour', 'atp-meridian'] },
    30: { plan: ['nhl-harbour'], excluded: ['wta-northstar', 'f1-aurora', 'atp-meridian'] },
    60: { plan: ['wta-northstar'], excluded: ['f1-aurora', 'nhl-harbour', 'atp-meridian'] },
    120: { plan: ['wta-northstar', 'f1-aurora'], excluded: ['nhl-harbour', 'atp-meridian'] }
  }
};

const projections = { 'no-hints': noHints, guidance, 'full-story': fullStory } as const;

/** Simulates the disclosure-safe GraphQL viewing-plan query. It performs no client ranking. */
export async function getMockViewingPlan(mode: DisclosureMode, budget: TimeBudget): Promise<ViewingPlanResponse> {
  const response = responses[mode][budget];
  const events: readonly (NoHintsEvent | GuidanceEvent | FullStoryEvent)[] = projections[mode];
  const byId = new Map(events.map((event) => [event.id, event]));
  return {
    mode, budgetMinutes: budget, generatedAt: '2026-07-26T08:12:00Z',
    totalMinutes: response.plan.reduce((sum, id) => sum + (byId.get(id)?.estimatedMinutes ?? 0), 0),
    headline: response.plan.length ? `A ${budget}-minute edit, composed for you` : `Nothing available fits ${budget} minutes`,
    plan: response.plan.map((id) => byId.get(id)!).filter(Boolean),
    excluded: response.excluded.map((id) => byId.get(id)!).filter(Boolean)
  };
}
