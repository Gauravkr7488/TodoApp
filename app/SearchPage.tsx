import { STRINGS } from "@/Constants/strings";
import { Dal } from "@/db/DAL";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Chip, TextInput } from "react-native-paper";

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [includeFilters, setIncludeFilters] = useState<string[]>([]);
  const [excludeFilters, setExcludeFilters] = useState<string[]>([]);
  const searchFilters = [STRINGS.archived, STRINGS.routine];
  // const [vState, setVstate] = useState("none");
  const refreshTasks = async (
    includeFilters: string[],
    excludeFilters: string[],
  ) => {
    const tasks = await Dal.getFilteredTasks(includeFilters, excludeFilters);
    setTasks(tasks);
  };
  useEffect(() => {
    refreshTasks(includeFilters, excludeFilters);
  }, [includeFilters]);

  // const toggleFilter = (filter: string) => {
  //   setIncludeFilters((previousFilters) => {
  //     const isActive = previousFilters.includes(filter);

  //     if (isActive) {
  //       // remove filter
  //       return previousFilters.filter(
  //         (existingFilter) => existingFilter !== filter,
  //       );
  //     }

  //     // add filter
  //     return [...previousFilters, filter];
  //   });
  // };

  const toggleFilter = (filter: string) => {
    if (includeFilters.includes(filter)) {
      // move include → exclude
      setIncludeFilters((prev) => prev.filter((f) => f !== filter));
      setExcludeFilters((prev) => [...prev, filter]);
      return;
    }

    if (excludeFilters.includes(filter)) {
      // remove from exclude → none
      setExcludeFilters((prev) => prev.filter((f) => f !== filter));
      return;
    }

    // none → include
    setIncludeFilters((prev) => [...prev, filter]);
  };
  return (
    <View style={styles.container}>
      <TextInput label="Search" mode="outlined" onChangeText={setText} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        {searchFilters.map((filter) => (
          <Chip
            key={filter}
            icon={
              includeFilters.includes(filter)
                ? "check"
                : excludeFilters.includes(filter)
                  ? "close"
                  : undefined
            }
            // selected={vState === "include" || vState === "exclude"}
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
