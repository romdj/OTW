# 🏒 OTW.sport Database Architecture

This directory contains the complete database architecture for **otw.sport** - "The IMDb of Sporting Events". The system uses a **hybrid database approach** combining MongoDB for document storage and Neo4j for relationship modeling.

## 🏗️ Architecture Overview

```
DB/
├── mongodb/          # Document storage for events, reviews, users
├── neo4j/           # Graph relationships and recommendations  
└── shared/          # Common utilities and types
```

### Why Hybrid Architecture?

- **MongoDB**: Perfect for storing rich, nested documents (events with media, user profiles, reviews)
- **Neo4j**: Excels at complex relationships and recommendation algorithms
- **Together**: Provides both flexible document storage AND powerful relationship queries

## 📊 Data Models

### MongoDB Collections

| Collection | Purpose | Key Features |
|------------|---------|--------------|
| `events` | Sporting events with rich metadata | Ratings, tags, media assets, significance markers |
| `users` | User profiles and preferences | Taste preferences, reputation, social features |
| `reviews` | Event reviews and ratings | Emotional tags, key moments, recommendations |
| `lists` | Curated event collections | "Top 10 Upsets", "Greatest Finals", etc. |

### Neo4j Node Types

| Node Type | Purpose | Key Properties |
|-----------|---------|----------------|
| `Event` | Events referenced from MongoDB | `id`, `title`, `sport`, `averageRating` |
| `User` | Users referenced from MongoDB | `id`, `username`, `reputationScore` |
| `Team` | Sports teams/organizations | `name`, `city`, `established` |
| `Tag` | Emotional/descriptive tags | `name`, `category`, `weight` |
| `Venue` | Sports venues | `name`, `city`, `coordinates` |

## 🔗 Top 5 Relationship Patterns

### 1. **Event Similarity & Recommendations** 🎯
**Purpose**: "If you liked X, you'll love Y" recommendations

```cypher
// Find events similar to what user highly rated
MATCH (user:User)-[r:RATED]->(event:Event)-[:SIMILAR_TO]-(similar:Event)
WHERE r.rating >= 8.0 AND NOT EXISTS((user)-[:RATED]->(similar))
RETURN similar ORDER BY similar.averageRating DESC
```

**Use Cases**:
- Personalized event recommendations
- "More like this" suggestions
- Content discovery algorithms

### 2. **User Preference Networks** 👥
**Purpose**: Connect users with similar tastes for social discovery

```cypher
// Find users with similar rating patterns
MATCH (u1:User)-[r1:RATED]->(event:Event)<-[r2:RATED]-(u2:User)
WHERE ABS(r1.rating - r2.rating) <= 1.5
WITH u1, u2, COUNT(event) as sharedEvents
WHERE sharedEvents >= 5
MERGE (u1)-[:SIMILAR_TASTE]-(u2)
```

**Use Cases**:
- Friend recommendations
- Taste-based user matching
- Social proof in recommendations
- Community building

### 3. **Team/Player/League Hierarchies** 🏆
**Purpose**: Navigate organizational structures in sports

```cypher
// Find all teams in Eastern Conference
MATCH (eastern:Conference {name: "Eastern Conference"})-[:CONTAINS*1..3]->(team:Team)
RETURN team.name, team.city
```

**Use Cases**:
- Browse by team/league/division
- Follow organizational hierarchies
- Rivalry detection and modeling
- Historical team relationships

### 4. **Historical Event Chains** 📈
**Purpose**: Connect events that build upon each other (story arcs)

```cypher
// Find revenge/sequel storylines
MATCH path = (start:Event)-[:LEADS_TO*1..4]->(end:Event)
WHERE ANY(rel IN relationships(path) WHERE rel.type = "REVENGE_STORY")
RETURN [event IN nodes(path) | event.title] as storyArc
```

**Use Cases**:
- "Story arc" browsing (revenge games, comeback series)
- Historical context discovery
- Playoff/tournament progression tracking  
- Rivalry evolution over time

### 5. **Tag/Category Relationships** 🏷️
**Purpose**: Model how emotional descriptors relate and cluster

