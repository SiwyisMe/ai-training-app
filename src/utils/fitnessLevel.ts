export type FitnessLevel = "beginner" | "intermediate" | "advanced";

interface Assessment {
  exerciseFrequency: number; // 0-7
  pushups: "no" | "difficulty" | "easily";
  squats: "no" | "difficulty" | "easily";
  energyLevel: "low" | "moderate" | "high";
  programExperience: "never" | "tried" | "completed";
}

export const calculateFitnessLevel = (assessment: Assessment): FitnessLevel => {
  let score = 0;

  // Frequency (0-3 points)
  if (assessment.exerciseFrequency >= 5) score += 3;
  else if (assessment.exerciseFrequency >= 3) score += 2;
  else if (assessment.exerciseFrequency >= 1) score += 1;

  // Pushups (0-2 points)
  if (assessment.pushups === "easily") score += 2;
  else if (assessment.pushups === "difficulty") score += 1;

  // Squats (0-2 points)
  if (assessment.squats === "easily") score += 2;
  else if (assessment.squats === "difficulty") score += 1;

  // Energy (0-2 points)
  if (assessment.energyLevel === "high") score += 2;
  else if (assessment.energyLevel === "moderate") score += 1;

  // Experience (0-2 points)
  if (assessment.programExperience === "completed") score += 2;
  else if (assessment.programExperience === "tried") score += 1;

  // Total max score: 11
  // Beginner: 0-4
  // Intermediate: 5-8
  // Advanced: 9+

  if (score >= 9) return "advanced";
  if (score >= 5) return "intermediate";
  return "beginner";
};
