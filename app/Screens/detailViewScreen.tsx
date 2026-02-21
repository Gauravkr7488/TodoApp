import { WEEKDAY } from "@/Constants/strings";
import { MonthDay, RepeatType, WeekDay } from "@/Constants/type";
import { Dal } from "@/db/DAL";
import { toDDMMYYYY, formatMinutesToAMPM } from "@/db/utils";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import CustomView from "@/Components/view";
import CustomText from "../../Components/text";
import { useTheme } from "@/Components/ThemeContext";
import { darkThemeColors, lightThemeColors } from "@/Constants/Colours";

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

  const { isDark } = useTheme();
  const theme = isDark ? darkThemeColors : lightThemeColors;
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
    <CustomView style={{ flex: 1, padding: 16, borderTopColor: theme.border, borderWidth: 2 }}>
      <CustomView style={styles.section}>
        <CustomText style={styles.label}>Name:</CustomText>
        <CustomText style={styles.value}>{name}</CustomText>
      </CustomView>

      <CustomView style={styles.section}>
        <CustomText style={styles.label}>Description:</CustomText>
        <CustomText style={styles.value}>{description || "—"}</CustomText>
      </CustomView>

      {creationDate && (
        <CustomView style={styles.section}>
          <CustomText style={styles.label}>Created At:</CustomText>
          <CustomText style={styles.value}>{creationDate}</CustomText>
        </CustomView>
      )}

      <CustomView style={styles.section}>
        <CustomText style={styles.label}>Routine:</CustomText>
        <CustomText style={styles.value}>{isRoutine ? "Yes" : "No"}</CustomText>
      </CustomView>

      {isRoutine && repeatType && (
        <CustomView style={styles.section}>
          <CustomText style={styles.label}>Repeat Type:</CustomText>
          <CustomText style={styles.value}>{repeatType}</CustomText>
        </CustomView>
      )}

      {weekRepeat && weekRepeat.length > 0 && (
        <CustomView style={styles.section}>
          <CustomText style={styles.label}>Week Repeat:</CustomText>
          <CustomText style={styles.value}>
            {weekRepeat.map((d) => d).join(", ")}
          </CustomText>
        </CustomView>
      )}

      {monthRepeat && monthRepeat.length > 0 && (
        <CustomView style={styles.section}>
          <CustomText style={styles.label}>Month Repeat:</CustomText>
          <CustomText style={styles.value}>
            {monthRepeat.map((d) => d).join(", ")}
          </CustomText>
        </CustomView>
      )}

      {(startTime != null || endTime != null) && (
        <CustomView style={styles.section}>
          {startTime != null && (
            <>
              <CustomText style={styles.label}>Start Time:</CustomText>
              <CustomText style={styles.value}>
                {formatMinutesToAMPM(startTime)}
              </CustomText>
            </>
          )}
          {endTime != null && (
            <>
              <CustomText style={styles.label}>End Time:</CustomText>
              <CustomText style={styles.value}>
                {formatMinutesToAMPM(endTime)}
              </CustomText>
            </>
          )}
        </CustomView>
      )}

      <CustomView style={styles.section}>
        <CustomText style={styles.label}>Status:</CustomText>
        <CustomText style={styles.value}>
          {isActive ? "Active" : "Inactive"} | {isDone ? "Done" : "Pending"} |{" "}
          {isArchived ? "Archived" : "Not Archived"} |{" "}
          {isOnFocus ? "Focused" : "Not Focused"}
        </CustomText>
      </CustomView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {},
  section: { marginBottom: 16 },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  value: { fontSize: 16 },
});

export default TaskDetailScreen;
