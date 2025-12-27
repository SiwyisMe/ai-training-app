import { useRouter } from "expo-router";
import { Check, ChevronLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubscriptionScreen() {
  const router = useRouter();

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
          Subscription
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <View className="items-center mb-8">
            <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Upgrade to Pro
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              Unlock unlimited AI generation, advanced analytics, and custom
              meal plans.
            </Text>
          </View>

          {/* Free Plan */}
          <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-4 opacity-50">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Basic
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 font-medium">
                Current
              </Text>
            </View>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Check size={16} color="#10B981" />
                <Text className="ml-2 text-gray-600 dark:text-gray-300">
                  1 AI Plan
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check size={16} color="#10B981" />
                <Text className="ml-2 text-gray-600 dark:text-gray-300">
                  Basic Tracking
                </Text>
              </View>
            </View>
          </View>

          {/* Pro Plan */}
          <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-primary-500 mb-6 shadow-sm relative overflow-hidden">
            <View className="absolute top-0 right-0 bg-primary-500 px-3 py-1 rounded-bl-xl">
              <Text className="text-white text-xs font-bold uppercase">
                Recommended
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-4 mt-2">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Pro
              </Text>
              <Text className="text-primary-600 dark:text-primary-500 font-bold text-xl">
                $9.99/mo
              </Text>
            </View>
            <View className="space-y-3 mb-6">
              <View className="flex-row items-center">
                <Check size={16} color="#10B981" />
                <Text className="ml-2 text-gray-600 dark:text-gray-300">
                  Unlimited AI Plans
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check size={16} color="#10B981" />
                <Text className="ml-2 text-gray-600 dark:text-gray-300">
                  Advanced Analytics
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check size={16} color="#10B981" />
                <Text className="ml-2 text-gray-600 dark:text-gray-300">
                  Priority Support
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-primary-600 py-3 rounded-xl items-center">
              <Text className="text-white font-bold">Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
