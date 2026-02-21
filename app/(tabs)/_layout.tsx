// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="taskListScreen" options={{ title: "All Tasks" }} />
      <Tabs.Screen name="SettingsScreen" options={{ title: "Settings" }} />
    </Tabs>
  );
}