export type Task = {
  id: string;

  name: string;
  description: string | null;

  priorityValue: number | null;

  isDone: boolean;
  isArchived: boolean;
  isActive: boolean;
  isOnFocus: boolean;

  repeat: RepeatRule | null;

  startTime: MinutesSinceMidnight | null;
  endTime: MinutesSinceMidnight | null;

  createdAt: IsoDateTime;
};

export type IsoDateTime = string & { readonly __brand: unique symbol };

export function toIsoDateTime(value: string): IsoDateTime {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid ISO datetime");
  }
  return d.toISOString() as IsoDateTime;
}

type Weekday = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

type RepeatRule =
  | { type: "daily" }
  | { type: "weekly"; days: Weekday[] }
  | { type: "monthly"; dates: DayOfMonth[] }
  | { type: "interval"; every: number; unit: "day" | "week" | "month" };

type DayOfMonth = number & { readonly __brand: unique symbol };

export function toDayOfMonth(n: number): DayOfMonth {
  if (!Number.isInteger(n) || n < 1 || n > 31) {
    throw new Error("DayOfMonth must be between 1 and 31");
  }
  return n as DayOfMonth;
}

type MinutesSinceMidnight = number & { readonly __brand: unique symbol };

export function toMinutesSinceMidnight(value: number): MinutesSinceMidnight {
  if (value < 0 || value > 1439 || !Number.isInteger(value)) {
    throw new Error("Invalid MinutesSinceMidnight");
  }
  return value as MinutesSinceMidnight;
}
