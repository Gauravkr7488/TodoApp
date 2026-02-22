import React from "react";
import { Pressable, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";

type CheckboxStatus = "checked" | "unchecked" | "indeterminate";

interface CustomCheckBoxProps {
  status: CheckboxStatus;
  onPress: () => void;
}

export default function CustomCheckBox({
  status,
  onPress,
}: CustomCheckBoxProps) {
  const isChecked = status === "checked";
  const isIndeterminate = status === "indeterminate";

  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  const borderColor = isDark ? "#fff" : "#000";
  return (
    <Pressable onPress={onPress} style={{ padding: 16 }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: borderColor,
          borderRadius: 4,
          width: 24,
          height: 24,
          // padding:16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isChecked && (
          <MaterialIcons name="check" size={20} color={borderColor} />
        )}

        {/* {isIndeterminate && (
          <MaterialIcons name="remove" size={20} color="#000" />
        )} */}
      </View>
    </Pressable>
  );
}
