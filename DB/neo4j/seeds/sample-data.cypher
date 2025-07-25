// Sample data to demonstrate otw.sport relationship patterns
// This creates a realistic graph structure with NHL events, users, and relationships

// === SPORTS AND CATEGORIES ===
CREATE (hockey:Sport {name: "Hockey", category: "Team Sport", popularity: 8.5})
CREATE (football:Sport {name: "Football", category: "Team Sport", popularity: 9.8})
CREATE (basketball:Sport {name: "Basketball", category: "Team Sport", popularity: 9.2});

// === LEAGUES AND ORGANIZATIONAL STRUCTURE ===
CREATE (nhl:League {
  name: "NHL", 
  sport: "Hockey", 
  founded: 1917,
  country: "North America",
  teams: 32
})

CREATE (eastern:Conference {name: "Eastern Conference", league: "NHL"})
CREATE (western:Conference {name: "Western Conference", league: "NHL"})

CREATE (atlantic:Division {name: "Atlantic", conference: "Eastern"})
CREATE (metro:Division {name: "Metropolitan", conference: "Eastern"})
CREATE (central:Division {name: "Central", conference: "Western"})
CREATE (pacific:Division {name: "Pacific", conference: "Western"});

// === TEAMS ===
CREATE (bruins:Team {
  id: "BOS",
  name: "Boston Bruins", 
  city: "Boston", 
  established: 1924,
  colors: ["Black", "Gold"],
  championships: 6
})

CREATE (leafs:Team {
  id: "TOR", 
  name: "Toronto Maple Leafs", 
  city: "Toronto", 
  established: 1917,
  colors: ["Blue", "White"],
  championships: 13
})

CREATE (rangers:Team {
  id: "NYR",
  name: "New York Rangers", 
  city: "New York", 
  established: 1926,
  colors: ["Blue", "Red", "White"],
  championships: 4
})

CREATE (lightning:Team {
  id: "TBL",
  name: "Tampa Bay Lightning", 
  city: "Tampa Bay", 
  established: 1992,
  colors: ["Blue", "White"],
  championships: 3
});

// === VENUES ===
CREATE (td_garden:Venue {
  name: "TD Garden",
  city: "Boston",
  capacity: 17850,
  coordinates: {lat: 42.3662, lng: -71.0621}
})

CREATE (scotiabank:Venue {
  name: "Scotiabank Arena",
  city: "Toronto", 
  capacity: 18800,
  coordinates: {lat: 43.6434, lng: -79.3791}
});

// === EMOTIONAL TAGS ===
CREATE (nailbiter:Tag {name: "nail-biter", category: "emotion", weight: 0.9})
CREATE (comeback:Tag {name: "comeback", category: "outcome", weight: 0.85})
CREATE (historic:Tag {name: "historic-moment", category: "significance", weight: 0.95})
CREATE (rivalry:Tag {name: "rivalry", category: "context", weight: 0.8})
CREATE (explosive:Tag {name: "explosive-finish", category: "outcome", weight: 0.88})
CREATE (dominant:Tag {name: "dominant-performance", category: "style", weight: 0.75})
CREATE (emotional:Tag {name: "emotional", category: "emotion", weight: 0.85})
CREATE (legendary:Tag {name: "legendary", category: "significance", weight: 0.95});

// === SAMPLE USERS ===
CREATE (alice:User {
  id: "user_001",
  username: "hockey_fanatic_alice",
  displayName: "Alice Chen",
  email: "alice@example.com",
  reputationScore: 1250,
  reviewsCount: 47,
  favoriteSports: ["Hockey", "Basketball"],
  createdAt: datetime("2023-01-15T10:00:00Z")
})

CREATE (bob:User {
  id: "user_002", 
  username: "sports_historian_bob",
  displayName: "Bob Thompson",
  email: "bob@example.com",
  reputationScore: 2100,
  reviewsCount: 89,
  favoriteSports: ["Hockey", "Football"],
  createdAt: datetime("2022-08-20T14:30:00Z")
})

