import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { WorkoutCompletion, WorkoutDay, WorkoutPlan } from "@/types/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Minimize2,
  Play,
  SkipForward,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Extend CompletedExercise for local state to include 'completed' flag per set
type LocalSet = {
  reps: number;
  weight: number;
  completed: boolean;
};

type LocalExerciseLog = {
  name: string;
  sets: LocalSet[];
};

export default function WorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [nextWorkout, setNextWorkout] = useState<
    (WorkoutDay & { weekNum: number }) | null
  >(null);
  const [isActive, setIsActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Tracking state for active workout
  const [logs, setLogs] = useState<LocalExerciseLog[]>([]);

  // Rest Timer State
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showRestModal, setShowRestModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const DEFAULT_REST_TIME = 90;

  useEffect(() => {
    fetchWorkoutData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [params.week, params.day]);

  const startRestTimer = () => {
    setRestTimer(DEFAULT_REST_TIME);
    setIsResting(true);
    setShowRestModal(true);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRestTimer((prev) => {
        if (prev <= 1) {
          endRestTimer();
          Vibration.vibrate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endRestTimer = () => {
    setIsResting(false);
    setShowRestModal(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const navigateToDay = (week: number, day: number) => {
    router.push({
      pathname: "/(tabs)/workout",
      params: { week: week.toString(), day: day.toString() },
    });
  };

  const getPreviousDay = () => {
    if (!activePlan || !nextWorkout) return null;
    const currentWeek = activePlan.plan_data.weeks.find(
      (w: any) => w.week_number === nextWorkout.weekNum
    );

    if (nextWorkout.day_number > 1) {
      return { week: nextWorkout.weekNum, day: nextWorkout.day_number - 1 };
    } else if (nextWorkout.weekNum > 1) {
      const prevWeek = activePlan.plan_data.weeks.find(
        (w: any) => w.week_number === nextWorkout.weekNum - 1
      );
      if (prevWeek) {
        return { week: prevWeek.week_number, day: prevWeek.workouts.length };
      }
    }
    return null;
  };

  const getNextDay = () => {
    if (!activePlan || !nextWorkout) return null;
    const currentWeek = activePlan.plan_data.weeks.find(
      (w: any) => w.week_number === nextWorkout.weekNum
    );

    if (currentWeek && nextWorkout.day_number < currentWeek.workouts.length) {
      return { week: nextWorkout.weekNum, day: nextWorkout.day_number + 1 };
    } else if (nextWorkout.weekNum < activePlan.plan_data.weeks.length) {
      return { week: nextWorkout.weekNum + 1, day: 1 };
    }
    return null;
  };

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get Active Plan
      const { data: plan } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (!plan) {
        setLoading(false);
        return;
      }

      setActivePlan(plan);

      // 2. Determine which workout to load
      let nextWeek = 1;
      let nextDay = 1;

      // Check URL params first
      if (params.week && params.day) {
        nextWeek = parseInt(params.week as string);
        nextDay = parseInt(params.day as string);
      } else {
        // Fallback to "Next Logical Workout" logic
        const { data: lastCompletion } = await supabase
          .from("workout_completions")
          .select("week_number, day_number")
          .eq("plan_id", plan.id)
          .order("completed_at", { ascending: false })
          .limit(1)
          .single();

        if (lastCompletion) {
          const currentWeekData = plan.plan_data.weeks.find(
            (w: any) => w.week_number === lastCompletion.week_number
          );
          const maxDaysInWeek = currentWeekData?.workouts.length || 0;

          if (lastCompletion.day_number < maxDaysInWeek) {
            nextWeek = lastCompletion.week_number;
            nextDay = lastCompletion.day_number + 1;
          } else {
            nextWeek = lastCompletion.week_number + 1;
            nextDay = 1;
          }
        }
      }

      // Find the specific workout object
      const weekObj = plan.plan_data.weeks.find(
        (w: any) => w.week_number === nextWeek
      );
      const workoutObj = weekObj?.workouts.find(
        (d: any) => d.day_number === nextDay
      );

      if (workoutObj) {
        setNextWorkout({ ...workoutObj, weekNum: nextWeek });
        // Initialize logs
        setLogs(
          workoutObj.exercises.map((ex: any) => ({
            name: ex.name,
            sets: Array(ex.sets).fill({ reps: 0, weight: 0, completed: false }),
          }))
        );
      } else {
        // If specific week/day invalid, or plan finished
        setNextWorkout(null);
      }
    } catch (error) {
      console.error(error);
      showToast.error("Failed to load workout");
    } finally {
      setLoading(false);
    }
  };

  const updateLog = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: string
  ) => {
    const newLogs = [...logs];
    const numValue = parseFloat(value) || 0;
    const currentSets = [...newLogs[exerciseIndex].sets];

    currentSets[setIndex] = {
      ...currentSets[setIndex],
      [field]: numValue,
    };

    newLogs[exerciseIndex] = {
      ...newLogs[exerciseIndex],
      sets: currentSets,
    };
    setLogs(newLogs);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const newLogs = [...logs];
    const currentSets = [...newLogs[exerciseIndex].sets];

    const wasCompleted = currentSets[setIndex].completed;
    currentSets[setIndex] = {
      ...currentSets[setIndex],
      completed: !wasCompleted,
    };

    newLogs[exerciseIndex] = { ...newLogs[exerciseIndex], sets: currentSets };
    setLogs(newLogs);

    if (!wasCompleted) {
      startRestTimer();
    }
  };

  const finishWorkout = async () => {
    if (!activePlan || !nextWorkout) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      // Transform logs back to CompletedExercise (remove 'completed' flag)
      const sanitizedLogs = logs.map((l) => ({
        name: l.name,
        sets: l.sets.map((s) => ({ reps: s.reps, weight: s.weight })),
      }));

      const completion: Partial<WorkoutCompletion> = {
        user_id: user.id,
        plan_id: activePlan.id,
        week_number: nextWorkout.weekNum,
        day_number: nextWorkout.day_number,
        workout_date: new Date().toISOString(),
        exercises_completed: sanitizedLogs,
        duration_minutes: 45, // mock duration
      };

      const { error } = await supabase
        .from("workout_completions")
        .insert(completion);
      if (error) throw error;

      showToast.success("Workout Saved!");
      setIsActive(false);
      endRestTimer();
      fetchWorkoutData();
    } catch (error) {
      console.error(error);
      showToast.error("Failed to save workout");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator color="#FF3B30" />
      </View>
    );
  }

  if (!nextWorkout) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No Active Workout Found
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          Create a plan or wait for next scheduled day.
        </Text>
      </SafeAreaView>
    );
  }

  if (!isActive) {
    // PREVIEW MODE
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        {/* Day Navigation Header */}
        <View className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity
              className={`p-2 rounded-lg ${
                getPreviousDay() ? "bg-gray-100 dark:bg-gray-800" : "opacity-30"
              }`}
              disabled={!getPreviousDay()}
              onPress={() => {
                const prev = getPreviousDay();
                if (prev) navigateToDay(prev.week, prev.day);
              }}
            >
              <ChevronLeft
                size={20}
                className="text-gray-900 dark:text-white"
              />
            </TouchableOpacity>

            <View className="flex-1 items-center">
              <Text className="text-gray-500 dark:text-gray-400 font-medium uppercase text-xs tracking-wider">
                Week {nextWorkout.weekNum}, Day {nextWorkout.day_number}
              </Text>
            </View>

            <TouchableOpacity
              className={`p-2 rounded-lg ${
                getNextDay() ? "bg-gray-100 dark:bg-gray-800" : "opacity-30"
              }`}
              disabled={!getNextDay()}
              onPress={() => {
                const next = getNextDay();
                if (next) navigateToDay(next.week, next.day);
              }}
            >
              <ChevronRight
                size={20}
                className="text-gray-900 dark:text-white"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {nextWorkout.workout_title}
          </Text>
          <View className="flex-row items-center mt-2">
            <Clock size={16} color="#6B7280" />
            <Text className="text-gray-500 dark:text-gray-400 ml-1">
              Est. 45 mins • {nextWorkout.exercises.length} Exercises
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 py-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            {nextWorkout.exercises.map((ex, idx) => (
              <TouchableOpacity
                key={idx}
                className="flex-row items-center mb-6"
                onPress={() =>
                  router.push({
                    pathname: "/exercises/[name]",
                    params: {
                      name: ex.name,
                      reps: ex.reps,
                      sets: ex.sets,
                      instructions: ex.instructions,
                    },
                  })
                }
              >
                <View className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg items-center justify-center mr-4">
                  <Text className="text-gray-500 dark:text-gray-400 font-bold">
                    {idx + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    {ex.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400">
                    {ex.sets} sets × {ex.reps} reps
                  </Text>
                </View>
                <ChevronRight size={20} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View className="pb-6 px-6">
          <TouchableOpacity
            className="bg-primary-600 py-4 rounded-xl shadow-lg flex-row items-center justify-center"
            onPress={() => setIsActive(true)}
          >
            <Play size={20} color="white" fill="white" />
            <Text className="text-white font-bold text-lg ml-2 uppercase tracking-widest">
              Start Workout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ACTIVE MODE
  const currentExercise = nextWorkout.exercises[currentExerciseIndex];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="px-6 py-3 flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <Text className="text-gray-600 dark:text-gray-400 font-medium text-sm">
          Exercise {currentExerciseIndex + 1}/{nextWorkout.exercises.length}
        </Text>
        <TouchableOpacity onPress={() => setIsActive(false)}>
          <Text className="text-gray-900 dark:text-white font-bold">Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/exercises/[name]",
              params: {
                name: currentExercise.name,
                reps: currentExercise.reps,
                sets: currentExercise.sets,
                instructions: currentExercise.instructions,
              },
            })
          }
        >
          <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 underline decoration-gray-300 dark:decoration-gray-500/50">
            {currentExercise.name}
          </Text>
        </TouchableOpacity>

        {/* Instructions */}
        {currentExercise.instructions && (
          <View className="mb-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
            <Text className="text-gray-700 dark:text-gray-300 text-sm italic">
              "{currentExercise.instructions}"
            </Text>
          </View>
        )}

        {/* Sets */}
        {logs[currentExerciseIndex]?.sets.map((set, i) => (
          <View
            key={i}
            className={`flex-row items-center justify-between p-3 rounded-xl mb-3 ${
              set.completed
                ? "bg-primary-100 dark:bg-primary-900/40 border border-primary-300 dark:border-primary-500/50"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center">
                <Text className="text-gray-900 dark:text-white font-bold text-sm">
                  {i + 1}
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-400 text-xs">
                Target: {currentExercise.reps}
              </Text>
            </View>

            <View className="flex-row gap-2 items-center">
              {currentExercise.can_use_weights !== false ? (
                <TextInput
                  className={`text-gray-900 dark:text-white w-16 p-2 rounded-lg text-center font-bold text-sm ${
                    set.completed
                      ? "bg-primary-50 dark:bg-primary-900/60"
                      : "bg-gray-100 dark:bg-gray-900"
                  }`}
                  placeholder="kg"
                  placeholderTextColor="#4B5563"
                  keyboardType="numeric"
                  value={set.weight > 0 ? set.weight.toString() : ""}
                  onChangeText={(val) =>
                    updateLog(currentExerciseIndex, i, "weight", val)
                  }
                  editable={!set.completed}
                />
              ) : (
                <View className="w-16 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center">
                  <Text className="text-gray-500 dark:text-gray-400 font-bold text-xs">
                    Body
                  </Text>
                </View>
              )}
              <TextInput
                className={`text-gray-900 dark:text-white w-16 p-2 rounded-lg text-center font-bold text-sm ${
                  set.completed
                    ? "bg-primary-50 dark:bg-primary-900/60"
                    : "bg-gray-100 dark:bg-gray-900"
                }`}
                placeholder="reps"
                placeholderTextColor="#4B5563"
                keyboardType="numeric"
                value={set.reps > 0 ? set.reps.toString() : ""}
                onChangeText={(val) =>
                  updateLog(currentExerciseIndex, i, "reps", val)
                }
                editable={!set.completed}
              />
              <TouchableOpacity
                className={`w-9 h-9 rounded-lg items-center justify-center ${
                  set.completed
                    ? "bg-primary-500"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
                onPress={() => toggleSetComplete(currentExerciseIndex, i)}
              >
                <Check size={18} color={set.completed ? "white" : "#4B5563"} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Navigation */}
      <View className="bg-white dark:bg-gray-800 p-6 flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          disabled={currentExerciseIndex === 0}
          onPress={() => setCurrentExerciseIndex((prev) => prev - 1)}
        >
          <Text
            className={`font-bold ${
              currentExerciseIndex === 0
                ? "text-gray-400 dark:text-gray-600"
                : "text-gray-900 dark:text-white"
            }`}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowRestModal(true)}>
          <Text className="text-gray-900 dark:text-white font-bold text-center text-xs uppercase mb-1">
            Rest Timer
          </Text>
          <Text
            className={`font-mono text-center text-xl font-bold ${
              isResting ? "text-primary-500" : "text-gray-400"
            }`}
          >
            {formatTime(restTimer)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentExerciseIndex < nextWorkout.exercises.length - 1) {
              setCurrentExerciseIndex((prev) => prev + 1);
            } else {
              finishWorkout();
            }
          }}
        >
          <Text className="text-primary-600 dark:text-primary-500 font-bold text-lg">
            {currentExerciseIndex === nextWorkout.exercises.length - 1
              ? "Finish"
              : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rest Timer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRestModal && isResting}
      >
        <View className="flex-1 justify-end">
          <View className="bg-gray-900 border-t border-gray-800 h-1/2 p-6 rounded-t-3xl shadow-2xl items-center">
            <View className="w-16 h-1 bg-gray-700 rounded-full mb-8" />
            <Text className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">
              Resting
            </Text>
            <Text className="text-white font-mono text-8xl font-bold mb-8">
              {formatTime(restTimer)}
            </Text>

            <View className="flex-row gap-6 w-full px-8">
              <TouchableOpacity
                className="flex-1 bg-gray-800 py-4 rounded-2xl items-center flex-row justify-center gap-2"
                onPress={() => setRestTimer((prev) => prev + 30)}
              >
                <Text className="text-white font-bold">+30s</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary-600 py-4 rounded-2xl items-center flex-row justify-center gap-2"
                onPress={endRestTimer}
              >
                <SkipForward size={20} color="white" />
                <Text className="text-white font-bold">Skip</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mt-6 p-4"
              onPress={() => setShowRestModal(false)}
            >
              <View className="flex-row items-center gap-2">
                <Minimize2 size={16} color="#9CA3AF" />
                <Text className="text-gray-400">Minimize</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
