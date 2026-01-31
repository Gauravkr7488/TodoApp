import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { initDB, getTasks } from "../db/db";

export default function Index() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [dbReady, setDbReady] = useState(false);

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
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
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
});
