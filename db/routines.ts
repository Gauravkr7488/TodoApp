import AsyncStorage from "@react-native-async-storage/async-storage";
import { unarchiveDailyRoutines, unarchiveWeeklyRoutines } from "./db";

const UNARCHIVE_KEY = "last_unarchive_date";

export async function unarchiveRoutines() {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  const lastRun = await AsyncStorage.getItem(UNARCHIVE_KEY);

  if (!lastRun || lastRun === todayISO) return;

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
