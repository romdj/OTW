// === TOP 5 RELATIONSHIP PATTERNS FOR OTW.SPORT ===

// ===== 1. EVENT SIMILARITY & RECOMMENDATIONS =====
// Find events similar to a given event based on tags, participants, and user ratings
// This enables "If you liked X, you'll love Y" recommendations

// Create similarity relationships between events
MATCH (e1:Event)-[:TAGGED_WITH]->(tag:Tag)<-[:TAGGED_WITH]-(e2:Event)
WHERE e1 <> e2 AND e1.sport = e2.sport
WITH e1, e2, COUNT(tag) as sharedTags, 
     ABS(e1.averageRating - e2.averageRating) as ratingDiff
WHERE sharedTags >= 3 AND ratingDiff <= 2.0
MERGE (e1)-[sim:SIMILAR_TO]-(e2)
SET sim.similarityScore = (sharedTags * 10) - ratingDiff,
    sim.sharedTagCount = sharedTags,
    sim.ratingDifference = ratingDiff;

// Find recommended events for a user based on their rating history
MATCH (user:User)-[r:RATED]->(event:Event)-[:SIMILAR_TO]-(similar:Event)
WHERE r.rating >= 8.0 AND NOT EXISTS((user)-[:RATED]->(similar))
WITH user, similar, 
     AVG(r.rating) as userAvgRating,
     COUNT(*) as similarityCount,
     similar.averageRating as eventRating
WHERE similarityCount >= 2
RETURN similar.title, similar.sport, eventRating, similarityCount
ORDER BY (eventRating + userAvgRating) / 2 DESC, similarityCount DESC
LIMIT 10;

// ===== 2. USER PREFERENCE NETWORKS =====
// Connect users with similar tastes and create taste communities
// Enables social discovery and friend recommendations

// Create user similarity based on rating patterns
MATCH (u1:User)-[r1:RATED]->(event:Event)<-[r2:RATED]-(u2:User)
WHERE u1 <> u2 AND ABS(r1.rating - r2.rating) <= 1.5
WITH u1, u2, 
     COUNT(event) as sharedEvents,
     AVG(ABS(r1.rating - r2.rating)) as avgRatingDiff,
     COLLECT(event.title) as commonlyRatedEvents
WHERE sharedEvents >= 5
MERGE (u1)-[sim:SIMILAR_TASTE]-(u2)
SET sim.sharedEvents = sharedEvents,
    sim.tasteAlignment = 10 - avgRatingDiff,
    sim.commonEvents = commonlyRatedEvents;

// Find users with similar preferences for friend recommendations
MATCH (user:User {username: $username})-[:SIMILAR_TASTE]-(similar:User)
WHERE NOT EXISTS((user)-[:FOLLOWS]->(similar))
WITH similar, 
     [(similar)-[:RATED]->(e:Event) WHERE e.averageRating >= 8.0 | e.title] as highRatedEvents
RETURN similar.username, similar.displayName, 
       SIZE(highRatedEvents) as qualityReviews,
       highRatedEvents[0..3] as sampleEvents
ORDER BY qualityReviews DESC
LIMIT 10;

// ===== 3. TEAM/PLAYER/LEAGUE HIERARCHIES =====
// Model organizational structures in sports for contextual discovery
// Enables browsing by team, following leagues, player career tracking

// Create team hierarchies and relationships
MERGE (nhl:League {name: "NHL", sport: "hockey", country: "North America"})
MERGE (eastern:Conference {name: "Eastern Conference", league: "NHL"})
MERGE (western:Conference {name: "Western Conference", league: "NHL"})
MERGE (atlantic:Division {name: "Atlantic", conference: "Eastern"})
MERGE (metro:Division {name: "Metropolitan", conference: "Eastern"})

// Link teams to divisions, conferences, leagues
MERGE (bruins:Team {name: "Boston Bruins", city: "Boston", established: 1924})
MERGE (leafs:Team {name: "Toronto Maple Leafs", city: "Toronto", established: 1917})
MERGE (atlantic)-[:CONTAINS]->(bruins)
MERGE (atlantic)-[:CONTAINS]->(leafs)
MERGE (eastern)-[:CONTAINS]->(atlantic)
MERGE (nhl)-[:CONTAINS]->(eastern)

// Create rivalry relationships
MERGE (bruins)-[rivalry:RIVALS {
  intensity: 9,
  historicalMeetings: 156,
  since: 1924,
  keyMoments: ["1979 Semifinal", "2013 Playoff Series", "2018 Round 1"]
}]-(leafs);

