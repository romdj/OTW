# 📱 OTW.sport Mobile App

The cross-platform mobile application for **otw.sport** - "The IMDb of Sporting Events". Built with Flutter to deliver a native experience for discovering, rating, and sharing unmissable sporting moments on iOS and Android.

## 🎯 Purpose

The otw.sport mobile app provides on-the-go access to the world's most engaging sporting events:

- **Personalized Notifications**: Get alerts for highly-rated events in your favorite sports
- **Offline Event Discovery**: Browse cached event details and ratings without internet
- **Quick Rating System**: Rate events immediately after watching with simple gestures
- **Social Sharing**: Share must-watch moments with friends and social networks
- **Biometric Security**: Secure login with fingerprint/face recognition

## 🏗️ Architecture

### Technology Stack
- **Framework**: Flutter 3.x with Dart
- **State Management**: Provider pattern with ChangeNotifier
- **Local Storage**: SQLite with sqflite for offline caching
- **Network**: GraphQL integration with ferry/graphql_flutter
- **Authentication**: Firebase Auth with biometric support
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics for user behavior tracking

### App Structure
```
lib/
├── core/                    # Core functionality and configuration
│   ├── constants/          # App constants and themes
│   ├── network/           # GraphQL client and API integration
│   └── utils/             # Helper functions and utilities
├── data/                   # Data layer
│   ├── models/            # Data models and entities
│   ├── repositories/      # Data repositories
│   └── services/          # External services (GraphQL, Firebase)
├── presentation/           # UI layer
│   ├── pages/            # App screens and navigation
│   ├── widgets/          # Reusable UI components
│   └── providers/        # State management providers
└── main.dart              # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Flutter SDK 3.16+
- Dart SDK 3.2+
- iOS 12+ / Android API Level 21+
- Xcode 15+ (for iOS development)
- Android Studio with Android SDK

### Installation
```bash
# Install dependencies
flutter pub get

# Generate code (if using code generation)
flutter packages pub run build_runner build

# Run on iOS simulator
flutter run -d ios

# Run on Android emulator
flutter run -d android

# Run on connected device
flutter run
```

### Available Commands
```bash
flutter run              # Run in development mode
flutter build apk        # Build Android APK
flutter build ios        # Build iOS app
flutter test             # Run unit tests
flutter analyze          # Static code analysis
flutter pub get          # Install dependencies
```

## 📱 Key Features

### Multi-Sport Event Discovery
- Browse events across all supported sports
- Filter by sport, date, rating, and emotional tags
- Personalized recommendations based on viewing history
- Search functionality with intelligent suggestions

### Smart Notifications
- Push notifications for highly-rated ongoing events
- Customizable notification preferences by sport
- Real-time alerts for events you're following
- Weekly digest of must-watch upcoming events

### Offline Capabilities
- Cache event details for offline viewing
- Download event ratings and reviews for offline access
- Sync data when connection is restored
- Background sync for seamless user experience

### Social Features
- Share events with friends via native sharing
- Create and share curated event lists
- Follow other users' recommendations
- Social media integration (Twitter, Instagram, etc.)

### User Experience
- Intuitive swipe gestures for rating events
- Dark/light theme support matching system preferences
- Biometric authentication for quick access
- Native iOS and Android design patterns

## 🔧 Development

### State Management
The app uses Provider pattern for state management:

```dart
// Example provider
class EventsProvider extends ChangeNotifier {
  List<Event> _events = [];
  bool _isLoading = false;
  
  List<Event> get events => _events;
  bool get isLoading => _isLoading;
  
