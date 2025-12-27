import { useOnboarding } from "@/contexts/OnboardingContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const DURATIONS = [30, 45, 60, 90];

export default function ScheduleScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const toggleRestDay = (day: string) => {
    if (data.restDays.includes(day)) {
      updateData({ restDays: data.restDays.filter((d) => d !== day) });
    } else {
      updateData({ restDays: [...data.restDays, day] });
    }
  };

  const handleNext = () => {
    // Basic validation
    if (data.daysPerWeek + data.restDays.length !== 7) {
      // Logic could be added here
    }
    router.push("/onboarding/review");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 mb-6">
        <Text className="text-sm font-bold text-primary-500 uppercase tracking-wider mb-2">
          Step 4 of 5
        </Text>
        <Text className="text-2xl font-bold text-gray-900">Your Schedule</Text>
        <Text className="text-gray-500 mt-2">When can you workout?</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 space-y-8 pb-10">
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Days per Week: {data.daysPerWeek}
            </Text>
            <View className="flex-row justify-between bg-gray-100 rounded-lg p-1">
              {[3, 4, 5, 6, 7].map((num) => (
                <TouchableOpacity
                  key={num}
                  className={`flex-1 py-3 items-center rounded-md ${
                    data.daysPerWeek === num ? "bg-white shadow-sm" : ""
                  }`}
                  onPress={() => updateData({ daysPerWeek: num })}
                >
                  <Text
                    className={`font-bold ${
                      data.daysPerWeek === num
                        ? "text-primary-600"
                        : "text-gray-500"
                    }`}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Session Duration (Minutes)
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {DURATIONS.map((dur) => (
                <TouchableOpacity
                  key={dur}
                  className={`px-5 py-3 border rounded-xl ${
                    data.sessionDuration === dur
                      ? "bg-primary-50 border-primary-500"
                      : "bg-white border-gray-200"
                  }`}
                  onPress={() => updateData({ sessionDuration: dur })}
                >
                  <Text
                    className={`${
                      data.sessionDuration === dur
                        ? "text-primary-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {dur} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Preferred Rest Days
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {DAYS.map((day) => (
                <TouchableOpacity
                  key={day}
                  className={`w-[45%] py-3 border rounded-xl items-center mb-2 ${
                    data.restDays.includes(day)
                      ? "bg-gray-800 border-gray-800"
                      : "bg-white border-gray-200"
                  }`}
                  onPress={() => toggleRestDay(day)}
                >
                  <Text
                    className={`${
                      data.restDays.includes(day)
                        ? "text-white font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="py-4 border-t border-gray-100 px-6">
        <TouchableOpacity
          className="bg-primary-600 py-4 rounded-xl shadow-md items-center"
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg">
            Review & Generate
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
