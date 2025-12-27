import { supabase } from "@/lib/supabase";
import { WorkoutCompletion } from "@/types/database";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { Calendar, ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<WorkoutCompletion[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("workout_completions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (data) setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator color="#FF3B30" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft
            size={24}
            className="text-gray-900 dark:text-white"
            color={undefined}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Workout History
        </Text>
      </View>

      <ScrollView className="flex-1 py-4" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          {history.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-400">No workouts completed yet.</Text>
            </View>
          ) : (
            history.map((workout) => {
              // Calculate volume for summary
              const volume = workout.exercises_completed.reduce((acc, ex) => {
                return (
                  acc +
                  ex.sets.reduce(
                    (sAcc, s) => sAcc + (s.reps || 0) * (s.weight || 0),
                    0
                  )
                );
              }, 0);

              return (
                <View
                  key={workout.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">
                      {format(new Date(workout.workout_date), "MMM dd, yyyy")}
                    </Text>
                    <View className="flex-row items-center">
                      <Calendar size={12} color="#9CA3AF" />
                      <Text className="text-gray-400 text-xs ml-1">
                        Week {workout.week_number}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Day {workout.day_number} Workout
                  </Text>

                  <View className="flex-row gap-4">
                    <View className="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-md">
                      <Text className="text-gray-500 dark:text-gray-300 text-xs">
                        Volume
                      </Text>
                      <Text className="font-bold text-gray-900 dark:text-white">
                        {volume} kg
                      </Text>
                    </View>
                    <View className="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-md">
                      <Text className="text-gray-500 dark:text-gray-300 text-xs">
                        Exercises
                      </Text>
                      <Text className="font-bold text-gray-900 dark:text-white">
                        {workout.exercises_completed.length}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
          <View className="h-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
