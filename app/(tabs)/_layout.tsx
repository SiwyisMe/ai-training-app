import { Tabs } from "expo-router";
import { BarChart3, Dumbbell, Home, User } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#1F2937" : "white", // gray-800 : white
          borderTopWidth: 1,
          borderTopColor: isDark ? "#374151" : "#F3F4F6", // gray-700 : gray-100
          height: 85,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#FF3B30", // primary-500
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#6B7280", // gray-400 : gray-500
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => (
            <View className="mb-4 bg-primary-600 p-4 rounded-full shadow-lg items-center justify-center top-3">
              <Dumbbell size={28} color="white" strokeWidth={2.5} />
            </View>
          ),
          tabBarLabel: () => null, // Hide label to make it a distinct FAB-like button
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
