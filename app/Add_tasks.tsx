import { WEEKDAYS } from "@/Constants/strings";
import { Frequency } from "@/Constants/type";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Chip, FAB, TextInput } from "react-native-paper";
import {
  deleteTaskFromTable,
  getTask,
  insertTask,
  updateTask,
} from "../db/db";

const Add_tasks = () => {
  const router = useRouter();
  const DAYS = WEEKDAYS;
  const params = useSearchParams();
  const id = params.get("id");

  // common
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");

  // routine-specific
  const [isRoutine, setIsRoutine] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [days, setDays] = useState<string>("Sun");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isArchived, setIsArcived] = useState(false);
  // other stuff
  const inputRef = useRef<any>(null);

  // useEffects
  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 300); // will not work without the timeout

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    (async () => {
      if (id) {
        const rows = await getTask(id);
        if (rows.length) { // load task
          const task: any = rows[0];
          setName(task.name);
          setDescription(task.description || "");
          setValue(task.value?.toString() || "0");
          setIsRoutine(task.is_routine === 1);
          setFrequency(task.frequency || "");
          setDays(task.days || "");
          setStartTime(task.start_time || "");
          setEndTime(task.end_time || "");
          setIsActive(task.is_active !== 0);
          setIsArcived(task.archiveStatus === 1);
        }
      }
    })();
  }, [id]);

  const saveTask = async () => {
    if (!name.trim()) return alert("Name required");
    if (frequency == "weekly" && days == "") return alert("choose a day");
    const numericValue = parseInt(value) || 9;

    if (id) {
      // UPDATE existing task
      await updateTask(
        name,
        description,
        numericValue,
        isRoutine,
        frequency,
        days,
        startTime,
        endTime,
        isActive,
        isArchived,
        id,
      );
    } else {
      // INSERT new task
      await insertTask(
        name.trim(),
        description || null,
        numericValue,
        0, // doneStatus
        isRoutine ? 1 : 0,
        isRoutine ? frequency || null : null,
        isRoutine ? days || null : null,
        isRoutine ? startTime || null : null,
        isRoutine ? endTime || null : null,
        isRoutine ? (isActive ? 1 : 0) : null,
      );
    }

    router.back();
  };

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day)
        ? prev
            .split(",")
            .filter((d) => d !== day)
            .join(",")
        : prev
          ? `${prev},${day}`
          : day,
    );
  };

  const deleteTask = () => {
    if (!id) return;
    deleteTaskFromTable(Number(id));
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Name"
        mode="outlined"
        ref={inputRef}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        label="Value"
        mode="outlined"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Text>Is Routine</Text>
        <Switch value={isRoutine} onValueChange={setIsRoutine} />
      </View>

      {isRoutine && (
        <>
          <View style={styles.chipRow}>
            <Chip
              selected={frequency === "daily"}
              onPress={() => setFrequency("daily")}
            >
              Daily
            </Chip>
            <Chip
              selected={frequency === "weekly"}
              onPress={() => setFrequency("weekly")}
            >
              Weekly
            </Chip>
          </View>

          {frequency === "weekly" && (
            <View style={styles.chipRow}>
              {DAYS.map((day) => (
                <Chip
                  key={day}
                  selected={days.includes(day)}
                  onPress={() => toggleDay(day)}
                >
                  {day}
                </Chip>
              ))}
            </View>
          )}

          <TextInput
            label="Start Time (HH:MM)"
            mode="outlined"
            value={startTime}
            onChangeText={setStartTime}
            style={styles.input}
          />
          <TextInput
            label="End Time (HH:MM)"
            mode="outlined"
            value={endTime}
            onChangeText={setEndTime}
            style={styles.input}
          />

          <View style={styles.switchRow}>
            <Text>Is Archived</Text>
            <Switch value={isArchived} onValueChange={setIsArcived} />
          </View>

          <View style={styles.switchRow}>
            <Text>Active</Text>
            <Switch value={isActive} onValueChange={setIsActive} />
          </View>
        </>
      )}
      {id && (
        <FAB
          icon="delete"
          onPress={deleteTask}
          style={[styles.fab, { bottom: 80, backgroundColor: "#ef4444" }]}
        />
      )}

      <FAB
        icon="content-save"
        label="Save"
        onPress={saveTask}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { marginBottom: 12 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#22c55e",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
});

export default Add_tasks;
