import {
  MonthDay,
  Task,
  TaskRow,
  toIsoDateTime,
  toMinutesSinceMidnight,
  toMonthDay,
  toQuadType,
  toRepeatType,
  toWeekDay,
  WeekDay,
} from "@/Constants/type";
import { Db } from "./db";
import { stringToArray } from "./utils";

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
  return arr.map(toMonthDay);
}

export class Dal extends Db {
  static async getUnarchivedTasksList(): Promise<Task[]> {
    const unarchivedTasks = await this.getUnarchivedTasks();
    return unarchivedTasks.map(mapTaskRowToTask);
  }

  static async getTaskById(id: number){
    const task = await this.getTask(id)
    return mapTaskRowToTask(task[0]);
  }
}
