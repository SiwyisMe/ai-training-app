import { useOnboarding } from "@/contexts/OnboardingContext";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { generateJSON } from "@/services/ai";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewScreen() {
  const router = useRouter();
  const { data, resetData } = useOnboarding();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // 1. Generate Plan via Gemini
      const prompt = `
        Create a 4-week workout plan for a user with:
        - Goal: ${data.primaryGoal}
        - Level: ${data.fitnessLevel}
        - Equipment: ${data.equipment.join(", ")}
        - Schedule: ${data.daysPerWeek} days/week, ${
        data.sessionDuration
      } mins/session.
        
        Return JSON format:
        {
          "plan_name": "string",
          "overview": "string",
          "weeks": [
             {
               "week_number": 1,
               "workouts": [
                 {
                   "day_number": 1,
                   "day_name": "Monday",
                   "workout_title": "string",
                   "exercises": [
                     {
                       "name": "string",
                       "sets": 3,
                       "reps": "10-12",
                       "reps": "10-12",
                       "rest_seconds": 60,
                       "instructions": "Brief 1-sentence explanation of how to perform the exercise.",
                       "can_use_weights": true
                     }
                   ]
                 }
               ]
             }
          ]
        }
      `;

      const planData = await generateJSON(prompt);

      // 2. Save to Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Save Profile first (if not exists or update it)
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert(
          {
            user_id: user.id,
            fitness_assessment: {}, // saved answers
            fitness_level: data.fitnessLevel,
            primary_goal: data.primaryGoal,
            secondary_goals: data.secondaryGoals,
            available_equipment: data.equipment,
            days_per_week: data.daysPerWeek,
            session_duration: data.sessionDuration,
            rest_days: data.restDays,
          },
          { onConflict: "user_id" }
        );

      if (profileError) throw profileError;

      // Handle Regeneration: Archive old plan if regenerating
      if (data.isRegenerating) {
        await supabase
          .from("workout_plans")
          .update({ status: "archived" })
          .eq("user_id", user.id)
          .eq("status", "active");
      }

      // Save Plan
      const { error: planError } = await supabase.from("workout_plans").insert({
        user_id: user.id,
        plan_name: planData.plan_name,
        profile_snapshot: data,
        plan_data: planData,
        status: "active",
      });

      if (planError) throw planError;

      showToast.success("Plan generated!");
      resetData(); // Reset context
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error(error);
      showToast.error("Failed to generate plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text className="text-xl font-bold mt-4 text-center text-gray-900 dark:text-white">
          Creating Your Perfect Plan...
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
          Analyzing your goals and equipment.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="px-6 flex-1 justify-between">
          <View>
            <Text className="text-sm font-bold text-primary-500 uppercase tracking-wider mb-2">
              Final Step
            </Text>
            <Text className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              Ready to Start?
            </Text>

            <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl">
              <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Summary
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 mb-2">
                • Goal:{" "}
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {data.primaryGoal}
                </Text>
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 mb-2">
                • Frequency:{" "}
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {data.daysPerWeek} days/week
                </Text>
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 mb-2">
                • Duration:{" "}
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {data.sessionDuration} mins
                </Text>
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                • Equipment:{" "}
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {data.equipment.length} items
                </Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary-600 py-4 rounded-xl shadow-lg items-center mt-6"
            onPress={handleGenerate}
          >
            <Text className="text-white font-bold text-lg">
              Generate My Plan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
