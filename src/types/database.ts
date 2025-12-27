export type Profile = {
  id: string;
  user_id: string;
  fitness_level: string;
  primary_goal: string;
  days_per_week: number;
  // ... add other fields as needed
};

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest_seconds?: number;
  instructions?: string;
  can_use_weights?: boolean;
};

export type WorkoutDay = {
  day_number: number;
  day_name: string;
  workout_title: string;
  exercises: Exercise[];
};

export type WorkoutWeek = {
  week_number: number;
  workouts: WorkoutDay[];
};

export type PlanData = {
  plan_name: string;
  overview: string;
  weeks: WorkoutWeek[];
};

export type WorkoutPlan = {
  id: string;
  user_id: string;
  plan_name: string;
  plan_data: PlanData;
  status: "active" | "archived";
  created_at: string;
};

export type CompletedExercise = {
  name: string;
  sets: {
    reps: number;
    weight: number;
  }[];
};

export type WorkoutCompletion = {
  id: string;
  user_id: string;
  plan_id: string;
  week_number: number;
  day_number: number;
  workout_date: string;
  exercises_completed: CompletedExercise[];
  duration_minutes: number;
  created_at: string;
};

export type BodyMeasurement = {
  id: string;
  user_id: string;
  measurement_date: string;
  weight: number;
  body_fat_percentage: number | null;
  created_at: string;
};
