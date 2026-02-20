import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider, IconButton, MD3LightTheme } from "react-native-paper";

export default function RootLayout() {
  const router = useRouter();
  return (
    <SafeAreaProvider>
      <PaperProvider 
      theme={MD3LightTheme}
      >
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
              headerRight: () => (
                <IconButton
                  icon="magnify"
                  onPress={() => router.push("./SearchPage")}
                ></IconButton>
              ),
            }}
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