CREATE (carol:User {
  id: "user_003",
  username: "casual_viewer_carol", 
  displayName: "Carol Martinez",
  email: "carol@example.com",
  reputationScore: 450,
  reviewsCount: 12,
  favoriteSports: ["Hockey"],
  createdAt: datetime("2023-11-03T09:15:00Z")
});

// === HISTORIC EVENTS ===
CREATE (miracle_on_ice:Event {
  id: "event_001",
  title: "Miracle on Ice - USA vs USSR",
  sport: "Hockey",
  date: datetime("1980-02-22T20:00:00Z"),
  averageRating: 9.8,
  watchabilityScore: 98.5,
  significance: ["historic-moment", "upset-victory", "Olympic-final"],
  description: "USA defeats heavily favored Soviet Union 4-3 in 1980 Olympics semifinal"
})

CREATE (game7_2011:Event {
  id: "event_002", 
  title: "2011 Stanley Cup Final Game 7 - Bruins vs Canucks",
  sport: "Hockey",
  date: datetime("2011-06-15T20:00:00Z"),
  averageRating: 9.2,
  watchabilityScore: 94.2,
  significance: ["championship-clinching", "game-7"],
  description: "Boston Bruins defeat Vancouver Canucks 4-0 to win Stanley Cup"
})

CREATE (leafs_comeback_2013:Event {
  id: "event_003",
  title: "Leafs Collapse - Game 7 vs Bruins 2013",
  sport: "Hockey", 
  date: datetime("2013-05-13T19:00:00Z"),
  averageRating: 9.5,
  watchabilityScore: 96.8,
  significance: ["epic-collapse", "comeback", "game-7"],
  description: "Bruins overcome 4-1 deficit in final 10 minutes, win in OT"
})

CREATE (rangers_messier:Event {
  id: "event_004",
  title: "Messier's Guarantee - Rangers vs Devils 1994",
  sport: "Hockey",
  date: datetime("1994-05-25T20:00:00Z"), 
  averageRating: 9.0,
  watchabilityScore: 92.0,
  significance: ["legendary-performance", "clutch", "guarantee-fulfilled"],
  description: "Mark Messier guarantees victory and delivers hat trick in Game 6"
});

// === ORGANIZATIONAL RELATIONSHIPS ===
(nhl)-[:CONTAINS]->(eastern)
(nhl)-[:CONTAINS]->(western)
(eastern)-[:CONTAINS]->(atlantic)
(eastern)-[:CONTAINS]->(metro)
(western)-[:CONTAINS]->(central)
(western)-[:CONTAINS]->(pacific)
(atlantic)-[:CONTAINS]->(bruins)
(atlantic)-[:CONTAINS]->(leafs)
(metro)-[:CONTAINS]->(rangers)
(atlantic)-[:CONTAINS]->(lightning);

// === TEAM RIVALRIES ===
CREATE (bruins)-[:RIVALS {
  intensity: 9,
  since: 1924,
  historicalMeetings: 756,
  playoffSeries: 14,
  notableGames: ["2013 Game 7", "2018 Round 1"]
}]-(leafs)

CREATE (bruins)-[:RIVALS {
  intensity: 8,
  since: 1926, 
  historicalMeetings: 432,
  playoffSeries: 8,
  notableGames: ["1972 Stanley Cup Final", "2013 Conference Semifinals"]
}]-(rangers);

// === VENUE RELATIONSHIPS ===
CREATE (bruins)-[:HOME_VENUE]->(td_garden)
CREATE (leafs)-[:HOME_VENUE]->(scotiabank);

// === EVENT PARTICIPATION ===
CREATE (miracle_on_ice)-[:FEATURED]->(hockey)
CREATE (game7_2011)-[:FEATURED]->(bruins)
CREATE (game7_2011)-[:TOOK_PLACE_AT]->(scotiabank)
CREATE (leafs_comeback_2013)-[:FEATURED]->(bruins)
CREATE (leafs_comeback_2013)-[:FEATURED]->(leafs)
CREATE (leafs_comeback_2013)-[:TOOK_PLACE_AT]->(td_garden)
CREATE (rangers_messier)-[:FEATURED]->(rangers);

