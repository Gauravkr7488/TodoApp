import { WEEKDAY } from "@/Constants/strings";
import { MonthDay, RepeatType, WeekDay } from "@/Constants/type";
import { Dal } from "@/db/DAL";
import { toDDMMYYYY, formatMinutesToAMPM } from "@/db/utils";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const TaskDetailScreen = () => {
  const params = useSearchParams();
  const id = params.get("id") as unknown as number;

  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");

  const [isActive, setIsActive] = useState(false);
  const [isArchived, setIsArcived] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isOnFocus, setIsOnFocus] = useState(false);

  const [repeatType, setRepeatType] = useState<RepeatType | null>(null);
  const [weekRepeat, setWeekRepeat] = useState<WeekDay[] | null>(null);
  const [monthRepeat, setMonthRepeat] = useState<MonthDay[] | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const [creationDate, setCreationDate] = useState<string>();
  const [isRoutine, setIsRoutine] = useState(false);

  useEffect(() => {
    (async () => {
      if (id) {
        const task = await Dal.getTaskById(id);
        if (task) {
          setName(task.name);
          setDescription(task.description ?? "");

          setIsActive(task.isActive);
          setIsArcived(task.isArchived);
          setIsDone(task.isDone);
          setIsOnFocus(task.isOnFocus);

          setRepeatType(task.repeatType);
          setWeekRepeat(task.weekRepeat);
          setMonthRepeat(task.monthRepeat);
          setStartTime(task.startTime);
          setEndTime(task.endTime);

          setIsRoutine(!!task.repeatType);
          setCreationDate(toDDMMYYYY(task.createdAt));
        }
      }
    })();
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{description || "—"}</Text>
      </View>

      {creationDate && (
        <View style={styles.section}>
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.value}>{creationDate}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Routine:</Text>
        <Text style={styles.value}>{isRoutine ? "Yes" : "No"}</Text>
      </View>

      {isRoutine && repeatType && (
        <View style={styles.section}>
          <Text style={styles.label}>Repeat Type:</Text>
          <Text style={styles.value}>{repeatType}</Text>
        </View>
      )}

      {weekRepeat && weekRepeat.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Week Repeat:</Text>
          <Text style={styles.value}>
            {weekRepeat.map((d) => d).join(", ")}
          </Text>
        </View>
      )}

      {monthRepeat && monthRepeat.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Month Repeat:</Text>
          <Text style={styles.value}>
            {monthRepeat.map((d) => d).join(", ")}
          </Text>
        </View>
      )}

      {(startTime != null || endTime != null) && (
        <View style={styles.section}>
          {startTime != null && (
            <>
              <Text style={styles.label}>Start Time:</Text>
              <Text style={styles.value}>{formatMinutesToAMPM(startTime)}</Text>
            </>
          )}
          {endTime != null && (
            <>
              <Text style={styles.label}>End Time:</Text>
              <Text style={styles.value}>{formatMinutesToAMPM(endTime)}</Text>
            </>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>
          {isActive ? "Active" : "Inactive"} | {isDone ? "Done" : "Pending"} |{" "}
          {isArchived ? "Archived" : "Not Archived"} |{" "}
          {isOnFocus ? "Focused" : "Not Focused"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { marginBottom: 16 },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  value: { fontSize: 16, color: "#333" },
});

export default TaskDetailScreen;