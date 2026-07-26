# Discriminated Sport Details

## Principle

Shared cards need a common shell; analysis and detail views need native structures. Use the `sport` discriminator to select one required detail payload. Never create a catch-all bag of optional fields.

```ts
type SportDetailsBySport = {
  AMERICAN_FOOTBALL: FootballDetails;
  ASSOCIATION_FOOTBALL: SoccerDetails;
  BASKETBALL: BasketballDetails;
  CYCLING: CyclingDetails;
  FORMULA_1: Formula1Details;
  HANDBALL: HandballDetails;
  ICE_HOCKEY: IceHockeyDetails;
  MOTOGP: MotoGPDetails;
  RALLY: RallyDetails;
  SUPERBIKE: SuperbikeDetails;
  TENNIS: TennisDetails;
  VOLLEYBALL: VolleyballDetails;
};
```

## Recommended safe detail shapes

```ts
type Side = { id: string; label: string };

type FootballDetails = {
  kind: 'AMERICAN_FOOTBALL'; competition: 'NFL'|'NCAA';
  home: Side; away: Side; seasonPhase: string; weekLabel: string;
};
type SoccerDetails = {
  kind: 'ASSOCIATION_FOOTBALL'; home: Side; away: Side;
  stage: string; tie?: { tieId: string; leg: number; legs: number };
};
type BasketballDetails = {
  kind: 'BASKETBALL'; competition: 'NBA'|'WNBA'|'NCAA_MEN'|'NCAA_WOMEN';
  home: Side; away: Side; phase: string; neutralSite: boolean;
};
type CyclingDetails = {
  kind: 'CYCLING'; discipline: 'ROAD'|'CYCLOCROSS'; format: string;
  category: string; eventName: string; stageName?: string;
  publishedRoute?: { distanceKm?: number; terrain?: string };
};
type Formula1Details = {
  kind: 'FORMULA_1'; weekendName: string;
  sessionType: 'FP1'|'FP2'|'FP3'|'SPRINT_QUALIFYING'|'QUALIFYING'|'SPRINT'|'RACE';
  weekendFormat: 'STANDARD'|'SPRINT'; circuit: string;
};
type HandballDetails = {
  kind: 'HANDBALL'; home: Side; away: Side; category: string; stage: string;
};
type IceHockeyDetails = {
  kind: 'ICE_HOCKEY'; league: 'NHL'|'PWHL'|'IIHF'; home: Side; away: Side; stage: string;
};
type MotoGPDetails = {
  kind: 'MOTOGP'; weekendName: string;
  sessionType: 'PRACTICE'|'QUALIFYING'|'SPRINT'|'RACE'; circuit: string;
};
type RallyDetails = {
  kind: 'RALLY'; rallyId: string; legId?: string; stageId?: string;
  unit: 'RALLY'|'LEG'|'SPECIAL_STAGE'; surface?: string;
};
type SuperbikeDetails = {
  kind: 'SUPERBIKE'; weekendName: string;
  sessionType: 'PRACTICE'|'SUPERPOLE'|'RACE_1'|'SUPERPOLE_RACE'|'RACE_2'; circuit: string;
};
type TennisSide = { id: string; players: Side[]; nation?: string };
type TennisDetails = {
  kind: 'TENNIS'; tour: 'ATP'|'WTA'|'ITF'; discipline: 'SINGLES'|'DOUBLES';
  sideA: TennisSide; sideB: TennisSide; round: string; surface: string;
  tie?: { eventId: string; tieId: string; rubberOrder: number };
};
type VolleyballDetails = {
  kind: 'VOLLEYBALL'; discipline: 'INDOOR'|'BEACH'; sideA: Side; sideB: Side;
  stage: string; tie?: { tieId: string; leg?: number; goldenSetPossible?: boolean };
};
```

These are safe-card subsets. Protected outcome types remain sport-owned: drives/score path; goals/cards/aggregate; possessions; groups/gaps/classifications; laps/timing/flags; rallies/sets; hockey periods/OT/SO; rally splits/penalties; tennis points/games/sets; and so forth.

## Hierarchies

| Sport | Native hierarchy | Recommendable leaf | Container may be useful for |
|---|---|---|---|
| American football | season → week/round → game | game | weekly plan |
| Association football | competition → tie → leg/match | match | aggregate tie context |
| Basketball | season/tournament → series/round → game | game | series/bracket context |
| Cycling | season → race event → stage | stage or one-day event | stage-race catch-up |
| Formula 1 | season → weekend → session | session | weekend plan |
| Handball | competition → tie/round → match | match | aggregate/round context |
| Ice hockey | season/tournament → series/group → game | game | series/tournament context |
| MotoGP | season → weekend → session | session | weekend dependency |
| Rally | championship → rally → leg → special stage → split | rally or special stage | leg/rally narrative |
| Superbike | season → weekend → session | session | grid/session dependency |
| Tennis | tournament/team event → tie → rubber/match | match/rubber | Davis Cup tie context |
| Volleyball | competition → tie → leg/match → set/rally | match | aggregate/Golden Set context |

`event` is therefore a product term meaning “recommendable unit,” not a universal governing-body object.

## Naming conflicts

- **Football:** reserve enum values `AMERICAN_FOOTBALL` and `ASSOCIATION_FOOTBALL`; do not expose ambiguous `FOOTBALL` in APIs.
- **Round:** can mean calendar round, tournament stage, qualifying segment, or racing weekend. Use `calendarRound`, `tournamentRound`, `qualifyingSegment`, or `weekendRound` inside details.
- **Stage:** cycling stage, rally special stage, or tournament phase. Use `cyclingStage`, `specialStage`, and `competitionStage`.
- **Match:** team game, tennis rubber, or tie leg. Use the sport detail's native term and shared `identity.contextLabel` for UI.
- **Session:** motorsport track session versus login/app session. Use `competitionSessionType`.
- **Set:** tennis/volleyball scoring unit versus motorsport setup. Never share a raw `sets` field.
- **Sprint:** F1/MotoGP/Superbike session, cycling finish/rider type, or athletic action. Qualify it.
- **Classification:** motorsport/rally/cycling official ordering, not generic lifecycle. Keep `officialClassification` protected and sport-owned.
- **Tie:** drawn score versus multi-match container. Use `tieContainer` and `isScoreTied`.
- **Overtime:** football/basketball/hockey/handball rules differ; its occurrence is protected. No universal OT structure.
- **Duration:** scheduled action, actual sporting time, broadcast runtime, and recommended viewing minutes are different fields.

## Sport-native evidence preservation

The convergence layer must not reproduce or reinterpret governing rules. Details link through `sourceStudy`; calculation services and future schemas must consult each sport's `data-points.md` and `watchability-model.md`. The shared envelope owns presentation semantics only.

## Unresolved modeling questions

- Should a Davis Cup tie, cycling stage race, rally, or race weekend receive its own recommendation ID alongside children?
- Should two-leg football/handball/volleyball context be a generic container interface or remain three separate types?
- Can racing championships share a `WeekendSession` internal interface without obscuring grid dependencies?
- Should participants become a generic safe array? It helps avatars/affinity, but team, pair, rider/constructor, crew, and nation semantics are easy to corrupt. Current recommendation: keep labels in identity and typed entities in details.
