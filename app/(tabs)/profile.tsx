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

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.log("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <ActivityIndicator color="#FF3B30" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Profile
        </Text>

        <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-6 flex-row items-center">
          <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl font-bold text-primary-600">
              {profile?.full_name?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {profile?.full_name || "User"}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              {profile?.fitness_level || "Not set"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6">
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6">
            <TouchableOpacity
              className="p-4 border-b border-gray-100 dark:border-gray-700"
              onPress={() => router.push("/history")}
            >
              <Text className="text-gray-900 dark:text-white font-medium">
                Workout History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 border-b border-gray-100 dark:border-gray-700"
              onPress={() => router.push("/profile/edit")}
            >
              <Text className="text-gray-900 dark:text-white font-medium">
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 border-b border-gray-100 dark:border-gray-700"
              onPress={() => router.push("/profile/subscription")}
            >
              <Text className="text-gray-900 dark:text-white font-medium">
                Manage Subscription
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 border-b border-gray-100 dark:border-gray-700"
              onPress={() => router.push("/profile/settings")}
            >
              <Text className="text-gray-900 dark:text-white font-medium">
                App Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4" onPress={handleSignOut}>
              <Text className="text-red-500 font-medium">Sign Out</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6 p-4">
            <Text className="text-gray-900 dark:text-white font-bold mb-2">
              Current Plan
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Active AI Plan
            </Text>
            <TouchableOpacity
              className="mt-4 bg-gray-100 dark:bg-gray-700 py-2 rounded-lg items-center"
              onPress={() => router.push("/plan/regenerate")}
            >
              <Text className="text-primary-600 dark:text-primary-500 font-semibold">
                Regenerate Plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
