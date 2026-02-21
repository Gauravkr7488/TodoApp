import { View, Text, Switch, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { getglobalNavState, setglobalNavState } from "@/fun/NavState";

type Tab = "Home" | "AllTasks" | "Settings";

const SettingsScreen = () => {
  const [isDark, setIsDark] = useState(false);
  const globalNavState = getglobalNavState();
  const [currentTab, setCurrentTab] = useState<Tab>(globalNavState);
  const router = useRouter();

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);

    if (tab === "Home") router.push("./");
    if (tab === "AllTasks") router.push("./taskListScreen");
    // if (tab === "Settings") router.push("./settings");
    setglobalNavState(tab);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        // backgroundColor: isDark ? "#121212" : "#ffffff",
      }}
    >
      <View style={styles.row}>
        <Text>
          Dark Mode
        </Text>
        <Switch value={isDark} onValueChange={setIsDark} />
      </View>

    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
  },
});
