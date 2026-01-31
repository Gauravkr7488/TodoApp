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
      value INTEGER NOT NULL DEFAULT 9,
      doneStatus INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
      
      );
      
  `);
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
  description: string,
  value: number,
) {
  const database = await getDB();
  return database.runAsync(
    `INSERT INTO tasks (name, description, value, created_at)
     VALUES (?, ?, ?, ?)`,
    name,
    description,
    value,
    Date.now(),
  );
}

export async function getTasks() {
  const database = await getDB();
  return database.getAllAsync(
    "SELECT id, name, doneStatus FROM tasks ORDER BY created_at DESC",
  );
}

export async function deleteCompletedTasks() {
  const database = await getDB();
  return database.runAsync(`DELETE FROM tasks WHERE doneStatus = 1`);
}
