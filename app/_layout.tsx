import { AuthProvider } from "@/contexts/AuthContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../global.css";

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    // Force synchronization of NativeWind state with the CSS engine on mount
    // This fixes the issue where the cached state is "dark" but the CSS classes
    // haven't been applied yet.
    if (colorScheme) {
      setColorScheme(colorScheme);
    }
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
        </Stack>
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
}
