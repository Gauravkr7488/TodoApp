import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useTheme } from "@/Components/ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";

type Props = ViewProps & {
  children: React.ReactNode;
};

export default function CustomView({ children, style, ...rest }: Props) {
  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;

  return (
    <View {...rest} style={[{ backgroundColor: theme.background }, style]}>
      {children}
    </View>
  );
}
