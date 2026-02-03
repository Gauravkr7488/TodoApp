import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Switch, Text } from "react-native";
import { Chip, FAB, TextInput } from "react-native-paper";
import { getDB, initDB, insertTask } from "../db/db";
import { useSearchParams } from "expo-router/build/hooks";

const Add_tasks = () => {
  const router = useRouter();
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const params = useSearchParams();
  const id = params.get("id");

  // common
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [dbReady, setDbReady] = useState(false);

  // routine-specific
  const [isRoutine, setIsRoutine] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [days, setDays] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);

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
      await initDB();
      setDbReady(true);

      if (id) {
        const db = await getDB();
        const rows = await db.getAllAsync(
          "SELECT * FROM tasks WHERE id = ?",
          Number(id),
        );
        if (rows.length) {
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
        }
      }
    })();
  }, [id]);

  const saveTask = async () => {
    if (!name.trim()) return alert("Name required");

    const numericValue = parseInt(value) || 9;

    const db = await getDB();

    if (id) {
      // UPDATE existing task
      await db.runAsync(
        `UPDATE tasks SET 
        name = ?, description = ?, value = ?, 
        is_routine = ?, frequency = ?, days = ?, 
        start_time = ?, end_time = ?, is_active = ? 
       WHERE id = ?`,
        name.trim(),
        description || null,
        numericValue,
        isRoutine ? 1 : 0,
        isRoutine ? frequency || null : null,
        isRoutine ? days || null : null,
        isRoutine ? startTime || null : null,
        isRoutine ? endTime || null : null,
        isRoutine ? (isActive ? 1 : 0) : null,
        Number(id),
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
            <Text>Active</Text>
            <Switch value={isActive} onValueChange={setIsActive} />
          </View>
        </>
      )}

      <FAB
        icon="content-save"
        label="Save"
        onPress={saveTask}
        disabled={!dbReady}
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
