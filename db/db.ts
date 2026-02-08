import { TaskRow } from "@/Constants/type";
import * as SQLite from "expo-sqlite";

export class Db {
  private static async getDB() {
    return await SQLite.openDatabaseAsync("app.db");
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

  protected static async toggleDoneStatus(taskId: number, doneStatus: boolean) {
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
     FROM tasks
     WHERE archiveStatus = 0`,
    );
  }

  protected static async getTask(id: number) {
    const db = await this.getDB();
    return await db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE id = ?",
      Number(id),
    );
  }
}
