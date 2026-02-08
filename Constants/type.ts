export type Task = {
  id: number;

  name: string;
  description: string | null;

  priorityValue: QuadType | null;

  isDone: boolean;
  isArchived: boolean;
  isActive: boolean;
  isOnFocus: boolean;

  repeatType: RepeatType | null;
  weekRepeat: WeekDay[] | null;
  monthRepeat: MonthDay[] | null;

  startTime: MinutesSinceMidnight | null;
  endTime: MinutesSinceMidnight | null;

  createdAt: IsoDateTime;
};

export type TaskRow = {
  id: number;

  name: string;
  description: string | null;

  priorityValue: number | null;

  isDone: number;
  isArchived: number;
  isActive: number;
  isOnFocus: number;

  repeatType: string | null;
  weekRepeat: string | null;
  monthRepeat: string | null;

  startTime: number | null;
  endTime: number | null;

  createdAt: string;
};

/**
 * @description Should be created using `toIsoDateTime(value: string)`
 */
export type IsoDateTime = string & { readonly __brand: unique symbol };

/**
 * @description Should be created using `toQuadType(value: number)`
 */
export type QuadType = number & { readonly __brand: unique symbol };

export function toQuadType(value: number): QuadType {
  if ([1, 2, 3, 4].includes(value)) return value as unknown as QuadType;
  throw new Error(`${value} is not QuadType`);
}

export function toIsoDateTime(value: string): IsoDateTime {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid ISO datetime");
  }
  return d.toISOString() as IsoDateTime;
}

/**
 * @description Should be created using `toWeekDay(s: string)`
 */
export type WeekDay = string & { readonly __brand: unique symbol };
export function toWeekDay(s: string) {
  if (["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(s))
    return s as WeekDay;
  throw new Error(`${s} is not a WeekDay`);
}

/**
 * @description Should be created using `toRepeatType(s: string)`
 */
export type RepeatType = string & { readonly __brand: unique symbol };

export function toRepeatType(s: string): RepeatType {
  if (s === "daily" || s === "weekly" || s === "monthly") {
    return s as RepeatType;
  }
  throw new Error(`${s} is not a valid RepeatRule`);
}

export type MonthDay = number & { readonly __brand: unique symbol };

/**
 * @description Should be created using `toDayOfMonth(n: number)`
 */
export function toMonthDay(n: number): MonthDay {
  if (!Number.isInteger(n) || n < 1 || n > 31) {
    throw new Error("DayOfMonth must be between 1 and 31");
  }
  return n as MonthDay;
}

/**
 * @description Should be created using `toMinutesSinceMidnight(value: number)`
 */
export type MinutesSinceMidnight = number & { readonly __brand: unique symbol };

export function toMinutesSinceMidnight(value: number): MinutesSinceMidnight {
  if (value < 0 || value > 1439 || !Number.isInteger(value)) {
    throw new Error("Invalid MinutesSinceMidnight");
  }
  return value as MinutesSinceMidnight;
}
