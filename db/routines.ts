import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  archiveTask,
  getAllRoutinedTasks,
  getTask,
  matchWeekDay,
  unarchiveDailyRoutines,
  unarchiveTask,
  unarchiveWeeklyRoutines,
} from "./db";

const UNARCHIVE_KEY = "last_unarchive_date";

export async function unarchiveRoutines() {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  await toggleTimedTasks(today);
  const lastRun = await AsyncStorage.getItem(UNARCHIVE_KEY);

  if (!lastRun) {
    await AsyncStorage.setItem(UNARCHIVE_KEY, todayISO);
    return;
  }

  if (lastRun === todayISO) return;

  await unarchiveDailyRoutines();

  // weekly logic
  const cursor = new Date(lastRun);
  cursor.setDate(cursor.getDate() + 1);

  while (cursor <= today) {
    const day = cursor.toLocaleDateString("en-US", { weekday: "short" });
    await unarchiveWeeklyRoutines(day);
    cursor.setDate(cursor.getDate() + 1);
  }

  await AsyncStorage.setItem(UNARCHIVE_KEY, todayISO);
}

async function toggleTimedTasks(today: Date) {
  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  const tasks = (await getAllRoutinedTasks()) as any[];

  for (const task of tasks) {
    if (!task.start_time || !task.end_time) continue;

    const start = toMinutes(task.start_time);
    const end = toMinutes(task.end_time);

    await unarchiveActiveTasks(nowMinutes, start, end, task, today);
    await archiveNonActiveTasks(nowMinutes, end, task);
  }
}

async function archiveNonActiveTasks(
  nowMinutes: number,
  end: number,
  task: any,
) {
  if (nowMinutes > end) { // edge case 
    await archiveTask(task.id); // function to archive single task
  }
}

async function unarchiveActiveTasks(
  nowMinutes: number,
  start: number,
  end: number,
  task: any,
  today: Date,
) {
  if (nowMinutes < start || nowMinutes > end) return; // not active

  if (task.frequency !== "weekly") {
    await unarchiveTask(task.id); // unarchive non-weekly tasks
  } else {
    const day = today.toLocaleDateString("en-US", { weekday: "short" });
    if (await matchWeekDay(day, task.id)) {
      await unarchiveTask(task.id); // only unarchive weekly task if today matches
    }
  }
}


function toMinutes(time12h: string) {
  // "02:30 PM"
  const [t, meridiem] = time12h.trim().split(" ");
  let [h, m] = t.split(":").map(Number);

  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;

  return h * 60 + m;
}
