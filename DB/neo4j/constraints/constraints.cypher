// Node constraints and indexes for otw.sport graph database

// === USER CONSTRAINTS ===
CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT user_username_unique IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE;
CREATE CONSTRAINT user_email_unique IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE;

// === EVENT CONSTRAINTS ===
CREATE CONSTRAINT event_id_unique IF NOT EXISTS FOR (e:Event) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT event_slug_unique IF NOT EXISTS FOR (e:Event) REQUIRE e.slug IS UNIQUE;

// === TEAM/ORGANIZATION CONSTRAINTS ===
CREATE CONSTRAINT team_id_unique IF NOT EXISTS FOR (t:Team) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT league_id_unique IF NOT EXISTS FOR (l:League) REQUIRE l.id IS UNIQUE;
CREATE CONSTRAINT player_id_unique IF NOT EXISTS FOR (p:Player) REQUIRE p.id IS UNIQUE;

// === SPORT/CATEGORY CONSTRAINTS ===
CREATE CONSTRAINT sport_name_unique IF NOT EXISTS FOR (s:Sport) REQUIRE s.name IS UNIQUE;
CREATE CONSTRAINT tag_name_unique IF NOT EXISTS FOR (tag:Tag) REQUIRE tag.name IS UNIQUE;

// === LIST CONSTRAINTS ===
CREATE CONSTRAINT list_id_unique IF NOT EXISTS FOR (l:List) REQUIRE l.id IS UNIQUE;

// === VENUE CONSTRAINTS ===
CREATE CONSTRAINT venue_id_unique IF NOT EXISTS FOR (v:Venue) REQUIRE v.id IS UNIQUE;

// === PERFORMANCE INDEXES ===
// User activity and preferences
CREATE INDEX user_reputation_idx IF NOT EXISTS FOR (u:User) ON (u.reputationScore);
CREATE INDEX user_created_idx IF NOT EXISTS FOR (u:User) ON (u.createdAt);

// Event discovery and filtering
CREATE INDEX event_date_idx IF NOT EXISTS FOR (e:Event) ON (e.date);
CREATE INDEX event_rating_idx IF NOT EXISTS FOR (e:Event) ON (e.averageRating);
CREATE INDEX event_watchability_idx IF NOT EXISTS FOR (e:Event) ON (e.watchabilityScore);
CREATE INDEX event_sport_idx IF NOT EXISTS FOR (e:Event) ON (e.sport);

// Tag-based discovery
CREATE INDEX tag_category_idx IF NOT EXISTS FOR (tag:Tag) ON (tag.category);
CREATE INDEX tag_weight_idx IF NOT EXISTS FOR (tag:Tag) ON (tag.weight);

// Team and player lookups
CREATE INDEX team_name_idx IF NOT EXISTS FOR (t:Team) ON (t.name);
CREATE INDEX player_name_idx IF NOT EXISTS FOR (p:Player) ON (p.name);

// Geographic and venue searches
CREATE INDEX venue_location_idx IF NOT EXISTS FOR (v:Venue) ON (v.coordinates);
CREATE INDEX venue_city_idx IF NOT EXISTS FOR (v:Venue) ON (v.city);

// Relationship performance indexes
CREATE INDEX rated_rating_idx IF NOT EXISTS FOR ()-[r:RATED]-() ON (r.rating);
CREATE INDEX rated_date_idx IF NOT EXISTS FOR ()-[r:RATED]-() ON (r.ratedAt);
CREATE INDEX follows_date_idx IF NOT EXISTS FOR ()-[r:FOLLOWS]-() ON (r.followedAt);
CREATE INDEX similarity_score_idx IF NOT EXISTS FOR ()-[r:SIMILAR_TO]-() ON (r.similarityScore);