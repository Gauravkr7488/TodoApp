import CustomText from "@/Components/text";
import { useTheme } from "@/Components/ThemeContext";
import CustomView from "@/Components/view";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";
import { WEEKDAY } from "@/Constants/strings";
import {
  MinutesSinceMidnight,
  MonthDay,
  RepeatType,
  toRepeatType,
  toWeekDay,
  WeekDay,
} from "@/Constants/type";
import { Dal } from "@/db/DAL";
import { Db } from "@/db/db";
import { formatMinutesToAMPM, toDDMMYYYY, toMinutes } from "@/db/utils";
import { useNavigation, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Switch } from "react-native";
import { Chip, FAB } from "react-native-paper";
import TimePicker from "../../Components/dateTimePicker";
import HeaderMenu from "../../Components/menu";
import CustomTextInput from "@/Components/textInput";
import { Ionicons } from "@expo/vector-icons";
const Add_tasks = () => {
  const router = useRouter();
  const params = useSearchParams();

  // Task
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
  // other stuff
  const inputRef = useRef<any>(null);
  const [isRoutine, setIsRoutine] = useState(false);
  const navigation = useNavigation();
  //

  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;

  useEffect(() => {
    (async () => {
      if (id) {
        const task = await Dal.getTaskById(id);
        if (task) {
          // load task

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
        // console.log(task);
      } else {
        // autofocus logic
        const t = setTimeout(() => {
          inputRef.current?.focus();
        }, 300); // will not work without the timeout

        return () => clearTimeout(t);
      }
    })();
  }, [id]);

  const saveTask = async () => {
    if (!name.trim()) return alert("Name required");
    if (repeatType == "weekly" && !weekRepeat) return alert("choose a day");
    let newStartTime = startTime;
    let newEndTime = endTime;
    if (startTime != null && endTime == null) {
      newEndTime = 1438;
    } else if (startTime == null && endTime != null) {
      newStartTime = 1;
    }
    // console.log(isDone);

    if (id) {
      // UPDATE existing task
      await Dal.updateTaskData(
        name,
        description,
        isDone,
        isArchived,
        isActive,
        isOnFocus,
        repeatType,
        weekRepeat,
        monthRepeat,
        newStartTime,
        newEndTime,
        id,
      );
    } else {
      // INSERT new task
      await Dal.insertTaskDal(
        name,
        description,
        isDone,
        isArchived,
        isActive,
        isOnFocus,
        repeatType,
        weekRepeat,
        monthRepeat,
        newStartTime,
        newEndTime,
      );
    }

    router.replace("/(tabs)");
  };

  const toggleDay = (day: string) => {
    const weekDay = toWeekDay(day); // transform first
    if (!weekDay) return; // safety if conversion can fail

    setWeekRepeat((prev) => {
      if (!prev) prev = [];
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        id ? (
          <HeaderMenu
            items={[
              {
                title: "Delete",
                icon: "delete",
                onPress: handleDeleteTask,
              },
            ]}
          />
        ) : null,
    });
  }, [navigation, id]);

  function isEndTimeEarlierThanStartTime(inMin: MinutesSinceMidnight | null) {
    if (!startTime || !inMin) return;
    if (startTime > inMin) {
      return true;
    }
    return false;
  }

  return (
    <CustomView style={{ flex: 1, padding: 16 }}>
      <CustomTextInput
        label="Name"
        mode="outlined"
        ref={inputRef}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <CustomTextInput
        label="Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { minHeight: 120 }]}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />
      {id && (
        <CustomView
          style={{
            padding: 10,
            margin: 10,
            borderRadius: 10,
          }}
        >
          <CustomText
            style={{
              fontSize: 16,
              fontWeight: "300",
            }}
          >
            Created at - {creationDate}
          </CustomText>
        </CustomView>
      )}
      <CustomView style={styles.switchRow}>
        <CustomText>Repeate</CustomText>
        <Switch
          value={isRoutine}
          onValueChange={(value) => {
            setIsRoutine(value);
            // setRepeatType(value ? toRepeatType("daily") : null);
            setRepeatType(toRepeatType("daily"));
          }}
        />
      </CustomView>

      {isRoutine && (
        <>
          <CustomView style={styles.chipRow}>
            <Chip
              selected={repeatType === "daily"}
              onPress={() => setRepeatType(toRepeatType("daily"))}
            >
              Daily
            </Chip>
            <Chip
              selected={repeatType === "weekly"}
              onPress={() => {
                setRepeatType(toRepeatType("weekly"));
                setWeekRepeat([toWeekDay(WEEKDAY.Sun)]); // to set default
              }}
            >
              Weekly
            </Chip>
          </CustomView>
          {repeatType === "weekly" && (
            <CustomView style={styles.chipRow}>
              {Object.values(WEEKDAY).map((day) => (
                <Chip
                  key={day}
                  selected={weekRepeat?.includes(toWeekDay(day))}
                  onPress={() => toggleDay(day)}
                >
                  {day}
                </Chip>
              ))}
            </CustomView>
          )}
          <TimePicker
            labelProp="Start Time"
            value={startTime != null ? formatMinutesToAMPM(startTime) : ""}
            onChange={(time: string) => {
              const inMin = toMinutes(time);
              if (inMin == 0) {
                alert("12:00 AM cannot be selected.");
                return;
              }
              setStartTime(inMin);
            }}
          />
          <TimePicker
            labelProp="End Time"
            value={endTime != null ? formatMinutesToAMPM(endTime) : ""}
            onChange={(time: string) => {
              const inMin = toMinutes(time);
              if (inMin == 0) {
                alert("12:00 AM cannot be selected.");
                return;
              }
              if (isEndTimeEarlierThanStartTime(inMin)) {
                alert(
                  "End time must be later than the start time and cannot be in next day",
                );
                return;
              }
              setEndTime(inMin);
            }}
          />
        </>
      )}
      {/* <CustomView style={styles.switchRow}>
        <CustomText>Active</CustomText>
        <Switch value={isActive} onValueChange={setIsActive} />
      </CustomView> */}
      {/* <CustomView style={styles.switchRow}>
        <CustomText>Is Archived</CustomText>
        <Switch value={isArchived} onValueChange={setIsArcived} />
      </CustomView>
      <CustomView style={styles.switchRow}>
        <CustomText>Is Focused</CustomText>
        <Switch value={isOnFocus} onValueChange={setIsOnFocus} />
      </CustomView> */}
      <FAB
        icon={() => <Ionicons name="save" size={24} />}
        onPress={async () => {
          let isDuplicate;
          if (!id) {
            isDuplicate = await Db.isNameDuplicate(name);
          }
          if (isDuplicate) {
            Alert.alert(
              "Duplicate Name",
              "This name already exists. Proceed anyway?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Proceed", onPress: async () => await saveTask() },
              ],
            );
            return;
          }
          await saveTask();
        }}
        style={{
          position: "absolute",
          right: 32,
          bottom: 40,
          backgroundColor: theme.accent,
        }}
        color={theme.accent}
      />
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {},
  input: { marginBottom: 12 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
});

export default Add_tasks;
