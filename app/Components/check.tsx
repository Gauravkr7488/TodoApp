import React from "react";
import { Pressable, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CrispCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export default function CrispCheckbox({
  checked,
  onPress,
}: CrispCheckboxProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          borderWidth: 1, // thin border
          borderColor: "#000", // dark outline
          borderRadius: 4, // rounded like Material 3
          width: 24,
          height: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && <MaterialIcons name="check" size={20} color="#000" />}
      </View>
    </Pressable>
  );
}
