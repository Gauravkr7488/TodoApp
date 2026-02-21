import { StyleSheet, Switch, View } from "react-native";
import { useTheme } from "../../Components/ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";
import AppText from "../../Components/text";

const SettingsScreen = () => {
  const { isDark, toggleDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <View style={styles.row}>
        <AppText style={styles.label}>Dark Mode</AppText>
        <Switch value={isDark} onValueChange={toggleDark} />
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
