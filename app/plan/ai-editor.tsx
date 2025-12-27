import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { generateJSON } from "@/services/ai";
import { useRouter } from "expo-router";
import { ChevronLeft, Send, Sparkles } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
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

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AIChatEditorScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your training coach. How can I adjust your plan today? (e.g., 'Make leg day shorter', 'Swap bench press for dumbbells')",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [activePlan, setActivePlan] = useState<any>(null);

  useEffect(() => {
    fetchActivePlan();
  }, []);

  const fetchActivePlan = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("workout_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();
    setActivePlan(data);
  };

  const handleSend = async () => {
    if (!input.trim() || !activePlan) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMsg },
    ]);
    setLoading(true);

    try {
      // Construct Context
      const planContext = JSON.stringify(activePlan.plan_data);

      const prompt = `
         You are an AI Fitness Coach. The user has an active 4-week workout plan. 
         Current Plan Data: ${planContext}

         User Request: "${userMsg}"
         
         Task:
         1. Analyze how to modify the plan based on the request.
         2. Apply the necessary changes to the "Current Plan Data" JSON structure.
         3. Return a JSON response with a "message" for the user and an "action" type.
         
         Format:
         {
           "response_message": "Friendly response explaining the change.",
           "suggested_action": "update_plan",
           "modified_plan_data": { ... } // THE COMPLETE UPDATE PLAN_DATA OBJECT (all weeks/days).
         }
         
         92:          If the request is conversational or you cannot perform the action, return "suggested_action": "none" and a message.
         IMPORTANT: You are a dedicated Fitness Coach. Do NOT answer questions unrelated to fitness, nutrition, or the user's workout plan (e.g., do not provide recipes for pancakes, coding help, or general trivia). If asked about unrelated topics, politely refuse and redirect to training.
      `;

      const aiResponse = await generateJSON(prompt);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse.response_message,
        },
      ]);

      if (
        aiResponse.suggested_action === "update_plan" &&
        aiResponse.modified_plan_data
      ) {
        const { error } = await supabase
          .from("workout_plans")
          .update({ plan_data: aiResponse.modified_plan_data })
          .eq("id", activePlan.id);

        if (error) throw error;

        showToast.success("Plan updated based on your feedback!");
        fetchActivePlan();
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I had trouble processing that request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft
            size={24}
            className="text-gray-900 dark:text-white"
            color={undefined}
          />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            AI Coach
          </Text>
          <Text className="text-xs text-primary-600 dark:text-primary-500 font-medium">
            Gemini Powered
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 py-4"
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`mb-4 max-w-[85%] p-4 rounded-2xl ${
              msg.role === "user"
                ? "bg-primary-600 self-end rounded-tr-none"
                : "bg-white dark:bg-gray-800 self-start rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700"
            }`}
          >
            <Text
              className={`${
                msg.role === "user"
                  ? "text-white"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {msg.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View className="bg-white dark:bg-gray-800 self-start p-4 rounded-2xl rounded-tl-none shadow-sm mb-4">
            <ActivityIndicator size="small" color="#FF3B30" />
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-5 py-3 mr-3 text-gray-900 dark:text-white"
            placeholder="Chat with your coach..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            className="w-12 h-12 bg-primary-600 rounded-full items-center justify-center shadow-md"
            onPress={handleSend}
            disabled={loading}
          >
            {loading ? (
              <Sparkles size={20} color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
