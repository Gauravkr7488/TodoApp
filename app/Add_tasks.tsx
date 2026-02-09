import { WEEKDAY } from "@/Constants/strings";
import {
  MinutesSinceMidnight,
  MonthDay,
  QuadType,
  RepeatType,
  toMinutesSinceMidnight,
  toMonthDay,
  toQuadType,
  toRepeatType,
  toWeekDay,
  WeekDay,
} from "@/Constants/type";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Chip, FAB, TextInput } from "react-native-paper";
import TimePicker from "./Components/dateTimePicker";
import { Dal } from "@/db/DAL";
import { Db } from "@/db/db";

const Add_tasks = () => {
  const router = useRouter();
  const params = useSearchParams();

  // Task
  const id = params.get("id") as unknown as number;

  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");

  const [priorityValue, setPriorityValue] = useState<QuadType>(toQuadType(1));

  const [isActive, setIsActive] = useState(true);
  const [isArchived, setIsArcived] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isOnFocus, setIsOnFocus] = useState(false);

  const [repeatType, setRepeatType] = useState<string>("");
  const [weekRepeat, setWeekRepeat] = useState<WeekDay[] | null>(null);
  const [monthRepeat, setMonthRepeat] = useState<MonthDay[]>([]);

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  // other stuff
  const inputRef = useRef<any>(null);
  const [isRoutine, setIsRoutine] = useState(false);
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
        const task = await Dal.getTaskById(id);
        if (task) {
          // load task

          setName(task.name);
          setDescription(task.description ?? "");

          setPriorityValue(task.priorityValue ?? toQuadType(1));

          setIsActive(task.isActive);
          setIsArcived(task.isArchived);
          setIsDone(task.isDone);
          setIsOnFocus(task.isOnFocus);

          setRepeatType(task.repeatType?.toString() ?? "");
          setWeekRepeat(task.weekRepeat ?? []);
          setMonthRepeat(task.monthRepeat ?? []);
          setStartTime(task.startTime?.toString() || "");
          setEndTime(task.endTime?.toString() || "");
        }
      }
    })();
  }, [id]);

  const saveTask = async () => {
    if (!name.trim()) return alert("Name required");
    if (repeatType == "weekly" && !weekRepeat) return alert("choose a day");
    const numericValue = priorityValue;

    if (id) {
      // UPDATE existing task
      await Dal.updateTaskData(
        name,
        description,
        priorityValue,
        isActive,
        isArchived,
        isDone,
        isOnFocus,
        repeatType,
        weekRepeat,
        monthRepeat,
        startTime,
        endTime,
      );
    } else {
      // INSERT new task
      await Dal.insertTaskDal(
        name,
        description,
        priorityValue,
        isActive,
        isArchived,
        isDone,
        isOnFocus,
        repeatType,
        weekRepeat,
        monthRepeat,
        startTime,
        endTime,
      );
    }

    router.back();
  };

  const toggleDay = (day: string) => {
    const weekDay = toWeekDay(day); // transform first
    if (!weekDay) return; // safety if conversion can fail

    setWeekRepeat((prev = []) => {
      if(!prev) throw new Error("week error");
      const alreadySelected = prev.includes(weekDay);

      if (alreadySelected) {
        return prev.filter((d) => d !== weekDay);
      }

      return [...prev, weekDay];
    });
  };

  const handleDeleteTask = () => {
    if (!id) return;
    Db.deleteTask(id);
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
        value={priorityValue.toString()}
        onChangeText={(text) => setPriorityValue(toQuadType(parseInt(text)))}
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
              selected={repeatType === "daily"}
              onPress={() => setRepeatType(toRepeatType("daily"))}
            >
              Daily
            </Chip>
            <Chip
              selected={repeatType === "weekly"}
              onPress={() => setRepeatType(toRepeatType("weekly"))}
            >
              Weekly
            </Chip>
          </View>
          {repeatType === "weekly" && (
            <View style={styles.chipRow}>
              {Object.values(WEEKDAY).map((day) => (
                <Chip
                  key={day}
                  selected={weekRepeat?.includes(toWeekDay(day))}
                  onPress={() => toggleDay(day)}
                >
                  {day}
                </Chip>
              ))}
            </View>
          )}
          <TimePicker
            labelProp="Start Time"
            value={startTime?.toString() || ""}
            onChange={setStartTime}
          />
          <TimePicker
            labelProp="End Time"
            value={endTime?.toString() || ""}
            onChange={setEndTime}
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
          onPress={handleDeleteTask}
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