// === EVENT TAGS ===
CREATE (miracle_on_ice)-[:TAGGED_WITH]->(historic)
CREATE (miracle_on_ice)-[:TAGGED_WITH]->(emotional)
CREATE (miracle_on_ice)-[:TAGGED_WITH]->(legendary)

CREATE (game7_2011)-[:TAGGED_WITH]->(historic)
CREATE (game7_2011)-[:TAGGED_WITH]->(dominant)

CREATE (leafs_comeback_2013)-[:TAGGED_WITH]->(nailbiter)
CREATE (leafs_comeback_2013)-[:TAGGED_WITH]->(comeback)
CREATE (leafs_comeback_2013)-[:TAGGED_WITH]->(explosive)
CREATE (leafs_comeback_2013)-[:TAGGED_WITH]->(rivalry)
CREATE (leafs_comeback_2013)-[:TAGGED_WITH]->(historic)

CREATE (rangers_messier)-[:TAGGED_WITH]->(legendary)
CREATE (rangers_messier)-[:TAGGED_WITH]->(emotional)
CREATE (rangers_messier)-[:TAGGED_WITH]->(dominant);

// === USER RATINGS ===
CREATE (alice)-[:RATED {rating: 9.5, ratedAt: datetime("2023-02-01T15:30:00Z"), wouldRecommend: true}]->(leafs_comeback_2013)
CREATE (alice)-[:RATED {rating: 8.8, ratedAt: datetime("2023-02-15T10:20:00Z"), wouldRecommend: true}]->(game7_2011)
CREATE (alice)-[:RATED {rating: 10.0, ratedAt: datetime("2023-01-20T20:45:00Z"), wouldRecommend: true}]->(miracle_on_ice)

CREATE (bob)-[:RATED {rating: 9.8, ratedAt: datetime("2023-01-25T14:10:00Z"), wouldRecommend: true}]->(miracle_on_ice)
CREATE (bob)-[:RATED {rating: 9.3, ratedAt: datetime("2023-02-08T11:30:00Z"), wouldRecommend: true}]->(leafs_comeback_2013)
CREATE (bob)-[:RATED {rating: 9.0, ratedAt: datetime("2023-02-20T16:15:00Z"), wouldRecommend: true}]->(rangers_messier)

CREATE (carol)-[:RATED {rating: 8.5, ratedAt: datetime("2023-11-10T19:00:00Z"), wouldRecommend: true}]->(leafs_comeback_2013)
CREATE (carol)-[:RATED {rating: 7.8, ratedAt: datetime("2023-11-15T12:30:00Z"), wouldRecommend: false}]->(game7_2011);

// === USER FOLLOWS ===
CREATE (alice)-[:FOLLOWS {followedAt: datetime("2023-01-20T10:00:00Z")}]->(bruins)
CREATE (alice)-[:FOLLOWS {followedAt: datetime("2023-01-20T10:01:00Z")}]->(hockey)
CREATE (bob)-[:FOLLOWS {followedAt: datetime("2022-09-01T14:00:00Z")}]->(nhl)
CREATE (carol)-[:FOLLOWS {followedAt: datetime("2023-11-05T16:30:00Z")}]->(leafs);

// === SAMPLE LISTS ===
CREATE (greatest_comebacks:List {
  id: "list_001",
  title: "Greatest Hockey Comebacks of All Time",
  description: "Games where teams overcame impossible odds",
  isPublic: true,
  category: "comebacks",
  sport: "Hockey",
  createdAt: datetime("2023-06-15T14:20:00Z")
})

CREATE (alice)-[:CREATED]->(greatest_comebacks)
CREATE (greatest_comebacks)-[:CONTAINS {position: 1, note: "The most incredible comeback in playoff history"}]->(leafs_comeback_2013)
CREATE (greatest_comebacks)-[:CONTAINS {position: 2, note: "David vs Goliath at its finest"}]->(miracle_on_ice);

RETURN "Sample data created successfully" as result;