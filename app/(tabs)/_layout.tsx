import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/Components/ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";

export default function TabsLayout() {
  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.textPrimary,
        tabBarShowLabel: false, // hide text
        tabBarStyle: {
          height: 100, // increase from default (usually ~50)
          paddingBottom: 10, // optional, adjusts icon spacing
          backgroundColor: theme.background,
        },
        tabBarIconStyle: {
          height: 60,
        },
        // tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={theme.accent}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="taskListScreen"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={size}
              color={theme.accent}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="SettingsScreen"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={theme.accent}
            />
          ),
        }}
      />
    </Tabs>
  );
}
