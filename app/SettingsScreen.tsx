import { View, Text, Switch, StyleSheet } from "react-native";
import { useCallback, useState } from "react";
import BottomNav, { getCurrentTab } from "@/Components/bottomNav";
import { useFocusEffect, useRouter } from "expo-router";

const SettingsScreen = () => {
  const [isDark, setIsDark] = useState(false);
  const currentTab = getCurrentTab();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (currentTab == "Home" || currentTab == "AllTasks") {
        router.back();
      }
    }, [currentTab]),
  );
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: isDark ? "#121212" : "#ffffff",
      }}
    >
      <View style={styles.row}>
        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
          Dark Mode
        </Text>
        <Switch value={isDark} onValueChange={setIsDark} />
      </View>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
  },
});

export default SettingsScreen;
