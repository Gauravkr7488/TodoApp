import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";
import { StyleSheet, Switch, View } from "react-native";
import CustomText from "../../Components/text";
import { useTheme } from "../../Components/ThemeContext";

const SettingsScreen = () => {
  const { isDark, toggleDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <View style={styles.row}>
        <CustomText style={styles.label}>Dark Mode</CustomText>
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
