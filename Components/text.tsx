import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "./ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";

export default function AppText({ style, ...props }: TextProps) {
  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  return <Text {...props} style={[{ color: theme.textPrimary }, style]} />;
}
