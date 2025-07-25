// Neo4j initialization script for otw.sport
// Run with: cypher-shell -f init-neo4j.cypher

// Clear existing data (use with caution!)
// MATCH (n) DETACH DELETE n;

CALL db.info() YIELD kernelVersion;

// Create database if it doesn't exist (Neo4j 4.0+)
// CREATE DATABASE otw IF NOT EXISTS;
// :USE otw;

:param echo => true;

CALL {
  WITH "🏒 Initializing otw.sport Neo4j graph database..." as message
  RETURN message
} CALL {
  RETURN "Starting initialization..." as step
} RETURN step, message;

// === STEP 1: CREATE CONSTRAINTS AND INDEXES ===
CALL {
  WITH "📋 Creating constraints and indexes..." as message
  RETURN message
};

// Load constraints from separate file
:source constraints/constraints.cypher

// === STEP 2: LOAD SAMPLE DATA ===
CALL {
  WITH "🌱 Loading sample data and relationships..." as message  
  RETURN message
};

// Load sample data from separate file
:source seeds/sample-data.cypher

// === STEP 3: CREATE DERIVED RELATIONSHIPS ===
CALL {
  WITH "🔗 Building relationship patterns..." as message
  RETURN message
};

// Create event similarity relationships based on shared tags
MATCH (e1:Event)-[:TAGGED_WITH]->(tag:Tag)<-[:TAGGED_WITH]-(e2:Event)
WHERE e1 <> e2 AND e1.sport = e2.sport
WITH e1, e2, COUNT(tag) as sharedTags, 
     ABS(e1.averageRating - e2.averageRating) as ratingDiff
WHERE sharedTags >= 2 AND ratingDiff <= 2.0
MERGE (e1)-[sim:SIMILAR_TO]-(e2)
SET sim.similarityScore = (sharedTags * 10) - ratingDiff,
    sim.sharedTagCount = sharedTags,
    sim.ratingDifference = ratingDiff,
    sim.createdAt = datetime();

// Create user taste similarity relationships
MATCH (u1:User)-[r1:RATED]->(event:Event)<-[r2:RATED]-(u2:User)
WHERE u1 <> u2 AND ABS(r1.rating - r2.rating) <= 1.5
WITH u1, u2, 
     COUNT(event) as sharedEvents,
     AVG(ABS(r1.rating - r2.rating)) as avgRatingDiff
WHERE sharedEvents >= 2
MERGE (u1)-[sim:SIMILAR_TASTE]-(u2)
SET sim.sharedEvents = sharedEvents,
    sim.tasteAlignment = 10 - avgRatingDiff,
    sim.createdAt = datetime();

// Create tag co-occurrence relationships
MATCH (e:Event)-[:TAGGED_WITH]->(tag1:Tag), (e)-[:TAGGED_WITH]->(tag2:Tag)
WHERE tag1 <> tag2
WITH tag1, tag2, COUNT(e) as coOccurrence
WHERE coOccurrence >= 1
MERGE (tag1)-[co:CO_OCCURS_WITH]-(tag2)
SET co.frequency = coOccurrence,
    co.strength = CASE 
      WHEN coOccurrence >= 3 THEN "strong"
      WHEN coOccurrence >= 2 THEN "moderate" 
      ELSE "weak"
    END,
    co.createdAt = datetime();

// Create event sequence relationships for story arcs
MATCH (earlier:Event), (later:Event)
WHERE earlier.date < later.date
  AND earlier.sport = later.sport
  AND duration.between(earlier.date, later.date).days <= 365
  AND EXISTS((earlier)-[:FEATURED]->(team:Team)<-[:FEATURED]-(later))
WITH earlier, later, 
     duration.between(earlier.date, later.date).days as daysBetween
WHERE daysBetween > 0
MERGE (earlier)-[chain:LEADS_TO]->(later)
SET chain.daysBetween = daysBetween,
    chain.context = "Sequential events involving same teams",
    chain.createdAt = datetime();

// === STEP 4: VALIDATE DATA INTEGRITY ===
CALL {
  WITH "🔍 Validating data integrity..." as message
  RETURN message
};

// Check constraint compliance
CALL db.constraints()
YIELD name, description
WITH count(*) as constraintCount
RETURN "Constraints created: " + constraintCount as validation;

// Check basic data counts
MATCH (n) 
WITH labels(n)[0] as nodeType, count(n) as nodeCount
RETURN "Node counts by type:" as category, collect(nodeType + ": " + nodeCount) as counts;

MATCH ()-[r]->()
WITH type(r) as relType, count(r) as relCount  
RETURN "Relationship counts by type:" as category, collect(relType + ": " + relCount) as counts;

// === STEP 5: CREATE SAMPLE QUERIES FOR TESTING ===
CALL {
  WITH "🎯 Testing sample queries..." as message
  RETURN message  
};

// Test 1: Find events similar to a specific event
MATCH (event:Event {title: "Leafs Collapse - Game 7 vs Bruins 2013"})-[:SIMILAR_TO]-(similar:Event)
RETURN "Similar events found:" as test, count(similar) as count;

// Test 2: Find users with similar taste
MATCH (user:User)-[:SIMILAR_TASTE]-(similar:User)
WHERE user.username = "hockey_fanatic_alice" 
RETURN "Users with similar taste:" as test, count(similar) as count;

// Test 3: Find most co-occurring tags
MATCH (tag1:Tag)-[co:CO_OCCURS_WITH]-(tag2:Tag)
WHERE co.frequency >= 2
RETURN "Tag co-occurrences:" as test, count(co) as count;

// Test 4: Find event story chains
MATCH path = (start:Event)-[:LEADS_TO*1..2]->(end:Event)
RETURN "Event story chains:" as test, count(path) as count;

// === COMPLETION SUMMARY ===
RETURN "✅ Neo4j initialization complete!" as status,
       "Graph database ready for otw.sport relationship queries" as message;

// Performance recommendations
CALL {
  WITH [
    "🚀 Performance Tips:",
    "1. Monitor query performance with PROFILE/EXPLAIN",
    "2. Add more specific indexes based on usage patterns", 
    "3. Consider data modeling adjustments as user base grows",
    "4. Use APOC procedures for complex operations",
    "5. Implement query result caching for frequent patterns"
  ] as tips
  UNWIND tips as tip
  RETURN tip
};

// Next steps
CALL {  
  WITH [
    "📋 Next Steps:",
    "1. Configure application connection (bolt://localhost:7687)",
    "2. Set up authentication and user roles",
    "3. Implement backup and monitoring strategies", 
    "4. Test relationship queries with larger datasets",
    "5. Optimize queries based on actual usage patterns"
  ] as steps
  UNWIND steps as step
  RETURN step
};