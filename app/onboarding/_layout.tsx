import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="equipment" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="review" />
      </Stack>
    </OnboardingProvider>
  );
}
