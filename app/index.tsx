import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { FAB, Checkbox } from "react-native-paper";
import {
  initDB,
  getTasks,
  toggleDoneStatus,
  deleteCompletedTasks,
} from "../db/db";

export default function Index() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [dbReady, setDbReady] = useState(false);

  const clearCompleted = async () => {
    await deleteCompletedTasks();
    const rows = await getTasks();
    setTasks(sortTasks(rows));
  };

  const sortTasks = (rows: any[]) =>
    [...rows].sort((a, b) => a.doneStatus - b.doneStatus);

  const onToggle = async (item: any) => {
    const newStatus = item.doneStatus === 0 ? 1 : 0;

    await toggleDoneStatus(item.id, newStatus === 1);

    setTasks((prev) =>
      sortTasks(
        prev.map((t) =>
          t.id === item.id ? { ...t, doneStatus: newStatus } : t,
        ),
      ),
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
          setTasks(sortTasks(rows));
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
              status={item.doneStatus ? "checked" : "unchecked"}
              onPress={() => onToggle(item)}
            />
            <Text style={[styles.item, item.doneStatus && styles.done]}>
              {item.name}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet. Add one!</Text>
        }
      />
      <FAB
        icon="delete"
        label="Clear Completed"
        onPress={clearCompleted}
        style={[styles.fab, { bottom: 80 }]} // move above the Add button
        disabled={!dbReady}
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
