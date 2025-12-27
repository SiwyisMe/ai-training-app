import { useOnboarding } from "@/contexts/OnboardingContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_GOALS = [
  "Lose Weight",
  "Build Muscle",
  "Increase Strength",
  "Improve Endurance",
  "Enhance Flexibility",
  "General Fitness",
];

export default function GoalsScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const toggleSecondaryGoal = (goal: string) => {
    if (data.secondaryGoals.includes(goal)) {
      updateData({
        secondaryGoals: data.secondaryGoals.filter((g) => g !== goal),
      });
    } else {
      if (data.secondaryGoals.length >= 3) return; // Max 3
      updateData({ secondaryGoals: [...data.secondaryGoals, goal] });
    }
  };

  const handleNext = () => {
    if (!data.primaryGoal) return;
    router.push("/onboarding/equipment");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 mb-6">
        <Text className="text-sm font-bold text-primary-500 uppercase tracking-wider mb-2">
          Step 2 of 5
        </Text>
        <Text className="text-2xl font-bold text-gray-900">
          Define Your Goals
        </Text>
        <Text className="text-gray-500 mt-2">What do you want to achieve?</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 space-y-6 pb-10">
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Primary Goal (Select 1)
            </Text>
            {PRIMARY_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal}
                className={`p-4 border rounded-xl mb-3 ${
                  data.primaryGoal === goal
                    ? "bg-primary-50 border-primary-500"
                    : "bg-white border-gray-200"
                }`}
                onPress={() => updateData({ primaryGoal: goal })}
              >
                <Text
                  className={`text-base ${
                    data.primaryGoal === goal
                      ? "text-primary-700 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {data.primaryGoal && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Secondary Goals (Max 3)
              </Text>
              {PRIMARY_GOALS.filter((g) => g !== data.primaryGoal).map(
                (goal) => (
                  <TouchableOpacity
                    key={goal}
                    className={`p-4 border rounded-xl mb-3 ${
                      data.secondaryGoals.includes(goal)
                        ? "bg-primary-50 border-primary-500"
                        : "bg-white border-gray-200"
                    }`}
                    onPress={() => toggleSecondaryGoal(goal)}
                  >
                    <View className="flex-row justify-between items-center">
                      <Text
                        className={`text-base ${
                          data.secondaryGoals.includes(goal)
                            ? "text-primary-700 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {goal}
                      </Text>
                      {data.secondaryGoals.includes(goal) && (
                        <Text className="text-primary-600 font-bold">✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="py-4 border-t border-gray-100 px-6">
        <TouchableOpacity
          className={`py-4 rounded-xl shadow-md items-center ${
            data.primaryGoal ? "bg-primary-600" : "bg-gray-300"
          }`}
          onPress={handleNext}
          disabled={!data.primaryGoal}
        >
          <Text className="text-white font-bold text-lg">Next Step</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
