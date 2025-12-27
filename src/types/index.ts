// User & Profile Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  fitness_assessment: QuestionnaireResponses;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  primary_goal: string;
  secondary_goals: string[];
  available_equipment: string[];
  custom_equipment?: string[];
  days_per_week: number;
  session_duration: number;
  rest_days: string[];
  restrictions?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireResponses {
  exerciseFrequency: number;
  pushups: string;
  squats: string;
  energyLevel: string;
  programExperience: string;
}

// Workout Plan Types
export interface WorkoutPlan {
  id: string;
  user_id: string;
  plan_name: string;
  profile_snapshot: UserProfile;
  plan_data: PlanData;
  duration_weeks: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface PlanData {
  plan_name: string;
  overview: string;
  weeks: Week[];
  progression_strategy: string;
  nutrition_tips: string[];
  general_notes: string;
}

export interface Week {
  week_number: number;
  focus: string;
  workouts: Workout[];
}

export interface Workout {
  day_number: number;
  day_name: string;
  workout_title: string;
  exercises: Exercise[];
  estimated_duration: number;
  warmup: string;
  cooldown: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_groups: string[];
  sets: number;
  reps: string;
  rest_seconds: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  form_tips: string;
  video_search_term: string;
}

// Workout Completion Types
export interface WorkoutCompletion {
  id: string;
  user_id: string;
  plan_id: string;
  week_number: number;
  day_number: number;
  workout_date: string;
  exercises_completed: ExerciseCompletion[];
  duration_minutes?: number;
  notes?: string;
  completed_at: string;
}

export interface ExerciseCompletion {
  exercise_id: string;
  sets: SetData[];
}

export interface SetData {
  set_number: number;
  weight: number;
  reps: number;
  completed: boolean;
}

// Body Measurements Types
export interface BodyMeasurement {
  id: string;
  user_id: string;
  weight?: number;
  body_fat_percentage?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  measurement_date: string;
  notes?: string;
  created_at: string;
}

// Progress & Stats Types
export interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
  totalVolumeLifted: number;
  averageDuration: number;
  completionRate: number;
}

export interface AIAnalysis {
  overall_assessment: string;
  strengths: string[];
  areas_for_improvement: string[];
  recommendations: Recommendation[];
  motivation_message: string;
  next_steps: string;
}

export interface Recommendation {
  category: 'training' | 'nutrition' | 'recovery';
  recommendation: string;
}
