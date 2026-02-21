import { Tab, Task } from "@/Constants/type";
import { Dal } from "@/db/DAL";
import { toggleRoutines } from "@/db/routines";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { Checkbox, FAB } from "react-native-paper";
import { Db } from "../../db/db";
import ClearButton from "@/Components/clearButton";
import AddButton from "@/Components/addButton";
import AppText from "../../Components/text";
import { useTheme } from "@/Components/ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";

export default function taskListScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        await refreshTasks();
      };
      run();
    }, []),
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

    rows = await Dal.getUnarchivedTasks();
    rows = rows.filter((row) => row.isArchived !== true);
    const sorted = sortDoneTasks(rows);
    setTasks(sorted);
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
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: theme.background,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                padding: 5,
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  router.push({
                    pathname: "/Screens/detailViewScreen",
                    params: { id: item.id },
                  });
                }}
                onLongPress={() => {
                  if (!item.isDone) {
                    router.push({
                      pathname: "/Screens/Add_tasks",
                      params: { id: item.id },
                    });
                  }
                }}
              >
                <AppText style={[styles.item, item.isDone && styles.done]}>
                  {item.name}
                </AppText>
              </Pressable>
              <Checkbox
                status={item.isDone ? "checked" : "unchecked"}
                onPress={() => handleCheckToggle(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <AppText style={styles.empty}>No tasks yet. Add one!</AppText>
          }
        />
        <ClearButton
          onPress={async () => await clearCompleted()}
          onLongPress={handleReset}
        />
        <AddButton onPress={() => router.push("/Screens/Add_tasks")} />
      </View>
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
    // borderBottomWidth: 1,
    // borderColor: "#ddd",
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
    backgroundColor: "#7ec598ff",
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
