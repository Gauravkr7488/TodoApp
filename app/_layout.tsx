import { Stack } from "expo-router";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../Components/ThemeContext";

const AppWithTheme = () => {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppWithTheme />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
