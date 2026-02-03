import AsyncStorage from "@react-native-async-storage/async-storage";
import { unarchiveDailyRoutines, unarchiveWeeklyRoutines } from "./db";

const UNARCHIVE_KEY = "last_unarchive_date";

export async function unarchiveRoutines() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const lastRun = await AsyncStorage.getItem(UNARCHIVE_KEY);

  if (lastRun === today) return;

  await unarchiveDailyRoutines();
  await unarchiveWeeklyRoutines();

  await AsyncStorage.setItem(UNARCHIVE_KEY, today);
}
