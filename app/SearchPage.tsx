import { STRINGS } from "@/Constants/strings";
import { filterTasks } from "@/db/filter";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Chip, TextInput } from "react-native-paper";

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const searchFilters = [STRINGS.archived, STRINGS.routine];

  const refreshTasks = async (activeFilters: string[]) => {
    const tasks = await filterTasks(activeFilters);
    setTasks(tasks);
  };
  useEffect(() => {
    refreshTasks(activeFilters);
  }, [activeFilters]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((previousFilters) => {
      const isActive = previousFilters.includes(filter);

      if (isActive) {
        // remove filter
        return previousFilters.filter(
          (existingFilter) => existingFilter !== filter,
        );
      }

      // add filter
      return [...previousFilters, filter];
    });
  };

  return (
    <View style={styles.container}>
      <TextInput label="Search" mode="outlined" onChangeText={setText} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        {searchFilters.map((filter) => (
          <Chip
            key={filter}
            selected={activeFilters.includes(filter)}
            onPress={() => {
              toggleFilter(filter);
            }}
          >
            {filter}
          </Chip>
        ))}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              onPress={() =>
                router.push({ pathname: "/Add_tasks", params: { id: item.id } })
              }
            >
              <Text style={[styles.item, item.doneStatus && styles.done]}>
                {item.name}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  empty: {
    padding: 16,
    textAlign: "center",
    color: "#666",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#22c55e",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  done: {
    textDecorationLine: "line-through",
    color: "#999",
  },
});
