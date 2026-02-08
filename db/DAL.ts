import {
    MonthDay,
  Task,
  TaskRow,
  toDayOfMonth,
  toIsoDateTime,
  toMinutesSinceMidnight,
  toQuadType,
  toRepeatType,
  toWeekDay,
  WeekDay,
} from "@/Constants/type";
import { getUnarchivedTasks } from "./db";
import { stringToArray } from "./utils";

export async function getUnarchivedTasksList(): Promise<Task[]> {
  const unarchivedTasks = await getUnarchivedTasks();
  return unarchivedTasks.map(mapTaskRowToTask)
}

function mapTaskRowToTask(row: TaskRow): Task {
  return {
    id: row.id,

    name: row.name,
    description: row.description,

    priorityValue: row.priorityValue ? toQuadType(row.priorityValue) : null,

    isDone: !!row.isDone,
    isArchived: !!row.isArchived,
    isActive: !!row.isActive,
    isOnFocus: !!row.isOnFocus,

    repeatType: row.repeatType ? toRepeatType(row.repeatType) : null,
    weekRepeat: row.weekRepeat ? toWeekRepeat(row.weekRepeat) : null,
    monthRepeat: row.monthRepeat ? toMonthRepeat(row.monthRepeat) : null,

    startTime: row.startTime ? toMinutesSinceMidnight(row.startTime) : null,
    endTime: row.endTime ? toMinutesSinceMidnight(row.endTime) : null,

    createdAt: toIsoDateTime(row.createdAt),
  };
}

function toWeekRepeat(s: string): WeekDay[] | null {
  const arr = stringToArray(s);
  if (!arr) return null;
  return arr.map(toWeekDay);
}

function toMonthRepeat(s: string): MonthDay[] | null {
  const arr = stringToArray(s);
  if (!arr) return null;
  return arr.map(toDayOfMonth);
}

