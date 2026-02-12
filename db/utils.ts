import { MinutesSinceMidnight, toMinutesSinceMidnight } from "@/Constants/type";

/**
 * @description for a comma seperated strings only
 */
export function stringToArray(s: string): any[] {
  if (!s) return []; // handle empty string
  return s.split(",").map((item) => item.trim());
}

export function arrayToCSV(arr: any[]): string {
  return arr.join(",");
}

export function toMinutes(time12h: string) {
  const [t, meridiemRaw] = time12h.trim().split(/\s+/);
  let meridiem;
  try {
    meridiem = meridiemRaw.toLowerCase();
  } catch (error) {
    return null;
  }
  let [h, m] = t.split(":").map(Number);

  if (meridiem === "pm" && h !== 12) h += 12;
  if (meridiem === "am" && h === 12) h = 0;

  let time = h * 60 + m;
  return toMinutesSinceMidnight(time);
}

export function formatMinutesToAMPM(n: number) {
  const minutes = toMinutesSinceMidnight(n);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minStr = m.toString().padStart(2, "0");
  return `${hour12}:${minStr} ${period}`;
}