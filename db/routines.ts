import { Task } from "@/Constants/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dal } from "./DAL";
import { Db } from "./db";

const UNARCHIVE_KEY = "last_unarchive_date";

async function unarchiveRoutinesForToday() {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  // await toggleTimedTasks(today);
  const lastRun = await AsyncStorage.getItem(UNARCHIVE_KEY);

  if (!lastRun) {
    await AsyncStorage.setItem(UNARCHIVE_KEY, todayISO);
    return;
  }

  if (lastRun === todayISO) return;

  await Db.unarchiveDailyRoutines();

  // weekly logic
  const cursor = new Date(lastRun);
  cursor.setDate(cursor.getDate() + 1);

  while (cursor <= today) {
    const day = cursor.toLocaleDateString("en-US", { weekday: "short" });
    await Db.unarchiveWeeklyRoutinesDB(day);
    cursor.setDate(cursor.getDate() + 1);
  }

  await AsyncStorage.setItem(UNARCHIVE_KEY, todayISO);
}

export async function toggleRoutines() {
  await unarchiveRoutinesForToday(); // goes in all and routines
  
  const today = new Date();
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  await Db.toggleTimedTasks(nowMinutes);

  // const tasks = await Dal.getRoutines();

  // if it is marked daily and its not done yet
  // if its weekly and today is the day
  // if its in the time range
  // for (const task of tasks) {
  //   if (!task.startTime || !task.endTime) continue;
  //   await unarchiveActiveTasks(
  //     nowMinutes,
  //     task.startTime,
  //     task.endTime,
  //     task,
  //     today,
  //   );
  //   await archiveNonActiveTasks(nowMinutes, task.endTime, task);
  // }
}

// async function toggleTimedTasks() {
//   const today = new Date();
//   const nowMinutes = today.getHours() * 60 + today.getMinutes();

//   await toggleUnarchivedTasks(nowMinutes)
// }
async function archiveNonActiveTasks(
  nowMinutes: number,
  end: number,
  task: Task,
) {
  if (nowMinutes > end) {
    // edge case
    await Db.archiveTask(task.id); // function to archive single task
  }
}

async function unarchiveActiveTasks(
  nowMinutes: number,
  start: number,
  end: number,
  task: Task,
  today: Date,
) {
  if (nowMinutes < start || nowMinutes > end) return; // not active

  if (task.repeatType !== "weekly") {
    await Db.unarchiveTask(task.id); // unarchive non-weekly tasks
  } else {
    const day = today.toLocaleDateString("en-US", { weekday: "short" });
    // if (await matchWeekDay(day, task.id)) { // this is faulty anyways
    //   await Db.unarchiveTask(task.id); // only unarchive weekly task if today matches
    // }
  }
}
