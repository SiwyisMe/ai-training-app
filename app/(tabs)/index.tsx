import { supabase } from "@/lib/supabase";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data helpers
const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    totalVolume: 0,
  });

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Merge user name with profile data
      setProfile(profileData);

      const { data: planData } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      setActivePlan(planData);

      // Fetch Stats
      const { data: completions } = await supabase
        .from("workout_completions")
        .select("*")
        .eq("user_id", user.id);

      if (completions) {
        let volume = 0;
        completions.forEach((c: any) => {
          c.exercises_completed.forEach((ex: any) => {
            ex.sets.forEach((set: any) => {
              volume += (set.reps || 0) * (set.weight || 0);
            });
          });
        });
        setStats({
          workoutsCompleted: completions.length,
          totalVolume: volume,
        });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
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

  // If no plan, redirect or show empty state (simple check)
  if (!activePlan) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-6">
        <Text className="text-xl font-bold mb-4">No Active Plan</Text>
        <TouchableOpacity
          className="bg-primary-600 px-6 py-3 rounded-xl"
          onPress={() => router.push("/onboarding")}
        >
          <Text className="text-white font-bold">Create Plan</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 pt-[4pt]">
      <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-gray-500 dark:text-gray-400">
                Welcome back,
              </Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile?.full_name || "Friend"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              className="w-12 h-12 bg-primary-600 rounded-full items-center justify-center"
            >
              <Text className="text-white font-bold text-lg">
                {profile?.full_name?.[0]?.toUpperCase() || "U"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Calendar */}
          <TouchableOpacity
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-6 active:opacity-90 border border-gray-100 dark:border-gray-700"
            onPress={() => router.push("/plan/overview")}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-gray-900 dark:text-white">
                This Week
              </Text>
              <Text className="text-primary-600 text-sm font-medium">
                View Full Plan
              </Text>
            </View>
            <View className="flex-row justify-between">
              {(() => {
                // Get current date and start of week (Monday)
                const today = new Date();
                const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ...
                const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
                const monday = new Date(today);
                monday.setDate(today.getDate() + mondayOffset);

                return WEEK_DAYS.map((day, index) => {
                  const date = new Date(monday);
                  date.setDate(monday.getDate() + index);
                  const isToday = date.toDateString() === today.toDateString();

                  return (
                    <View key={index} className="items-center">
                      <Text className="text-xs text-gray-400 mb-2">{day}</Text>
                      <View
                        className={`w-8 h-8 rounded-full items-center justify-center ${
                          isToday
                            ? "bg-primary-600"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            isToday
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {date.getDate()}
                        </Text>
                      </View>
                    </View>
                  );
                });
              })()}
            </View>
          </TouchableOpacity>

          {/* Today's Workout */}
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Today's Workout
          </Text>
          <TouchableOpacity
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
            onPress={() => router.push("/(tabs)/workout")}
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="bg-primary-100 px-3 py-1 rounded-full">
                <Text className="text-primary-700 text-xs font-bold uppercase">
                  Upper Body
                </Text>
              </View>
              <Text className="text-gray-400 text-xs">45 min</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Push Strength
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Chest, Shoulders, Triceps
            </Text>
          </TouchableOpacity>

          {/* Quick Actions / Stats */}
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Your Progress
          </Text>

          {/* Overall Plan Progress Bar */}
          <View className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-900 dark:text-white font-semibold">
                Plan Progress
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {stats.workoutsCompleted} workouts
              </Text>
            </View>
            <View className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
              <View
                className="bg-primary-500 h-full"
                style={{
                  width: `${Math.min(
                    100,
                    (stats.workoutsCompleted /
                      (activePlan?.total_weeks * 4 || 1)) *
                      100
                  )}%`,
                }}
              />
            </View>
            <Text className="text-xs text-gray-400 mt-2 text-right">
              {Math.min(
                100,
                Math.round(
                  (stats.workoutsCompleted /
                    (activePlan?.total_weeks * 4 || 1)) *
                    100
                )
              )}
              % Complete
            </Text>
          </View>

          <View className="flex-row gap-4 mb-10">
            <View className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.workoutsCompleted}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Workouts Done
              </Text>
            </View>
            <View className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats.totalVolume / 1000).toFixed(1)}k
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Kg Lifted
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
