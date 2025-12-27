import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMeasurementScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");

  const handleSave = async () => {
    if (!weight) return;
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("body_measurements").insert({
        user_id: user.id,
        measurement_date: new Date().toISOString(),
        weight: parseFloat(weight),
        body_fat_percentage: bodyFat ? parseFloat(bodyFat) : null,
      });

      if (error) throw error;
      showToast.success("Measurement saved!");
      router.back();
    } catch (error) {
      console.error(error);
      showToast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-6 py-4 flex-row items-center bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft
            size={24}
            className="text-gray-900 dark:text-white"
            color={undefined}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Log Measurement
        </Text>
      </View>

      <View className="p-6">
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Body Weight (kg)
          </Text>
          <TextInput
            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-lg font-bold text-gray-900 dark:text-white"
            placeholder="e.g. 75.5"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <View className="mb-8">
          <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Body Fat % (Optional)
          </Text>
          <TextInput
            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-lg font-bold text-gray-900 dark:text-white"
            placeholder="e.g. 15"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={bodyFat}
            onChangeText={setBodyFat}
          />
        </View>

        <TouchableOpacity
          className="bg-primary-600 py-4 rounded-xl items-center"
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Save Log</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
