import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      showToast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Navigation is handled by auth state listener or we can force it
      // For now, let's rely on the AuthContext or manual redirect if needed
      // But typically, the root layout reacts to session changes.
      // However, for explicit feedback:
      showToast.success("Welcome back!");
      router.replace("/(tabs)");
    } catch (error: any) {
      showToast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="px-6 py-8">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mb-8">
              Sign in to continue your progress
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Email
                </Text>
                <TextInput
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-primary-500"
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View>
                <Text className="text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Password
                </Text>
                <TextInput
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-primary-500"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                className="bg-primary-600 py-4 rounded-xl shadow-md active:opacity-90 mt-4 items-center"
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-600 font-bold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
