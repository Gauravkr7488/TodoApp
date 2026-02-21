import { View, Text, Pressable } from "react-native";

type BottomNavProps = {
  activeTab: "Home" | "AllTasks" | "Settings";
  onChange: (tab: "Home" | "AllTasks" | "Settings") => void;
};

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { key: "Home", label: "Home" },
    { key: "AllTasks", label: "All Tasks" },
    { key: "Settings", label: "Settings" },
  ] as const;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingVertical: 10,
        paddingBottom:30
        // backgroundColor: "#fff",
      }}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={{ alignItems: "center",
              padding: 20
             }}
          >
            <Text
              style={{
                fontWeight: active ? "bold" : "normal",
                color: active ? "black" : "#888",
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
