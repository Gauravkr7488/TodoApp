import { STRINGS } from "@/Constants/strings";
import { getDB } from "./db";

export async function getFilteredTasks(filters: string[] = []) {
  const database = await getDB();
  const archiveStatus = filters.includes(STRINGS.archived) ? 1 : 0;
  const is_routine = filters.includes(STRINGS.routine) ? 1 : 0;
  return database.getAllAsync(
    `SELECT id, name, doneStatus
     FROM tasks
     WHERE archiveStatus = ? AND is_routine =?
     ORDER BY created_at DESC`,
    archiveStatus,
    is_routine,
  );
}
