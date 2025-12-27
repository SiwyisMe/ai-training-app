import { useRouter } from "expo-router";
import { Dumbbell } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <SafeAreaView className="flex-1 justify-between px-6 py-12">
        <View className="items-center mt-20">
          <View className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full items-center justify-center mb-8 shadow-sm">
            <Dumbbell size={48} color="#FF3B30" />
          </View>
          <Text className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-3">
            Train Smarter
          </Text>
          <Text className="text-lg text-gray-500 dark:text-gray-400 text-center px-4 leading-6">
            Your personal AI coach for personalized workouts and nutrition
            plans.
          </Text>
        </View>

        <View className="space-y-4 w-full mb-10">
          <TouchableOpacity
            className="w-full bg-primary-600 py-4 rounded-xl shadow-md active:opacity-90 items-center"
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text className="text-white font-bold text-lg uppercase tracking-wider">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-4 rounded-xl active:bg-gray-50 dark:active:bg-gray-700 items-center"
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text className="text-gray-900 dark:text-white font-bold text-lg uppercase tracking-wider">
              I have an account
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
