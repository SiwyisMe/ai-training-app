import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
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

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setFitnessLevel(data.fitness_level || "Beginner");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: fullName,
          fitness_level: fitnessLevel,
        })
        .eq("user_id", userId);

      if (error) throw error;
      showToast.success("Profile updated!");
      router.back();
    } catch (error) {
      console.error(error);
      showToast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
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
            Edit Profile
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

      <ScrollView
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Full Name
          </Text>
          <TextInput
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Fitness Level
          </Text>
          <View className="space-y-3">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <TouchableOpacity
                key={level}
                className={`p-4 rounded-xl border ${
                  fitnessLevel === level
                    ? "bg-primary-50 dark:bg-primary-900/60 border-primary-500"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
                onPress={() => setFitnessLevel(level)}
              >
                <Text
                  className={`font-bold ${
                    fitnessLevel === level
                      ? "text-primary-700 dark:text-primary-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
