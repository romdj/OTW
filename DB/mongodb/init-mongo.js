// MongoDB initialization script for otw.sport
// Run with: mongosh --file init-mongo.js

// Switch to otw database
use('otw');

print('🏒 Initializing otw.sport MongoDB database...');

// Create collections with validation schemas
print('📄 Creating collections with validation schemas...');

// Events collection
db.createCollection('events', {
  validator: JSON.parse(fs.readFileSync('schemas/events.json'))
});

// Users collection  
db.createCollection('users', {
  validator: JSON.parse(fs.readFileSync('schemas/users.json'))
});

// Reviews collection
db.createCollection('reviews', {
  validator: JSON.parse(fs.readFileSync('schemas/reviews.json'))
});

// Lists collection
db.createCollection('lists', {
  validator: JSON.parse(fs.readFileSync('schemas/lists.json'))
});

print('📊 Creating indexes for optimal performance...');

// Events indexes
db.events.createIndex({ "sport": 1, "date": -1 });
db.events.createIndex({ "date": -1 });
db.events.createIndex({ "ratings.average": -1 });
db.events.createIndex({ "watchabilityScore": -1 });
db.events.createIndex({ "tags.name": 1 });
db.events.createIndex({ "participants.name": 1 });
db.events.createIndex({ "createdAt": -1 });
db.events.createIndex({ "status": 1 });
db.events.createIndex({ "significance.historical": 1 });

// Users indexes
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": -1 });
db.users.createIndex({ "reputation.score": -1 });
db.users.createIndex({ "preferences.favoriteSports": 1 });
db.users.createIndex({ "lastActiveAt": -1 });

// Reviews indexes
db.reviews.createIndex({ "eventId": 1, "userId": 1 }, { unique: true });
db.reviews.createIndex({ "eventId": 1, "rating": -1 });
db.reviews.createIndex({ "userId": 1, "createdAt": -1 });
db.reviews.createIndex({ "rating": -1 });
db.reviews.createIndex({ "tags": 1 });
db.reviews.createIndex({ "createdAt": -1 });
db.reviews.createIndex({ "wouldRecommend": 1 });

// Lists indexes
db.lists.createIndex({ "creatorId": 1, "createdAt": -1 });
db.lists.createIndex({ "category": 1, "isPublic": 1 });
db.lists.createIndex({ "sport": 1, "isPublic": 1 });
db.lists.createIndex({ "tags": 1 });
db.lists.createIndex({ "stats.likeCount": -1 });
db.lists.createIndex({ "featured.isFeatured": 1, "featured.featuredAt": -1 });
db.lists.createIndex({ "isPublic": 1, "updatedAt": -1 });

print('🌱 Loading seed data...');

// Insert sample events
const sampleEvents = [
  {
    title: "Miracle on Ice - USA vs USSR",
    sport: "hockey", 
    date: new Date("1980-02-22T20:00:00Z"),
    participants: [
      { name: "United States", type: "team", logo: "usa_hockey.png" },
      { name: "Soviet Union", type: "team", logo: "ussr_hockey.png" }
    ],
    venue: {
      name: "Olympic Center",
      city: "Lake Placid", 
      country: "USA"
    },
    status: "completed",
    result: {
      winner: "United States",
      score: { USA: 4, USSR: 3 },
      summary: "Stunning upset victory in Olympic semifinal"
    },
    ratings: {
      average: 9.8,
      count: 1247,
      distribution: { "10": 856, "9": 289, "8": 89, "7": 13 }
    },
    tags: [
      { name: "historic-moment", category: "significance", count: 1200, weight: 0.95 },
      { name: "underdog-victory", category: "outcome", count: 1150, weight: 0.92 },
      { name: "emotional", category: "emotion", count: 980, weight: 0.85 }
    ],
    significance: {
      historical: true,
      recordBreaking: false,
      upsetVictory: true,
      rivalryGame: true,
      playoffImportance: "finals"
    },
    reviewCount: 1247,
    watchabilityScore: 98.5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "2013 Game 7 - Bruins Complete Epic Comeback vs Leafs",
    sport: "hockey",
    date: new Date("2013-05-13T19:00:00Z"), 
    participants: [
      { name: "Boston Bruins", type: "team", logo: "bruins.png" },
      { name: "Toronto Maple Leafs", type: "team", logo: "leafs.png" }
    ],
    venue: {
      name: "TD Garden",
      city: "Boston",
      country: "USA"
    },
    status: "completed",
    result: {
      winner: "Boston Bruins", 
      score: { BOS: 5, TOR: 4 },
      summary: "Bruins overcome 4-1 deficit in final 10 minutes, win in OT"
    },
    ratings: {
      average: 9.5,
      count: 892,
      distribution: { "10": 534, "9": 267, "8": 78, "7": 13 }
    },
    tags: [
      { name: "comeback", category: "outcome", count: 850, weight: 0.95 },
      { name: "nail-biter", category: "emotion", count: 780, weight: 0.92 },
      { name: "explosive-finish", category: "outcome", count: 720, weight: 0.88 }
    ],
    significance: {
      historical: true,
      recordBreaking: false, 
      upsetVictory: false,
      rivalryGame: true,
      playoffImportance: "playoffs"
    },
    reviewCount: 892,
    watchabilityScore: 96.8,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.events.insertMany(sampleEvents);

// Insert sample users
const sampleUsers = [
  {
    username: "hockey_historian",
    email: "historian@example.com",
    displayName: "Hockey Historian",
    bio: "Documenting the greatest moments in hockey history",
    preferences: {
      favoriteSports: ["hockey", "basketball"],
      favoriteTeams: [
        { sport: "hockey", team: "Boston Bruins", league: "NHL" }
      ],
      watchingPreferences: {
        preferredTags: ["historic-moment", "comeback", "rivalry"],
        ratingThreshold: 8.0
      }
    },
    stats: {
      reviewsCount: 47,
      listsCount: 8, 
      followersCount: 1250,
      followingCount: 89,
      averageRating: 8.7,
      totalEventsRated: 47
    },
    reputation: {
      score: 2150,
      level: "expert",
      badges: [
        { name: "First Review", earnedAt: new Date("2023-01-15"), category: "milestone" },
        { name: "Hockey Expert", earnedAt: new Date("2023-06-01"), category: "expertise" }
      ]
    },
    createdAt: new Date("2023-01-15T10:00:00Z"),
    lastActiveAt: new Date(),
    status: "active"
  }
];

db.users.insertMany(sampleUsers);

print('✅ MongoDB initialization complete!');
print('📊 Collections created: events, users, reviews, lists');
print('🔍 Indexes created for optimal performance');
print('🌱 Sample data loaded');
print('');
print('Next steps:');
print('1. Configure your application connection string');
print('2. Set up authentication if needed');  
print('3. Review and adjust validation schemas as needed');
print('4. Monitor performance and add indexes as usage patterns emerge');