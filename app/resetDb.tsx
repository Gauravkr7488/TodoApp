import { resetDB } from "@/db/db";
import { View, Text, Button, Alert, StyleSheet } from "react-native";

export default function Reset() {
  const handleReset = async () => {
    Alert.alert(
      "Reset Database",
      "This will delete all data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetDB();
            Alert.alert("Done", "Database reset successfully");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Database Reset</Text>
      <Button title="Reset Database" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 16,
  },
});
