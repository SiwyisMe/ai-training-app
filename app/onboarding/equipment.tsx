import { useOnboarding } from "@/contexts/OnboardingContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EQUIPMENT_LIST = [
  "Bodyweight Only",
  "Dumbbells",
  "Barbell",
  "Kettlebells",
  "Resistance Bands",
  "Pull-up Bar",
  "Bench",
  "Cable Machine",
  "Treadmill",
  "Stationary Bike",
];

export default function EquipmentScreen() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const toggleEquipment = (item: string) => {
    if (data.equipment.includes(item)) {
      updateData({ equipment: data.equipment.filter((e) => e !== item) });
    } else {
      updateData({ equipment: [...data.equipment, item] });
    }
  };

  const handleNext = () => {
    router.push("/onboarding/schedule");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 mb-6">
        <Text className="text-sm font-bold text-primary-500 uppercase tracking-wider mb-2">
          Step 3 of 5
        </Text>
        <Text className="text-2xl font-bold text-gray-900">
          Available Equipment
        </Text>
        <Text className="text-gray-500 mt-2">
          Select what you have access to.
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 flex-row flex-wrap gap-3 pb-10">
          {EQUIPMENT_LIST.map((item) => (
            <TouchableOpacity
              key={item}
              className={`px-5 py-3 border rounded-full ${
                data.equipment.includes(item)
                  ? "bg-primary-50 border-primary-500"
                  : "bg-white border-gray-200"
              }`}
              onPress={() => toggleEquipment(item)}
            >
              <Text
                className={`${
                  data.equipment.includes(item)
                    ? "text-primary-700 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="py-4 border-t border-gray-100 px-6">
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
