import { useTheme } from "@/Components/ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";
import React from "react";
import { TextInput, TextInputProps } from "react-native-paper";
type Props = TextInputProps;

export default function CustomTextInput({ style, ...rest }: Props) {
  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;

  return (
    <TextInput
      {...rest}
      placeholderTextColor={theme.textSecondary}
      textColor={theme.textPrimary}
      style={[
        {
          backgroundColor: theme.surface,
          color: theme.textPrimary,
          borderColor: theme.border,
        },
        style,
      ]}
    />
  );
}