// Find all teams in a user's favorite league
MATCH (user:User {username: $username})-[:FOLLOWS]->(league:League)
MATCH (league)-[:CONTAINS*1..3]->(team:Team)
RETURN league.name, team.name, team.city
ORDER BY league.name, team.name;

// ===== 4. HISTORICAL EVENT CHAINS =====
// Connect events that reference, build upon, or respond to each other
// Enables "story arc" discovery and historical context browsing

// Create event sequence relationships for comebacks, rivalries, records
MATCH (earlier:Event), (later:Event)
WHERE earlier.date < later.date
  AND earlier.sport = later.sport
  AND EXISTS((earlier)-[:FEATURED]->(team:Team)<-[:FEATURED]-(later))
WITH earlier, later, 
     CASE 
       WHEN ANY(tag IN earlier.significance WHERE tag CONTAINS "record") 
            AND ANY(tag IN later.significance WHERE tag CONTAINS "record")
       THEN "RECORD_PROGRESSION"
       WHEN ANY(tag IN earlier.tags WHERE tag = "comeback") 
            AND ANY(tag IN later.tags WHERE tag = "revenge")
       THEN "REVENGE_STORY" 
       ELSE "CONTINUATION"
     END as chainType
MERGE (earlier)-[chain:LEADS_TO {
  type: chainType,
  daysBetween: duration.between(earlier.date, later.date).days,
  context: "Historical progression"
}]->(later);

// Discover event story arcs
MATCH path = (start:Event)-[:LEADS_TO*1..4]->(end:Event)
WHERE start.sport = $sport 
  AND ANY(rel IN relationships(path) WHERE rel.type = "REVENGE_STORY")
WITH path, LENGTH(path) as storyLength
RETURN [event IN nodes(path) | event.title] as storyArc,
       [rel IN relationships(path) | rel.type] as connectionTypes,
       storyLength
ORDER BY storyLength DESC
LIMIT 5;

// ===== 5. TAG/CATEGORY RELATIONSHIPS =====
// Model how emotional tags relate and cluster together
// Enables advanced filtering and emotional journey recommendations

// Create tag co-occurrence relationships
MATCH (e:Event)-[:TAGGED_WITH]->(tag1:Tag), (e)-[:TAGGED_WITH]->(tag2:Tag)
WHERE tag1 <> tag2
WITH tag1, tag2, COUNT(e) as coOccurrence
WHERE coOccurrence >= 10
MERGE (tag1)-[co:CO_OCCURS_WITH]-(tag2)
SET co.frequency = coOccurrence,
    co.strength = CASE 
      WHEN coOccurrence >= 50 THEN "strong"
      WHEN coOccurrence >= 25 THEN "moderate" 
      ELSE "weak"
    END;

// Create emotional tag hierarchies
MERGE (thrilling:TagCategory {name: "High Intensity", description: "Heart-pounding moments"})
MERGE (emotional:TagCategory {name: "Emotional", description: "Touching and meaningful moments"})
MERGE (technical:TagCategory {name: "Technical Excellence", description: "Masterful skill displays"})

// Link specific tags to categories
MATCH (tag:Tag) 
WHERE tag.name IN ["nail-biter", "explosive-finish", "thrilling", "comeback"]
MERGE (thrilling)-[:INCLUDES]->(tag);

MATCH (tag:Tag) 
WHERE tag.name IN ["emotional", "historic-moment", "legendary", "heartbreaking"]
MERGE (emotional)-[:INCLUDES]->(tag);

// Find emotional journey recommendations
MATCH (user:User)-[r:RATED]->(event:Event)-[:TAGGED_WITH]->(tag:Tag)<-[:INCLUDES]-(category:TagCategory)
WHERE r.rating >= 8.0 AND category.name = $preferredCategory
WITH user, category, COUNT(*) as affinity
ORDER BY affinity DESC
LIMIT 1
MATCH (category)-[:INCLUDES]->(relatedTag:Tag)<-[:TAGGED_WITH]-(recommendedEvent:Event)
WHERE NOT EXISTS((user)-[:RATED]->(recommendedEvent))
  AND recommendedEvent.averageRating >= 7.5
RETURN recommendedEvent.title, 
       recommendedEvent.sport,
       recommendedEvent.averageRating,
       COLLECT(relatedTag.name) as emotionalTags
ORDER BY recommendedEvent.averageRating DESC
LIMIT 10;