import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { name, instructions, reps, sets } = useLocalSearchParams<{
    name: string;
    instructions?: string;
    reps?: string;
    sets?: string;
  }>();

  // If no name, invalid
  if (!name) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Exercise not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={["top", "bottom"]}
      >
        <View className="px-6 py-4 flex-row items-center border-b border-gray-100 dark:border-gray-800">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
          >
            <ChevronLeft
              size={24}
              className="text-gray-900 dark:text-white"
              color="#111827"
            />
          </TouchableOpacity>
          <Text
            className="text-xl font-bold text-gray-900 dark:text-white flex-1"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Video Section would go here */}

          <View className="px-6 py-6">
            {/* Quick Stats */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl items-center">
                <Text className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">
                  Sets
                </Text>
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {sets || "-"}
                </Text>
              </View>
              <View className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl items-center">
                <Text className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">
                  Reps
                </Text>
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {reps || "-"}
                </Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Instructions
              </Text>
              <View className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                <Text className="text-gray-600 dark:text-gray-300 leading-7 text-base">
                  {instructions ||
                    "Perform this exercise with controlled movements. Focus on form and breathing."}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
