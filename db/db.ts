import { STRINGS } from "@/Constants/strings";
import { TaskRow } from "@/Constants/type";
import * as SQLite from "expo-sqlite";
import { AppState, AppStateStatus } from "react-native";

export class Db {
  // private static async getDB() {
  //   const db = await SQLite.openDatabaseAsync("app.db");
  //   if (!db) throw new Error("DB not initialized");
  //   return db;    const db: SQLite.SQLiteDatabase

  //   // return await SQLite.opend("app.db");
  // }
  // private static async getDB() {
  //   try {
  //     const db = await SQLite.openDatabaseAsync("app.db");
  //     return db;
  //   } catch (e: unknown) {
  //     console.error("Failed to open DB:", e);
  //     throw new Error(e instanceof Error ? e.message : String(e));
  //   }
  // }
  public static attachAppStateListener() {
    AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          // Reopen DB if app resumed
          // await TaskDB.ensureDB();
          this.db = await SQLite.openDatabaseAsync("app.db");
        }
      },
    );
  }

  private static db: SQLite.SQLiteDatabase | null = null;

  private static async getDB() {
    if (this.db) return this.db;
    try {
      this.db = await SQLite.openDatabaseAsync("app.db");
      return this.db;
    } catch (e: unknown) {
      console.error("Failed to open DB:", e);
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  private static async initDB() {
    const db = await this.getDB();
    await db.execAsync(
      `
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS TASKS (
            id INTEGER PRIMARY KEY,
            
            name TEXT NOT NULL,
            description TEXT,

            priorityValue INTEGER,

            isDone INTEGER NOT NULL,
            isArchived INTEGER NOT NULL,
            isActive INTEGER NOT NULL,
            isOnFocus INTEGER NOT NULL,

            repeatType TEXT,
            weekRepeat TEXT,
            monthRepeat TEXT,

            startTime INTEGER,
            endTime INTEGER,
            
            createdAt TEXT NOT NULL
        );

      `,
    );
  }

  static async toggleDoneStatus(taskId: number, doneStatus: boolean) {
    const database = await this.getDB();
    await database.runAsync(
      `UPDATE tasks SET isDone = ? WHERE id = ?`,
      doneStatus ? 1 : 0,
      taskId,
    );
  }

  protected static async insertTask(task: TaskRow) {
    const db = await this.getDB();
    await db.runAsync(
      `
        INSERT INTO TASKS (
          name,
          description,
          priorityValue,
          isDone,
          isArchived,
          isActive,
          isOnFocus,
          repeatType,
          weekRepeat,
          monthRepeat,
          startTime,
          endTime,
          createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      task.name,
      task.description,
      task.priorityValue,
      task.isDone,
      task.isArchived,
      task.isActive,
      task.isOnFocus,
      task.repeatType,
      task.weekRepeat,
      task.monthRepeat,
      task.startTime,
      task.endTime,
      task.createdAt, // todo
    );
  }
  protected static async updateTask(task: TaskRow) {
    const db = await this.getDB();
    await db.runAsync(
      `
       UPDATE TASKS
        SET
          name = ?,
          description = ?,
          priorityValue = ?,
          isDone = ?,
          isArchived = ?,
          isActive = ?,
          isOnFocus = ?,
          repeatType = ?,
          weekRepeat = ?,
          monthRepeat = ?,
          startTime = ?,
          endTime = ?
        WHERE id = ?;

      `,
      task.name,
      task.description,
      task.priorityValue,
      task.isDone,
      task.isArchived,
      task.isActive,
      task.isOnFocus,
      task.repeatType,
      task.weekRepeat,
      task.monthRepeat,
      task.startTime,
      task.endTime,
      task.id,
    );
    console.log(task);
  }

  static async archiveCompletedTasks() {
    const database = await this.getDB();
    await database.runAsync(
      `UPDATE TASKS
     SET isArchived = 1
     WHERE isDone = 1 AND isArchived = 0`,
    );
  }
  static async unarchiveDailyRoutines() {
    const db = await this.getDB();
    await db.runAsync(`
      UPDATE TASKS
      SET isArchived = 0, isDone = 0
      WHERE repeatType = 'daily'
    `);
  }
  static async resetDB() {
    // For testing
    const database = await this.getDB();
    await database.execAsync(`DROP TABLE IF EXISTS TASKS;`);
    await this.initDB();
  }

  protected static async getUnarchivedTasks() {
    const database = await this.getDB();
    return database.getAllAsync<TaskRow>(
      `SELECT *
     FROM TASKS
     WHERE isArchived = 0`,
    );
  }

  protected static async getTask(id: number) {
    const db = await this.getDB();
    return await db.getAllAsync<TaskRow>(
      "SELECT * FROM TASKS WHERE id = ?",
      Number(id),
    );
  }

  public static async deleteTask(id: number) {
    const db = await this.getDB();
    return await db.runAsync(`DELETE FROM TASKS WHERE id = ?`, id);
  }

  public static async unarchiveWeeklyRoutinesDB(day: string) {
    const db = await this.getDB();
    await db.runAsync(
      `
        UPDATE TASKS
        SET isArchived = 0, isDone = 0
        WHERE repeatType = 'weekly' AND weekRepeat LIKE ?
      `,
      [`%${day}%`],
    );
  }

  protected static async getRepeatTypeRows() {
    const db = await this.getDB();
    return db.getAllAsync<TaskRow>(`
        SELECT * FROM TASKS
        WHERE repeatType IS NOT NULL
      `);
  }

  static async archiveTask(id: number) {
    const db = await this.getDB();
    await db.runAsync(`UPDATE TASKS SET isArchived = 1 WHERE id = ?`, id);
  }

  static async unarchiveTask(id: number) {
    const db = await this.getDB();
    await db.runAsync(`UPDATE TASKS SET isArchived = 0 WHERE id = ?`, id);
  }

  protected static async getFilteredRows(
    includeFilter: string[] = [],
    excludeFilter: string[] = [],
  ) {
    const db = await this.getDB();

    const conditions: string[] = [];
    const params: any[] = [];

    if (includeFilter.includes(STRINGS.archived)) {
      conditions.push(`isArchived = ?`);
      params.push(1);
    }
    if (excludeFilter.includes(STRINGS.archived)) {
      conditions.push(`isArchived = ?`);
      params.push(0);
    }

    if (includeFilter.includes(STRINGS.routine)) {
      conditions.push(`repeatType IS NOT NULL`);
    }

    if (excludeFilter.includes(STRINGS.routine)) {
      conditions.push(`repeatType IS NULL`);
    }

    const query =
      `SELECT * FROM TASKS` +
      (conditions.length ? ` WHERE ` + conditions.join(` AND `) : ``) +
      ` ORDER BY id DESC LIMIT 100;`;

    let c = await db.getAllAsync<TaskRow>(query, params);
    // console.log(c[0]);

    return c;
  }

  protected static async getAllActiveRows() {
    const db = await this.getDB();
    return await db.getAllAsync<TaskRow>(`
        SELECT * FROM TASKS WHERE isActive = 1
      `);
  }

  protected static async getAllNonDoneRows() {
    const db = await this.getDB();
    return await db.getAllAsync<TaskRow>(`
        SELECT * FROM TASKS WHERE isDone = 0
      `);
  }

  protected static async getAllFocusedRows() {
    const db = await this.getDB();
    return await db.getAllAsync<TaskRow>(`
        SELECT * FROM TASKS WHERE isOnFocus = 1
      `);
  }

  static async toggleTimedTasks(nowMinutes: number) {
    const db = await this.getDB();
    const unarchiveActiveTasks = await this.getUnarchivedTasks();
    const activeTasks = unarchiveActiveTasks.filter(
      (task) =>
        task.startTime != null &&
        task.endTime != null &&
        task.startTime <= nowMinutes &&
        task.endTime >= nowMinutes,
    );

    const notActiveTasks = unarchiveActiveTasks.filter(
      (task) =>
        (task.startTime != null && task.startTime > nowMinutes) ||
        (task.endTime != null && task.endTime < nowMinutes),
    );
    await Promise.all(
      activeTasks.map((task) => this.toggleActiveStatus(1, task.id)),
    );
    await Promise.all(
      notActiveTasks.map((task) => this.toggleActiveStatus(0, task.id)),
    );
  }

  static async toggleActiveStatus(isActive: number, id: number) {
    const db = await this.getDB();
    await db.runAsync(
      `UPDATE TASKS SET isActive = ? WHERE id = ?`,
      isActive,
      id,
    );
  }
}
