import { useRouter } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegeneratePlanScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegenerate = () => {
    // Redirect to onboarding flow (Assessment Screen) with regenerate flag
    // We replace to avoid going back to this screen
    router.replace({
      pathname: "/onboarding",
      params: { isRegenerating: "true" },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="px-6 py-6 items-center">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
              <RefreshCw size={40} color="#FF3B30" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Regenerate Your Plan?
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              This will archive your current plan and create a brand new one
              based on your profile.
            </Text>
          </View>

          <TouchableOpacity
            className="w-full bg-primary-600 py-4 rounded-xl items-center mb-4"
            onPress={handleRegenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Create New Plan
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} disabled={loading}>
            <Text className="text-gray-500 dark:text-gray-400 font-bold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
