import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { FAB, TextInput } from "react-native-paper";
import { initDB, insertTask } from "../db/db";

const Add_tasks = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      await initDB(); // ensure table exists
      setDbReady(true); // mark DB as ready
    }
    setup();
  }, []);

  const saveTask = async () => {
    if (!dbReady) return; // wait for DB
    if (!name || !value) return alert("Name and value are required");

    const numericValue = parseInt(value) || 0;
    await insertTask(name, description, numericValue);

    // clear fields if needed
    setName("");
    setDescription("");
    setValue("");

    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Task Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Task Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        label="Task Value"
        mode="outlined"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={styles.input}
      />
      <FAB
        icon="content-save"
        onPress={saveTask}
        style={styles.fab}
        disabled={!dbReady}
        label="Save"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
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
