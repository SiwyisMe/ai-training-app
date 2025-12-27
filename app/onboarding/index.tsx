import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AssessmentScreen() {
  const router = useRouter();
  const { isRegenerating } = useLocalSearchParams();
  const { data, updateData } = useOnboarding();

  useEffect(() => {
    if (isRegenerating === "true") {
      updateData({ isRegenerating: true });
    }
  }, [isRegenerating]);

  const handleNext = () => {
    // Basic mapping logic for MVP
    let level = "beginner";
    if (data.daysPerWeek >= 4) level = "intermediate";
    if (data.daysPerWeek >= 6) level = "advanced";

    // In a real app, logic would be more complex based on answers
    updateData({ fitnessLevel: level });
    router.push("/onboarding/goals");
  };

  const setFrequency = (val: number) => {
    // We are reusing daysPerWeek to store frequency for now, or could add a specific field
    updateData({ daysPerWeek: val });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-4">
      <View className="mb-6">
        <Text className="text-sm font-bold text-primary-500 uppercase tracking-wider mb-2">
          Step 1 of 5
        </Text>
        <Text className="text-2xl font-bold text-gray-900">
          Fitness Assessment
        </Text>
        <Text className="text-gray-500 mt-2">
          Let's determine your current fitness level to tailor your plan.
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="space-y-6 pb-10">
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              How often do you currently exercise?
            </Text>
            {[
              { label: "Never / Rarely (0-1x/week)", value: 1 },
              { label: "Sometimes (2-3x/week)", value: 3 },
              { label: "Regularly (4-5x/week)", value: 5 },
              { label: "Very Frequently (6-7x/week)", value: 6 },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.label}
                className={`p-4 border rounded-xl mb-3 ${
                  data.daysPerWeek === opt.value
                    ? "bg-primary-50 border-primary-500"
                    : "bg-white border-gray-200"
                }`}
                onPress={() => setFrequency(opt.value)}
              >
                <Text
                  className={`text-base ${
                    data.daysPerWeek === opt.value
                      ? "text-primary-700 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* More questions would go here in fully implemented version */}
        </View>
      </ScrollView>

      <View className="py-4 border-t border-gray-100">
        <TouchableOpacity
          className="bg-primary-600 py-4 rounded-xl shadow-md items-center"
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg">Next Step</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
