import { STRINGS } from "@/Constants/strings";
import { Task } from "@/Constants/type";
import { Dal } from "@/db/DAL";
import { toggleRoutines } from "@/db/routines";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Checkbox, FAB } from "react-native-paper";
import { Db } from "../db/db";
import Tabs from "./Components/tabs";

export default function Index() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const homeFilter = [
    STRINGS.active,
    STRINGS.all,
    STRINGS.routine,
    STRINGS.onfocus,
  ];
  const [activeTab, setActiveTab] = useState(STRINGS.active);

  useEffect(() => {  // creating db for new install
    const init = async () => {
      await Db.initDB();
    };
    init();
  }, []); 

  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        await refreshTasks();
      };
      run();
    }, [activeTab]),
  );

  const clearCompleted = async () => {
    await Db.archiveCompletedTasks();
    await refreshTasks();
  };

  const sortDoneTasks = (rows: Task[]) =>
    [...rows].sort((a, b) => Number(a.isDone) - Number(b.isDone));

  const handleCheckToggle = async (item: Task) => {
    const newStatus = Number(item.isDone) === 0 ? 1 : 0;

    await Db.toggleDoneStatus(item.id, newStatus === 1);

    setTasks((prev) =>
      sortDoneTasks(
        prev.map((t) =>
          t.id === item.id ? { ...t, isDone: Boolean(newStatus) } : t,
        ),
      ),
    );
  };

  const refreshTasks = async () => {
    // entry point of tasks
    let rows: Task[] = [];
    await toggleRoutines();

    if (activeTab == STRINGS.active) {
      let rows = await Dal.getAllActiveTasks();
      rows = rows.filter((row) => row.isArchived !== true); // only not archived
      const sorted = sortDoneTasks(rows);
      setTasks(sorted);
    }

    if (activeTab == STRINGS.all) {
      rows = await Dal.getUnarchivedTasks();
      rows = rows.filter((row) => row.isArchived !== true);
      const sorted = sortDoneTasks(rows);
      setTasks(sorted);
    }

    if (activeTab == STRINGS.routine) {
      rows = await Dal.getAllTodayRoutines();
      rows = rows.filter((row) => row.isArchived !== true);
      const sorted = sortDoneTasks(rows);
      setTasks(sorted);
    }

    if (activeTab == STRINGS.onfocus) {
      rows = await Dal.getFocusedTasks();
      rows = rows.filter((row) => row.isArchived !== true);
      const sorted = sortDoneTasks(rows);
      setTasks(sorted);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Reset everything?",
      "This will delete all tasks and routines.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await Db.resetDB();
            await refreshTasks();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Tabs
        tabs={homeFilter}
        activeTab={activeTab}
        onChange={async (value) => {
          setActiveTab(value);
        }}
      />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Checkbox
              status={item.isDone ? "checked" : "unchecked"}
              onPress={() => handleCheckToggle(item)}
            />
            <Pressable
              onPress={() => {
                if (!item.isDone) {
                  router.push({
                    pathname: "/Add_tasks",
                    params: { id: item.id },
                  });
                }
              }}
            >
              <Text style={[styles.item, item.isDone && styles.done]}>
                {item.name}
              </Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet. Add one!</Text>
        }
      />
      <FAB
        icon="delete"
        label="Clear"
        onPress={async () => await clearCompleted()}
        onLongPress={handleReset}
        style={[styles.fab, { bottom: 80 }]}
        // disabled={!dbReady}
      />

      <FAB
        icon="plus"
        label="Add"
        onPress={() => router.push("./Add_tasks")}
        style={styles.fab}
        // disabled={!dbReady} // prevent pressing before DB ready
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
