import { useRouter } from "expo-router";
import { Bell, ChevronLeft, Lock, Moon } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "nativewind";

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-6 py-4 flex-row items-center bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft
            size={24}
            color={colorScheme === "dark" ? "white" : "#1F2937"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Settings
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6">
            <View className="p-4 border-b border-gray-100 dark:border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Bell size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-900 dark:text-white font-medium">
                  Notifications
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#D1D5DB", true: "#EF4444" }}
              />
            </View>
            <View className="p-4 border-b border-gray-100 dark:border-gray-700 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Moon size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-900 dark:text-white font-medium">
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={colorScheme === "dark"}
                onValueChange={toggleColorScheme}
                trackColor={{ false: "#D1D5DB", true: "#EF4444" }}
              />
            </View>
            <TouchableOpacity className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Lock size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-900 font-medium">
                  Privacy Policy
                </Text>
              </View>
              <ChevronLeft
                size={20}
                color="#D1D5DB"
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
          </View>

          <Text className="text-center text-gray-400 text-sm">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
