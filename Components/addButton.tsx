import { FAB } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";

type Props = {
  onPress: () => void;
  onLongPress?: () => void;
};
const AddButton = ({ onPress, onLongPress }: Props) => {
  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  return (
    <>
      <FAB
        icon={() => <Ionicons name="add" size={24} />}
        // label="Add"
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          backgroundColor: theme.accent,
        }}
        color={theme.accent}
      />
    </>
  );
};

export default AddButton;
