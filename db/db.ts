import { STRINGS } from "@/Constants/strings";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("app.db");
  }
  return db;
}

export async function initDB() {
  const database = await getDB();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,

      -- task fields
      value INTEGER NOT NULL DEFAULT 9,
      doneStatus INTEGER NOT NULL DEFAULT 0,
      archiveStatus INTEGER NOT NULL DEFAULT 0,

      -- routine fields (NULL = normal task)
      is_routine INTEGER NOT NULL DEFAULT 0,
      frequency TEXT,
      days TEXT,
      start_time TEXT,
      end_time TEXT,
      is_active INTEGER,

      created_at INTEGER NOT NULL
    );

  `);

  await database.execAsync(``);
}

export async function toggleDoneStatus(taskId: number, doneStatus: boolean) {
  const database = await getDB();
  return database.runAsync(
    `UPDATE tasks SET doneStatus = ? WHERE id = ?`,
    doneStatus ? 1 : 0,
    taskId,
  );
}

export async function insertTask(
  name: string,
  description: string | null = null,

  // task fields
  value: number = 9,
  doneStatus: number = 0,

  // routine fields
  is_routine: number = 0,
  frequency: string | null = null,
  days: string | null = null,
  start_time: string | null = null,
  end_time: string | null = null,
  is_active: number | null = null,
) {
  const database = await getDB();
  return database.runAsync(
    `INSERT INTO tasks (
      name,
      description,
      value,
      doneStatus,
      is_routine,
      frequency,
      days,
      start_time,
      end_time,
      is_active,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    name,
    description,
    value,
    doneStatus,
    is_routine,
    frequency,
    days,
    start_time,
    end_time,
    is_active,
    Date.now(),
  );
}

export async function getTasks(filters: string[] = []) {
  const database = await getDB();
  return database.getAllAsync(
    `SELECT id, name, doneStatus
     FROM tasks
     ORDER BY created_at DESC`,
  );
}

export async function archiveCompletedTasks() {
  const database = await getDB();
  return database.runAsync(
    `UPDATE tasks
     SET archiveStatus = 1
     WHERE doneStatus = 1 AND archiveStatus = 0`,
  );
}

export async function resetDB() {
  const database = await getDB();
  await database.execAsync(`
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS routines;
  `);
  await initDB();
}

export async function unarchiveDailyRoutines() {
  const db = await getDB();

  await db.runAsync(`
  UPDATE tasks
  SET archiveStatus = 0, doneStatus = 0
  WHERE is_routine = 1
    AND frequency = 'daily'
  `);
}

export async function unarchiveWeeklyRoutines() {
  const db = await getDB();
  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "short" }); // Mon

  await db.runAsync(
    `
    UPDATE tasks
    SET archiveStatus = 0, doneStatus = 0
    WHERE is_routine = 1
      AND frequency = 'weekly'
      AND days LIKE ?
    `,
    `%${day}%`,
  );
}

export async function deleteTaskFromTable(id: number) {
  const db = await getDB();

  await db.runAsync(`DELETE FROM tasks WHERE id = ?`, id);
}
