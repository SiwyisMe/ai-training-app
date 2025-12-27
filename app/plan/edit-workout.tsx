import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditWorkoutScreen() {
  const router = useRouter();
  const { dayId } = useLocalSearchParams(); // e.g., "1-1" (Week-Day)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [workout, setWorkout] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [dayId]);

  const fetchData = async () => {
    try {
      if (!dayId) return;
      const [weekNum, dayNum] = (dayId as string).split("-").map(Number);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (data) {
        setPlan(data);
        const w = data.plan_data.weeks.find(
          (week: any) => week.week_number === weekNum
        );
        const d = w?.workouts.find((day: any) => day.day_number === dayNum);
        if (d) setWorkout(JSON.parse(JSON.stringify(d))); // Deep copy for editing
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updated = { ...workout };
    updated.exercises[index] = { ...updated.exercises[index], [field]: value };
    setWorkout(updated);
  };

  const removeExercise = (index: number) => {
    const updated = { ...workout };
    updated.exercises.splice(index, 1);
    setWorkout(updated);
  };

  const addExercise = () => {
    const updated = { ...workout };
    updated.exercises.push({ name: "New Exercise", sets: 3, reps: "10-12" });
    setWorkout(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const [weekNum, dayNum] = (dayId as string).split("-").map(Number);

      // Clone plan data
      const newPlanData = JSON.parse(JSON.stringify(plan.plan_data));
      // Find and replace workout
      const weekIdx = newPlanData.weeks.findIndex(
        (w: any) => w.week_number === weekNum
      );
      const dayIdx = newPlanData.weeks[weekIdx].workouts.findIndex(
        (d: any) => d.day_number === dayNum
      );

      newPlanData.weeks[weekIdx].workouts[dayIdx] = workout;

      const { error } = await supabase
        .from("workout_plans")
        .update({ plan_data: newPlanData })
        .eq("id", plan.id);

      if (error) throw error;

      showToast.success("Workout updated!");
      router.back();
    } catch (error) {
      console.error(error);
      showToast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !workout) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator color="#FF3B30" />
      </View>
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
            Edit Workout
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="bg-primary-600 px-4 py-2 rounded-lg"
        >
          {saving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-bold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 py-6" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          <View className="mb-6">
            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Title
            </Text>
            <TextInput
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-lg font-bold text-gray-900 dark:text-white"
              value={workout.workout_title}
              onChangeText={(t) => setWorkout({ ...workout, workout_title: t })}
            />
          </View>

          <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Exercises
          </Text>

          {workout.exercises.map((ex: any, idx: number) => (
            <View
              key={idx}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-2">
                  <View className="flex-row items-center gap-2 mb-1">
                    <TextInput
                      className="font-bold text-gray-900 dark:text-white text-lg flex-1 border-b border-dashed border-gray-300 dark:border-gray-600"
                      value={ex.name}
                      onChangeText={(t) => updateExercise(idx, "name", t)}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/exercises/[name]",
                          params: {
                            name: ex.name,
                            reps: ex.reps,
                            sets: ex.sets,
                          },
                        })
                      }
                      className="bg-primary-100 dark:bg-gray-700 p-1 rounded-full"
                    >
                      <Text className="text-primary-600 text-xs font-bold px-1">
                        INFO
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeExercise(idx)}>
                  <X size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Sets
                  </Text>
                  <TextInput
                    className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg font-bold text-gray-900 dark:text-white"
                    value={ex.sets.toString()}
                    keyboardType="numeric"
                    onChangeText={(t) => updateExercise(idx, "sets", t)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Reps
                  </Text>
                  <TextInput
                    className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg font-bold text-gray-900 dark:text-white"
                    value={ex.reps}
                    onChangeText={(t) => updateExercise(idx, "reps", t)}
                  />
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            className="flex-row items-center justify-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl mb-10"
            onPress={addExercise}
          >
            <Plus
              size={20}
              className="text-gray-500 dark:text-gray-400"
              color={undefined}
            />
            <Text className="text-gray-500 dark:text-gray-400 font-bold ml-2">
              Add New Exercise
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
