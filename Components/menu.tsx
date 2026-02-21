import React, { useState } from "react";
import { Pressable } from "react-native";
import { Menu } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { HeaderMenuProps } from "@/Constants/type";

export default function HeaderMenu({ items }: HeaderMenuProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Pressable onPress={() => setVisible(true)} style={{ marginRight: 15 }}>
          <MaterialIcons name="more-vert" size={24} />
        </Pressable>
      }
    >
      {items.map((item, index) => (
        <Menu.Item
          key={index}
          title={item.title}
          onPress={() => {
            setVisible(false);
            item.onPress?.();
          }}
          leadingIcon={item.icon}
        />
      ))}
    </Menu>
  );
}
