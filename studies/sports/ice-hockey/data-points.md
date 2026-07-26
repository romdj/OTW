# Hockey Data Points

## Field classes

### Raw facts

**Recommendation — MVP:** provider/event/team IDs; league, competition,
season, stage, group, scheduled UTC, status; home/away/neutral designation;
regulation/OT/shootout rule profile; standings snapshot timestamp; pregame
rank/points/games played; playoff series state *before* the game; roster and
starting-goalie status when authoritative. For completed scoring: ordered
goals with period, elapsed/game time, team, manpower and empty-net flag;
penalties; shots on goal by period; goalie saves/shots faced; finality and
provider correction timestamp.

**Recommendation — extended:** shot attempts and coordinates, expected goals,
blocked/missed shots, zone time/entries, possession proxies, faceoffs, hits,
giveaways/takeaways, shift data, goalie changes/pulls, delayed penalties,
video timestamps and win-probability feed. Preserve provider definitions and
never silently merge differently defined shot/xG feeds.

**Evidence:** NHL defines a shot on goal as a puck that enters or would enter
without a goalie stop, and save percentage as saves divided by shots faced
([NHL glossary](https://www.nhl.com/info/hockey-glossary)). Therefore attempts,
shots on goal and scoring chances are not interchangeable.

### Derived metrics

- Score state at each event: differential from each team's perspective,
  tied seconds, one-goal-margin seconds, trailing/leading seconds.
- Lead changes: count only transitions from one team leading to the other;
  `tie -> lead` is a go-ahead event, not a lead change. Track ties reached
  separately and exclude the initial 0-0 tie.
- Comeback depth: maximum deficit later erased; comeback completion is
  outcome-sensitive.
- Suspense: time-integral of win-probability uncertainty, or a score/time proxy.
- Volatility: sum of absolute win-probability changes, capped per event and
  normalized by game length.
- Pressure: rolling shot-attempt/xG share plus high-danger chances; fall back
  to shots-on-goal rate and label low confidence.
- Goaltending impact: goals saved above expected when compatible xG exists;
  otherwise compare saves/shots faced to competition/season baseline with
  wide uncertainty. Never call raw save percentage a goalie-only effect.
- Special-teams leverage: probability swing or score/time-weighted PP/PK events,
  including shorthanded goals and major-penalty sequences.
- Empty-net tension: goalie-pulled seconds while score within two; a goalie pull
  cannot be reliably inferred only from an empty-net goal.
- Stakes delta: change in qualification/seed/series advancement probability
  from official pregame scenarios or simulated standings.

### Contextual features

Competition/stage; regular season vs elimination; best-of series game number
and pregame series score; group-table state; medal/relegation implications;
official clinch/elimination scenarios; back-to-back/rest/travel; rivalry type
(geographic, historic, recent playoff); rematch; outdoor/neutral event; team and
player milestones known before puck drop. Rivalry is curated evidence with a
reason and validity window, not a permanent magic number.

### Personalization features

Followed team/player/nation; favourite or rival team; league familiarity;
preference for tactical defence, goaltending, scoring, physicality, stars,
upsets or high stakes; spoiler strictness; available minutes; full-replay
access; tolerance for shootouts; already-watched/known-result state; preferred
language and accessibility. Personal relevance changes priority, never the
objective event facts.

## Spoiler field policy

| Field | Blind/pre-event | Completed protected | Revealed |
|---|---|---|---|
| Teams, scheduled time, pregame stakes | allow | allow | allow |
| Final/period score, winner, points earned | forbid | forbid | allow |
| OT/SO occurred, actual duration | forbid | forbid | allow |
| Lead/tie/comeback counts, WP curve | forbid | forbid | allow |
| Goalies' postgame lines, stars, milestones achieved | forbid | forbid | allow |
| “Classic”, “comeback”, “goalie duel”, excitement score/rank | forbid | forbid by default | allow |
| Full/condensed/highlights recommendation | optional user policy | weak spoiler; hide in Blind mode | allow |
| Provider URL, image, alt text, analytics label | audit | audit/forbid leaks | allow |

**Recommendation:** protected explanations may use only pre-event facts:
“division rivals with playoff positioning at stake.” Do not say “stayed close,”
“late drama,” or even “needed extra time.” Store forbidden values in a separate
reveal payload, not merely CSS-hidden DOM.

## League-specific facts

- **NHL:** two points for any win, one for an OT/SO loss; regular-season tie
  after regulation guarantees each team one point. Playoffs are best-of-seven
  with sudden-death overtime and no shootout. Official position uses NHL
  tiebreakers, not a derived 3-point table.
- **PWHL:** current standings encode regulation wins separately and use a
  three-point incentive structure (records such as `RW-OTW-SOW-L` must not be
  parsed as NHL W-L-OTL). A shorthanded Jailbreak goal can end the opponent's
  minor penalty, so penalty-expiry derivation must use the PWHL rule profile,
  not NHL logic ([PWHL guide](https://www.thepwhl.com/en/beginners-guide)).
  The 2025-26 Gold Plan creates post-elimination draft
  stakes; version it as a competition rule, not timeless logic.
- **IIHF:** common current tournaments use 3 regulation-win, 2 OT/SO-win,
  1 OT/SO-loss, 0 regulation-loss points. OT length/shootout availability varies
  by preliminary, playoff, bronze and gold stages.

## Missing-data behavior

With no play-by-play, calculate only pregame importance plus low-confidence
box-score descriptors. Do not estimate lead changes, tied time, comeback,
pressure sequences, goalie-pull duration or suspense. With goals but no shots,
compute score-state features but omit pressure/goaltending impact. Expose
`availableInputs`, `missingInputs`, `coverage`, and `confidence` on every model
result.