```cypher
// Find co-occurring emotional tags
MATCH (e:Event)-[:TAGGED_WITH]->(tag1:Tag), (e)-[:TAGGED_WITH]->(tag2:Tag)
WHERE tag1 <> tag2
WITH tag1, tag2, COUNT(e) as coOccurrence
MERGE (tag1)-[:CO_OCCURS_WITH]-(tag2)
```

**Use Cases**:
- Advanced filtering ("thrilling + comeback games")
- Emotional journey recommendations
- Tag suggestion algorithms
- Mood-based content discovery

## 🚀 Getting Started

### Prerequisites
- MongoDB 6.0+
- Neo4j 5.0+
- Node.js 18+ (for scripts)

### 1. MongoDB Setup
```bash
# Start MongoDB
mongod --dbpath /data/db

# Initialize database
mongosh --file DB/mongodb/init-mongo.js

# Verify setup
mongosh otw --eval "db.events.countDocuments()"
```

### 2. Neo4j Setup  
```bash
# Start Neo4j
neo4j start

# Initialize graph
cypher-shell -f DB/neo4j/init-neo4j.cypher

# Verify setup
cypher-shell "MATCH (n) RETURN labels(n), count(n)"
```

### 3. Test Relationship Queries
```bash
# Run sample queries
cypher-shell -f DB/neo4j/cypher-queries/relationship-patterns.cypher
```

## 📈 Sample Queries

### Find Personalized Recommendations
```cypher
MATCH (user:User {username: $username})-[r:RATED]->(event:Event)-[:SIMILAR_TO]-(rec:Event)
WHERE r.rating >= 8.0 AND NOT EXISTS((user)-[:RATED]->(rec))
RETURN rec.title, rec.sport, rec.averageRating
ORDER BY rec.averageRating DESC LIMIT 10
```

### Discover Event Story Arcs
```cypher
MATCH path = (start:Event)-[:LEADS_TO*1..3]->(end:Event)
WHERE start.sport = "Hockey"
RETURN [e IN nodes(path) | e.title] as storyline,
       LENGTH(path) as arcLength
ORDER BY arcLength DESC
```

### Find Taste Communities
```cypher
MATCH (user:User)-[:SIMILAR_TASTE]-(similar:User)
WHERE user.username = $username
WITH similar, 
     [(similar)-[:RATED]->(e:Event) WHERE e.averageRating >= 8.5 | e.title][0..3] as favorites
RETURN similar.displayName, favorites
```

## 🔧 Performance Optimization

### MongoDB Indexes
- **Events**: `sport + date`, `ratings.average`, `watchabilityScore`
- **Users**: `username` (unique), `reputation.score`
- **Reviews**: `eventId + userId` (unique), `rating`

### Neo4j Indexes
- **Events**: `averageRating`, `date`, `sport`
- **Users**: `reputationScore`, `username`
- **Relationships**: `RATED.rating`, `SIMILAR_TO.similarityScore`

## 🔄 Data Synchronization

The hybrid architecture requires synchronization between MongoDB and Neo4j:

1. **Events**: Full documents in MongoDB, lightweight nodes in Neo4j
2. **Users**: Profiles in MongoDB, relationship nodes in Neo4j  
3. **Sync Strategy**: Event-driven updates, periodic consistency checks

## 📝 Schema Evolution

### Adding New Relationships
1. Define in `relationship-patterns.cypher`
2. Update constraints if needed
3. Create migration script
4. Test with sample data

### Extending MongoDB Schemas
1. Update validation schema JSON
2. Plan backward compatibility
3. Update application models
4. Test with existing data

## 🛡️ Security Considerations

- **Authentication**: Both databases require proper auth setup
- **Data Privacy**: User data encryption and GDPR compliance
- **Access Control**: Role-based access for different user types
- **Audit Trails**: Track data modifications and access patterns

## 📊 Monitoring & Maintenance

### Key Metrics to Monitor
- Query performance (both DBs)
- Relationship graph growth
- Data synchronization lag  
- Storage usage patterns

### Regular Maintenance
- Index optimization based on query patterns
- Graph database cleanup (orphaned nodes)
- Data archival for old events
- Performance profiling and tuning

---

**Next Steps**: 
1. Set up development databases
2. Implement data synchronization layer
3. Build GraphQL resolvers using both databases
4. Create recommendation algorithms
5. Test with real sports data