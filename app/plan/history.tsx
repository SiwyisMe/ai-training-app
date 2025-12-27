import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PlanSummary {
  id: string;
  plan_name: string;
  status: string;
  created_at: string;
  plan_data: {
    weeks: any[];
  };
}

export default function PlanHistoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PlanSummary[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("workout_plans")
        .select("id, plan_name, status, created_at, plan_data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setPlans(data);
    } catch (error) {
      console.error(error);
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
          Plan History
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF3B30" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 py-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pb-8">
            {plans.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-gray-500 text-lg">
                  No plan history found.
                </Text>
              </View>
            ) : (
              <View className="space-y-4">
                {plans.map((plan) => (
                  <TouchableOpacity
                    key={plan.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-row items-center justify-between"
                    onPress={() =>
                      router.push({
                        pathname: "/plan/overview",
                        params: { id: plan.id },
                      })
                    }
                  >
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mr-2">
                          {plan.plan_name}
                        </Text>
                        <View
                          className={`px-2 py-0.5 rounded-md ${
                            plan.status === "active"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold uppercase ${
                              plan.status === "active"
                                ? "text-green-700 dark:text-green-300"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {plan.status}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <Calendar size={14} color="#6B7280" />
                        <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          Created{" "}
                          {format(new Date(plan.created_at), "MMM d, yyyy")}
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">
                          {plan.plan_data.weeks?.length || 4} Weeks
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#D1D5DB" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
