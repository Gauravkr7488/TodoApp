import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";
import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "./ThemeContext";

export default function CustomText({ style, ...props }: TextProps) {
  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  return <Text {...props} style={[{ color: theme.textPrimary }, style]} />;
}
