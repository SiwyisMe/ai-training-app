import { supabase } from "@/lib/supabase";
import { BodyMeasurement } from "@/types/database";
import { differenceInDays, format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVolume: 0,
    workoutsCompleted: 0,
    currentStreak: 0,
    measurements: [] as BodyMeasurement[],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Completions
      const { data: completions } = await supabase
        .from("workout_completions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (completions && completions.length > 0) {
        // Calculate Volume
        let volume = 0;
        completions.forEach((c: any) => {
          c.exercises_completed.forEach((ex: any) => {
            ex.sets.forEach((set: any) => {
              volume += (set.reps || 0) * (set.weight || 0);
            });
          });
        });

        // Calculate Streak
        let streak = 0;
        const today = new Date();
        const lastWorkoutDate = parseISO(completions[0].completed_at);

        const diff = differenceInDays(today, lastWorkoutDate);
        if (diff <= 1) {
          streak = 1;
          for (let i = 0; i < completions.length - 1; i++) {
            const curr = parseISO(completions[i].completed_at);
            const prev = parseISO(completions[i + 1].completed_at);
            const diffDays = differenceInDays(curr, prev);
            if (diffDays <= 1) streak++;
            else break;
          }
        }

        setStats((prev) => ({
          ...prev,
          totalVolume: volume,
          workoutsCompleted: completions.length,
          currentStreak: streak,
        }));
      }

      // 2. Fetch All Measurements for Graph
      const { data: measurements } = await supabase
        .from("body_measurements")
        .select("*")
        .eq("user_id", user.id)
        .order("measurement_date", { ascending: true }); // Ascending for chart

      if (measurements) {
        setStats((prev) => ({
          ...prev,
          measurements: measurements,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = stats.measurements.map((m) => ({
    value: m.weight,
    label: format(parseISO(m.measurement_date), "MMM d"),
    dataPointText: m.weight.toString(),
  }));

  const latestWeight =
    stats.measurements.length > 0
      ? stats.measurements[stats.measurements.length - 1].weight
      : 0;

  const latestBodyFat =
    stats.measurements.length > 0
      ? stats.measurements[stats.measurements.length - 1].body_fat_percentage
      : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Progress
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchStats} />
        }
      >
        <View className="px-6">
          <View className="flex-row flex-wrap gap-4 mb-6">
            <View className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">
                Total Volume
              </Text>
              <Text className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {(stats.totalVolume / 1000).toFixed(1)}k{" "}
                <Text className="text-lg text-gray-500 dark:text-gray-400 font-normal">
                  kg
                </Text>
              </Text>
            </View>

            <View className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
                Workouts
              </Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.workoutsCompleted}
              </Text>
            </View>

            <View className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
                Streak
              </Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.currentStreak}{" "}
                <Text className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                  days
                </Text>
              </Text>
            </View>
          </View>

          {/* Measurements Section */}
          <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Weight History
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/progress/add-measurement")}
              >
                <Text className="text-primary-600 dark:text-primary-500 font-bold text-sm">
                  Log New
                </Text>
              </TouchableOpacity>
            </View>

            {/* Graph */}
            {chartData.length > 0 ? (
              <View className="mb-6 -ml-4">
                <LineChart
                  data={chartData}
                  color="#FF3B30"
                  thickness={3}
                  dataPointsColor="#FF3B30"
                  textColor="#9CA3AF" // gray-400
                  yAxisTextStyle={{ color: "#9CA3AF" }}
                  xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
                  hideRules
                  hideYAxisText={false}
                  yAxisThickness={0}
                  xAxisThickness={1}
                  xAxisColor="#374151" // gray-700
                  curved
                  isAnimated
                  initialSpacing={20}
                  endSpacing={20}
                  height={200}
                  spacing={60} // Adjust based on data density
                />
              </View>
            ) : (
              <View className="h-40 items-center justify-center">
                <Text className="text-gray-500">No data available</Text>
              </View>
            )}

            {/* Recent List */}
            <Text className="text-gray-500 text-xs uppercase font-bold mb-4 mt-2">
              Recent Logs
            </Text>
            {stats.measurements
              .slice()
              .reverse()
              .slice(0, 5)
              .map((m) => (
                <View
                  key={m.id}
                  className="flex-row justify-between py-3 border-b border-gray-100 dark:border-gray-700"
                >
                  <Text className="text-gray-600 dark:text-gray-300">
                    {format(parseISO(m.measurement_date), "MMM d, yyyy")}
                  </Text>
                  <View className="flex-row gap-4">
                    <Text className="font-bold text-gray-900 dark:text-white">
                      {m.weight} kg
                    </Text>
                    {m.body_fat_percentage && (
                      <Text className="text-gray-500 dark:text-gray-400 text-xs">
                        ({m.body_fat_percentage}%)
                      </Text>
                    )}
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
