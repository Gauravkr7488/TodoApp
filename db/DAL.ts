import {
  IsoDateTime,
  MinutesSinceMidnight,
  MonthDay,
  QuadType,
  RepeatType,
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
import { arrayToCSV, stringToArray } from "./utils";

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

function mapTaskTotaskRow(task: Task): TaskRow {
  return {
    id: task.id,

    name: task.name,
    description: task.description,

    priorityValue: task.priorityValue,

    isDone: task.isDone ? 1 : 0,
    isArchived: task.isArchived ? 1 : 0,
    isActive: task.isActive ? 1 : 0,
    isOnFocus: task.isOnFocus ? 1 : 0,

    repeatType: task.repeatType,
    weekRepeat: task.weekRepeat ? arrayToCSV(task.weekRepeat) : null,
    monthRepeat: task.monthRepeat ? arrayToCSV(task.monthRepeat) : null,

    startTime: task.startTime,
    endTime: task.endTime,

    createdAt: task.createdAt,
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
  static async updateTaskData(
    name: string,
    description: string | null,
    priorityValue: QuadType | null,
    isActive: boolean,
    isArchived: boolean,
    isDone: boolean,
    isOnFocus: boolean,
    repeatType: RepeatType | null,
    weekRepeat: WeekDay[] | null,
    monthRepeat: MonthDay[] | null,
    startTime: MinutesSinceMidnight | null,
    endTime: MinutesSinceMidnight | null,
  ) {
    const task = {
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
    } as Task;
    await this.updateTask(mapTaskTotaskRow(task));
  }
  static async insertTaskDal(
    name: string,
    description: string | null,
    priorityValue: QuadType | null,
    isActive: boolean,
    isArchived: boolean,
    isDone: boolean,
    isOnFocus: boolean,
    repeatType: RepeatType | null,
    weekRepeat: WeekDay[] | null,
    monthRepeat: MonthDay[] | null,
    startTime: MinutesSinceMidnight | null,
    endTime: MinutesSinceMidnight | null,
  ) {
    const task = creatTask(
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
    await this.insertTask(mapTaskTotaskRow(task));
  }

  static async getUnarchivedTasksList(): Promise<Task[]> {
    const unarchivedTasks = await this.getUnarchivedTasks();
    return unarchivedTasks.map(mapTaskRowToTask);
  }

  static async getTaskById(id: number) {
    const task = await this.getTask(id);
    return mapTaskRowToTask(task[0]);
  }
}

function creatTask(

  name: string,
  description: string | null,

  priorityValue: QuadType | null,

  isDone: boolean,
  isArchived: boolean,
  isActive: boolean,
  isOnFocus: boolean,

  repeatType: RepeatType | null,
  weekRepeat: WeekDay[] | null,
  monthRepeat: MonthDay[] | null,

  startTime: MinutesSinceMidnight | null,
  endTime: MinutesSinceMidnight | null,

  id?: number ,

): Task {
  const iso = new Date().toISOString();
  const createdAt = toIsoDateTime(iso);
  if(!id) id = 0; 
  return {
    id,
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
    createdAt,
  };
}
