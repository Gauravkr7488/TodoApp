import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  // cashing causes freezing issues android kills db in bg
  return await SQLite.openDatabaseAsync("app.db");
}

async function initDB() {
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
  await database.runAsync(
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
  await database.runAsync(
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

export async function getUnarchivedTasks() {
  const database = await getDB();
  return database.getAllAsync(
    `SELECT id, name, doneStatus
     FROM tasks
     WHERE archiveStatus = 0
     ORDER BY created_at DESC`,
  );
}

export async function archiveCompletedTasks() {
  const database = await getDB();
  await database.runAsync(
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

export async function unarchiveDailyRoutines() { // issue
  const db = await getDB();

  await db.runAsync(`
  UPDATE tasks
  SET archiveStatus = 0, doneStatus = 0
  WHERE is_routine = 1
    AND frequency = 'daily'
  `);
}

export async function unarchiveTask(id: string) {
  const db = await getDB();

  await db.runAsync(
    `
  UPDATE tasks
  SET archiveStatus = 0, doneStatus = 0
  WHERE id = ?
  `,
    id,
  );
}

export async function unarchiveWeeklyRoutines(day: string) {
  // TODO days should not be stored like this
  const db = await getDB();
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
export async function updateTask(
  name: string,
  description: string,
  numericValue: number,
  isRoutine: boolean,
  frequency: string,
  days: string,
  startTime: string,
  endTime: string,
  isActive: boolean,
  isArchived: boolean,
  id: string,
) {
  const db = await getDB();
  await db.runAsync(
    `UPDATE tasks SET 
        name = ?, description = ?, value = ?, 
        is_routine = ?, frequency = ?, days = ?, 
        start_time = ?, end_time = ?, is_active = ? ,
        archiveStatus = ?
       WHERE id = ?`,
    name.trim(),
    description || null,
    numericValue,
    isRoutine ? 1 : 0,
    isRoutine ? frequency || null : null,
    isRoutine ? days || null : null,
    isRoutine ? startTime || null : null,
    isRoutine ? endTime || null : null,
    isRoutine ? (isActive ? 1 : 0) : null,
    isArchived ? 1 : 0,
    Number(id),
  );
}
export async function getTask(id: string) {
  const db = await getDB();
  return await db.getAllAsync("SELECT * FROM tasks WHERE id = ?", Number(id));
}

export async function getAllRoutinedTasks() {
  const db = await getDB();
  return await db.getAllAsync(`SELECT * FROM tasks WHERE is_routine = 1`);
}

export async function archiveTask(id: string) {
  const db = await getDB();

  await db.runAsync(
    `
    UPDATE tasks
    SET archiveStatus = 1
    WHERE id = ?
    `,
    id,
  );
}

export async function matchWeekDay(day: string, id: string) {
  const db = await getDB();

  const result = await db.getAllAsync(
    `
    SELECT 1
    FROM tasks
    WHERE id = ?
      AND frequency = 'weekly'
      AND days LIKE ?
    `,
    [id, `%${day}%`],
  );

  return !!result; // true if a row exists, false otherwise
}
