import AddButton from "@/Components/addButton";
import ClearButton from "@/Components/clearButton";
import { useTheme } from "@/Components/ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";
import { Task } from "@/Constants/type";
import { Dal } from "@/db/DAL";
import { toggleRoutines } from "@/db/routines";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";
import CustomText from "../../Components/text";
import { Db } from "../../db/db";
import CustomView from "@/Components/view";
export default function Index() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
  useEffect(() => {
    // creating db for new install
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
    await toggleRoutines();

    let rows = await Dal.getAllActiveTasks();
    rows = rows.filter((row) => row.isArchived !== true); // only not archived
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
    <CustomView
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      <CustomView
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CustomView
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
                // onPress={() => {
                //   router.push({
                //     pathname: "/Screens/detailViewScreen",
                //     params: { id: item.id },
                //   });
                // }}
                onLongPress={() => {
                  if (!item.isDone) {
                    router.push({
                      pathname: "/Screens/Add_tasks",
                      params: { id: item.id },
                    });
                  }
                }}
              >
              <CustomText style={[styles.item, item.isDone && styles.done]}>
                {item.name}
              </CustomText>
              </Pressable>
              <Checkbox
                status={item.isDone ? "checked" : "unchecked"}
                onPress={() => handleCheckToggle(item)}
              />
            </CustomView>
          )}
          ListEmptyComponent={
            <CustomText style={styles.empty}>No tasks yet. Add one!</CustomText>
          }
        />
        <ClearButton
          onPress={async () => await clearCompleted()}
          onLongPress={handleReset}
        />
        <AddButton onPress={() => router.push("/Screens/Add_tasks")} />
      </CustomView>
    </CustomView>
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
    // backgroundColor: "#7ec598ff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  done: {
    textDecorationLine: "line-through",
    // color: "#999",
  },
});
