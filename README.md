# AI Training Plan 🏋️‍♂️

An intelligent fitness application built with React Native and Expo that generates personalized workout plans using Google's Gemini AI.

## Features

- 🎯 **AI-Powered Workout Plans** - Personalized training programs generated using Google's Gemini AI based on your fitness level, goals, and available equipment
- 📊 **Progress Tracking** - Monitor your fitness journey with body measurements and workout history
- 💪 **Workout Logging** - Track sets, reps, and weights for each exercise
- 👤 **User Profiles** - Personalized profiles with authentication via Supabase
- 📝 **AI Plan Editor** - Modify and regenerate workout plans using natural language prompts
- 📱 **Cross-Platform** - Works on iOS, Android, and Web

## Tech Stack

### Frontend

- **React Native** (0.81.5) with **Expo** (~54.0.30)
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **NativeWind** for styling (Tailwind CSS for React Native)
- **React Hook Form** + **Zod** for form validation
- **TanStack React Query** for data fetching and caching
- **Lucide React Native** for icons

### Backend & Services

- **Supabase** - Authentication and PostgreSQL database
- **Google Generative AI** (Gemini) - AI-powered workout plan generation
- **AsyncStorage** - Local data persistence
- **NetInfo** - Network status monitoring

### UI Components

- **React Native Gifted Charts** - Data visualization
- **React Native Toast Message** - User notifications
- **React Native Reanimated** - Smooth animations

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Supabase account
- Google Gemini API key (for AI workout plan generation)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-training-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database**

   Run the SQL script in your Supabase SQL Editor:

   - [`supabase_setup.sql`] - Creates body measurements table with RLS policies

   > **Note:** The `supabase_videos.sql` file is for a future feature and is not currently required.

## Running the App

### Development Mode

```bash
# Start the Expo development server
npx expo start
```

## Project Structure

```
ai-training-app/
├── app/                    # Expo Router pages and navigation
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation screens
│   ├── (onboarding)/      # Onboarding flow
│   ├── exercises/         # Exercise-related screens
│   ├── plan/              # Workout plan screens
│   ├── profile/           # User profile screens
│   └── progress/          # Progress tracking screens
├── src/
│   ├── components/        # Reusable React components
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Library configurations
│   ├── navigation/        # Navigation utilities
│   ├── screens/           # Screen components
│   ├── services/          # API and service integrations
│   │   └── ai.ts         # Gemini AI integration for workout generation
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                # Static assets (images, fonts)
├── constants/             # App constants
└── public/                # Public web assets
```

## Key Features Explained

### AI-Powered Workout Generation

The app uses Google's **Gemini AI** (gemini-3-flash-preview model) to generate personalized workout plans. The generation process:

- Analyzes user fitness level through a comprehensive questionnaire (exercise frequency, current abilities, energy levels)
- Considers user goals (weight loss, muscle gain, endurance, general fitness)
- Adapts to available equipment and time constraints
- Creates structured weekly workout plans with progressive overload
- Provides detailed form tips and exercise instructions
- Allows natural language editing of generated plans through AI prompts

### Database Schema

#### `body_measurements`

- Tracks user weight, body fat percentage, and body measurements over time
- Row-level security ensures users only access their own data
- Supports progress visualization with charts

#### `user_profiles`

- Stores user profile information including full name
- Contains fitness assessment results and preferences
- Tracks goals, equipment availability, and workout schedule
- Linked to Supabase Auth users with RLS policies

#### `workout_plans`

- Stores AI-generated workout plans
- Includes profile snapshot to track user state at plan creation
- Supports multiple plans per user with active/archived status

#### `workout_completions`

- Tracks completed workouts with detailed exercise data
- Records sets, reps, and weights for each exercise
- Enables progress tracking and workout history

### Authentication Flow

1. Welcome screen
2. Registration/Login
3. Onboarding (Goal setting, metrics, experience level)
4. Main app with tab navigation

## Configuration Files

- [`app.json`] - Expo configuration
- [`package.json`] - Dependencies and scripts
- [`tsconfig.json`] - TypeScript configuration
- [`tailwind.config.js`] - Tailwind CSS configuration
- [`babel.config.js`] - Babel configuration
- [`metro.config.js`] - Metro bundler configuration

## Development Notes

### AI Service Integration

- **Service Layer**: AI functionality is centralized in `src/services/ai.ts`
- **Models Used**: Gemini 3 Flash Preview for fast, efficient workout plan generation
- **JSON Parsing**: Robust JSON extraction from AI responses with error handling
- **Prompt Engineering**: Structured prompts ensure consistent, valid workout plan format

### Data Management

- **React Query**: Used for server state management and caching
- **Offline Support**: AsyncStorage for local data persistence
- **Network Monitoring**: NetInfo integration for offline-first capabilities
- **Form Validation**: Zod schemas ensure data integrity

## Troubleshooting

### Common Issues

1. **Module not found errors**

   - Clear cache: `expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

2. **Supabase connection issues**

   - Verify environment variables in `.env`
   - Check Supabase project status

3. **AI plan generation failures**
   - Verify Gemini API key in environment variables
   - Check Google AI API quotas and limits
   - Review console logs for JSON parsing errors
   - Ensure network connectivity

## License

This project is private and proprietary.