  Future<void> fetchEvents() async {
    _isLoading = true;
    notifyListeners();
    
    // Fetch events from GraphQL API
    _events = await _eventRepository.getEvents();
    _isLoading = false;
    notifyListeners();
  }
}
```

### GraphQL Integration
Uses ferry for GraphQL operations with offline support:

```dart
// Example GraphQL query
String getEventsQuery = '''
  query GetEvents(\$sport: String!, \$limit: Int) {
    events(sport: \$sport, limit: \$limit) {
      id
      title
      sport
      date
      rating
      emotionalTags
      participants {
        name
        type
      }
    }
  }
''';
```

### Local Data Persistence
SQLite database for offline event caching:

```dart
// Event model with database mapping
class Event {
  final String id;
  final String title;
  final String sport;
  final DateTime date;
  final double rating;
  
  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'sport': sport,
    'date': date.toIso8601String(),
    'rating': rating,
  };
}
```

## 🧪 Testing

### Test Structure
```bash
test/
├── unit/              # Unit tests for business logic
├── widget/            # Widget tests for UI components  
├── integration/       # Integration tests for full flows
└── mocks/            # Mock objects and test data
```

### Running Tests
```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/unit/events_provider_test.dart

# Run tests with coverage
flutter test --coverage
```

## 🌐 Integration with Platform

### GraphQL API Connection
- Real-time synchronization with otw.sport web platform
- Shared user accounts and preferences
- Cross-platform event ratings and reviews
- Consistent data models with web frontend

### Backend Services
- **Firebase Auth**: User authentication and profile management
- **Firebase FCM**: Push notifications for event alerts
- **Firebase Analytics**: User behavior tracking and app performance
- **Firebase Crashlytics**: Crash reporting and error tracking

### Database Synchronization
- **Online Mode**: Direct GraphQL queries to MongoDB/Neo4j backend
- **Offline Mode**: Local SQLite cache with background sync
- **Conflict Resolution**: Smart merging of offline changes

## 📦 Build & Deployment

### Environment Configuration
```bash
# Development
flutter run --flavor development

# Staging  
flutter run --flavor staging

# Production
flutter run --flavor production
```

### Release Builds
```bash
# Android release
flutter build apk --release
flutter build appbundle --release

# iOS release
flutter build ios --release
```

### App Store Distribution
- **iOS**: Distributed via Apple App Store
- **Android**: Distributed via Google Play Store
- **CI/CD**: Automated builds with GitHub Actions
- **Code Signing**: Managed through platform-specific tools

## 🔒 Security & Privacy

### Data Protection
- User data encrypted both in transit and at rest
- Biometric authentication for sensitive actions
- No sensitive data stored in device logs
- GDPR compliant data handling

### API Security
- JWT tokens for API authentication
- Certificate pinning for secure connections
- Request/response encryption
- Rate limiting protection

## 🎨 Design System

### Flutter Theme Implementation
- Material Design 3 for Android
- Cupertino design for iOS
- Dark/light theme support
- Consistent color palette with web platform
- Accessibility compliance (WCAG 2.1)

### Custom Components
- Event cards with rating displays
- Sport-specific iconography
- Emotional tag visualizations
- Loading states and error handling

## 🚀 Future Enhancements

### Planned Features
- **Apple Watch/Wear OS**: Companion apps for quick event checking
- **Siri/Google Assistant**: Voice integration for event discovery
- **AR Features**: Augmented reality stadium information
- **Live Streaming**: Direct integration with sports streaming services
- **Social Features**: Enhanced community interaction and friend systems

## 📱 Platform-Specific Features

### iOS
- Native iOS design patterns
- Shortcuts app integration
- Apple Watch compatibility
- Siri voice commands
- iOS widgets for home screen

### Android
- Material You theming
- Android widgets
- Wear OS companion app
- Google Assistant integration
- Android Auto support

## 🤝 Contributing

1. Follow Flutter development best practices
2. Maintain platform-specific design guidelines  
3. Add tests for new features
4. Use conventional commit messages
5. Ensure accessibility compliance
6. Test on both iOS and Android

## 📚 Additional Resources

- [Flutter Documentation](https://docs.flutter.dev/)
- [Material Design Guidelines](https://material.io/design)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [GraphQL Flutter Integration](https://pub.dev/packages/graphql_flutter)

---

**Part of the otw.sport ecosystem** - Building "The IMDb of Sporting Events" on mobile 📱🏆
