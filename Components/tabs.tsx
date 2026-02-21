import { Pressable, View, Text, ScrollView } from "react-native";
type TabsProps = {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
};

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <View style={{ borderBottomWidth: 2, borderBottomColor: "#ddd" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row" }}
      >
        {tabs.map((tab) => {
          const active = tab === activeTab;

          return (
            <Pressable
              key={tab}
              onPress={() => onChange(tab)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                alignItems: "center",
                borderBottomWidth: 2,
                borderBottomColor: active ? "black" : "transparent",
              }}
            >
              <Text style={{ fontWeight: active ? "bold" : "normal" }}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
