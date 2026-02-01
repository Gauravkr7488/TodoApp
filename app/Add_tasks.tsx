import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Switch, Text } from "react-native";
import { FAB, TextInput } from "react-native-paper";
import { initDB, insertTask } from "../db/db";

const Add_tasks = () => {
  const router = useRouter();

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

  useEffect(() => {
    (async () => {
      await initDB();
      setDbReady(true);
    })();
  }, []);

  const saveTask = async () => {
    if (!name.trim()) return alert("Name required");

    await insertTask(
      name.trim(),
      description || null,
      parseInt(value) || 9,
      0, // doneStatus
      isRoutine ? 1 : 0,
      isRoutine ? frequency || null : null,
      isRoutine ? days || null : null,
      isRoutine ? startTime || null : null,
      isRoutine ? endTime || null : null,
      isRoutine ? (isActive ? 1 : 0) : null,
    );

    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput label="Name" mode="outlined" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Description" mode="outlined" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput label="Value" mode="outlined" value={value} onChangeText={setValue} keyboardType="numeric" style={styles.input} />

      <View style={styles.switchRow}>
        <Text>Is Routine</Text>
        <Switch value={isRoutine} onValueChange={setIsRoutine} />
      </View>

      {isRoutine && (
        <>
          <TextInput label="Frequency (daily / weekly)" mode="outlined" value={frequency} onChangeText={setFrequency} style={styles.input} />
          <TextInput label="Days (mon,tue,…)" mode="outlined" value={days} onChangeText={setDays} style={styles.input} />
          <TextInput label="Start Time (HH:MM)" mode="outlined" value={startTime} onChangeText={setStartTime} style={styles.input} />
          <TextInput label="End Time (HH:MM)" mode="outlined" value={endTime} onChangeText={setEndTime} style={styles.input} />

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
});

export default Add_tasks;
