import { supabase } from "@/lib/supabase";
import { WorkoutDay, WorkoutPlan, WorkoutWeek } from "@/types/database";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanOverviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completions, setCompletions] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      fetchPlan();
    }, [params.id])
  );

  const fetchPlan = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", user.id);

      if (params.id) {
        query = query.eq("id", params.id);
      } else {
        query = query.eq("status", "active");
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw error;

      if (data) {
        setPlan(data);

        // Fetch completions for this plan
        const { data: completionData } = await supabase
          .from("workout_completions")
          .select("week_number, day_number")
          .eq("plan_id", data.id);

        const completedSet = new Set<string>();
        let maxCompletedWeek = 1;

        if (completionData) {
          completionData.forEach((c: any) => {
            completedSet.add(`${c.week_number}-${c.day_number}`);
            if (c.week_number > maxCompletedWeek) {
              maxCompletedWeek = c.week_number;
            }
          });
        }
        setCompletions(completedSet);

        // Auto-navigate to latest relevant week
        setCurrentWeek(maxCompletedWeek);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#FF3B30" />
      </View>
    );
  }

  if (!plan) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <View className="items-center px-6">
          <Text className="text-gray-900 dark:text-white font-bold text-lg mb-2">
            No Active Plan Found
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">
            You don't have a current workout plan.
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.push("/plan/history")}
              className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-xl"
            >
              <Text className="text-gray-900 dark:text-white font-bold">
                View History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/onboarding")}
              className="bg-primary-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold">Create Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft
              size={24}
              className="text-gray-900 dark:text-white"
              color={undefined}
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            {params.id ? "Plan Details" : "Your Plan"}
          </Text>
        </View>
        <View className="flex-row gap-2">
          {!params.id && (
            <TouchableOpacity
              className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
              onPress={() => router.push("/plan/history")}
            >
              <Clock size={20} className="text-gray-900 dark:text-white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="bg-primary-50 dark:bg-primary-900/40 p-2 rounded-full"
            onPress={() => router.push("/plan/ai-editor")}
          >
            <Edit3 size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 py-4" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          <View className="mb-6">
            <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              {plan.plan_name}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 leading-5">
              {plan.plan_data.overview ||
                "Your personalized training schedule."}
            </Text>
          </View>

          {/* Week Pagination */}
          <View className="flex-row items-center justify-between mb-6 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
            <TouchableOpacity
              className={`p-2 rounded-lg ${
                currentWeek > 1 ? "bg-gray-100 dark:bg-gray-700" : "opacity-30"
              }`}
              disabled={currentWeek <= 1}
              onPress={() => setCurrentWeek((prev) => prev - 1)}
            >
              <ChevronLeft
                size={20}
                className="text-gray-900 dark:text-white"
              />
            </TouchableOpacity>

            <Text className="font-bold text-lg text-gray-900 dark:text-white">
              Week {currentWeek}
            </Text>

            <TouchableOpacity
              className={`p-2 rounded-lg ${
                currentWeek < plan.plan_data.weeks.length
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "opacity-30"
              }`}
              disabled={currentWeek >= plan.plan_data.weeks.length}
              onPress={() => setCurrentWeek((prev) => prev + 1)}
            >
              <ChevronRight
                size={20}
                className="text-gray-900 dark:text-white"
              />
            </TouchableOpacity>
          </View>

          {plan.plan_data.weeks
            .filter((w: WorkoutWeek) => w.week_number === currentWeek)
            .map((week: WorkoutWeek) => (
              <View key={week.week_number} className="mb-8">
                <View className="space-y-3">
                  {week.workouts.map((day: WorkoutDay) => {
                    const isCompleted = completions.has(
                      `${week.week_number}-${day.day_number}`
                    );
                    return (
                      <View
                        key={day.day_number}
                        className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border flex-row items-center ${
                          isCompleted
                            ? "border-green-500/30 bg-green-50/10"
                            : "border-gray-100 dark:border-gray-700"
                        }`}
                      >
                        <TouchableOpacity
                          className="flex-1 flex-row items-center"
                          onPress={() =>
                            router.push({
                              pathname: "/(tabs)/workout",
                              params: {
                                week: week.week_number,
                                day: day.day_number,
                              },
                            })
                          }
                        >
                          <View
                            className={`w-10 h-10 rounded-lg items-center justify-center mr-4 ${
                              isCompleted
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-primary-100 dark:bg-gray-700"
                            }`}
                          >
                            {isCompleted ? (
                              <Check
                                size={20}
                                className="text-green-600 dark:text-green-400"
                              />
                            ) : (
                              <Text className="text-primary-700 dark:text-primary-400 font-bold">
                                {day.day_number}
                              </Text>
                            )}
                          </View>
                          <View className="flex-1">
                            <Text
                              className={`font-bold ${
                                isCompleted
                                  ? "text-green-700 dark:text-green-400 line-through"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {day.workout_title}
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">
                              {day.exercises.length} Exercises
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* Edit Button */}
                        <TouchableOpacity
                          className="p-3 ml-2"
                          onPress={() =>
                            router.push({
                              pathname: "/plan/edit-workout",
                              params: {
                                dayId: `${week.week_number}-${day.day_number}`,
                              },
                            })
                          }
                        >
                          <Edit3
                            size={18}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          <View className="h-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
