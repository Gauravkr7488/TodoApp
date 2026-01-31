import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { FAB, Checkbox } from "react-native-paper";
import { initDB, getTasks, toggleDoneStatus } from "../db/db";

export default function Index() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [dbReady, setDbReady] = useState(false);

  const onToggle = async (item: any) => {
    await toggleDoneStatus(item.id, !item.status);
    setTasks((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, status: !t.status } : t)),
    );
  };

  // Ensure DB is ready on focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchTasks() {
        await initDB(); // make sure table exists
        setDbReady(true);

        if (isActive) {
          const rows = await getTasks();
          setTasks(rows);
        }
      }

      fetchTasks();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Checkbox
              status={item.status ? "checked" : "unchecked"}
              onPress={() => onToggle(item)}
            />
            <Text style={[styles.item, item.status && styles.done]}>
              {item.name}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet. Add one!</Text>
        }
      />

      <FAB
        icon="plus"
        label="Add"
        onPress={() => router.push("./add")}
        style={styles.fab}
        disabled={!dbReady} // prevent pressing before DB ready
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
