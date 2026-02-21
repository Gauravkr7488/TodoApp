import { StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "../../Components/ThemeContext";

const SettingsScreen = () => {
  const { isDark, toggleDark } = useTheme();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
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
