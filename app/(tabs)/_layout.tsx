import { useTheme } from "@/Components/ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomWidth: 2,
          borderBottomColor: theme.border,
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.container,
                focused && { backgroundColor: theme.accent },
              ]}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                // color={theme.accent}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="TaskListScreen"
        options={{
          title: "All Tasks",

          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.container,
                focused && { backgroundColor: theme.accent },
              ]}
            >
              <Ionicons
                name={focused ? "list" : "list-outline"}
                size={size}
                // color={theme.accent}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="SettingsScreen"
        options={{
          title: "Settings",

          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.container,
                focused && { backgroundColor: theme.accent },
              ]}
            >
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={size}
                // color={theme.accent}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20, // rounded pill
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60, // optional fixed length
  },
});
