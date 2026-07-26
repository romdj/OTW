# Ice-Hockey Decision Data Study

This study specifies the evidence needed to answer OTW's five hockey questions:
how important is the game beforehand, how watchable was it afterward, what can
be explained without spoilers, what matters to this user, and whether to choose
a full replay, condensed game, highlights, or skip.

Scope covers NHL, PWHL, and current IIHF tournament hockey. It complements the
existing `ice-hockey/types.ts` and UI/UX studies; it does not describe an
implemented provider contract. No legacy `3point` study was found in the
workspace. The old `internationalSystemPoints` field is not an official NHL
standing and must be labelled hypothetical if retained.

## Reading map

- [data-points.md](data-points.md): raw, derived, contextual, personal and
  forbidden fields, with MVP priorities.
- [watchability-model.md](watchability-model.md): formulas, uncertainty,
  league rules, edge cases and validation.
- [mock-data-contract.md](mock-data-contract.md): lifecycle and spoiler policy.
- [mock-events.json](mock-events.json): fictional fixtures; every record is
  explicitly `source: "MOCK"`.

Labels mean **Evidence** = sourced fact, **Inference** = conclusion from facts,
and **Recommendation** = proposed OTW behavior requiring validation.

## Primary references

- **Evidence:** [NHL 2025-26 Official Rules, Rule 84](https://media.nhl.com/site/asset/public/ext/2025-26/2025-26Rules.pdf) defines three 20-minute periods, regular-season five-minute 3-on-3 overtime and the standings point awarded at regulation tie.
- **Evidence:** [NHL hockey glossary](https://www.nhl.com/info/hockey-glossary) defines shots on goal, save percentage, special-teams rates, playoff format and standings tiebreakers.
- **Evidence:** [PWHL playoff tiebreaker procedure](https://www.thepwhl.com/en/playoff-tiebreaker-procedure) prioritizes games played/points percentage, regulation wins, regulation-plus-overtime wins, total wins, head-to-head, goal differential, then goals.
- **Evidence:** [PWHL Beginner's Guide](https://www.thepwhl.com/en/beginners-guide) defines the 3-2-1-0 points system and league-specific Jailbreak and No Escape rules.
- **Evidence:** [2025 IIHF World Championship format](https://www.iihf.com/en/events/2025/wm/tournamentinfo/59062/tournament_format) defines the 3-2-1-0 system, group tiebreak logic, five-minute preliminary OT, ten-minute playoff OT and continuous 20-minute gold-medal OT.
- **Evidence:** [IIHF 2025-26 Rule Book](https://blob.iihf.com/iihf-media/iihfmvc/media/contentimages/4_sport/officiating/rule_book/25_26/2025-26_iihf_rulebook_19052025-v1.pdf) is the governing international rules source.

Rule snapshots must be versioned by competition, season and stage; never infer
an IIHF event's format merely from the `IIHF` organizer label.
