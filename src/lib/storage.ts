/**
 * SQLite singleton, matching the app's standard data pattern:
 * one shared connection promise so concurrent callers never race
 * to open/migrate the DB twice.
 */
import * as SQLite from "expo-sqlite";
import { RiskLevel } from "./analysis";

export interface ScreeningRecord {
  id: number;
  createdAt: string;
  riskLevel: RiskLevel;
  confidence: number;
  note: string;
  imageUri: string;
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("jaundx.db");
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS screenings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          createdAt TEXT NOT NULL,
          riskLevel TEXT NOT NULL,
          confidence REAL NOT NULL,
          note TEXT NOT NULL DEFAULT '',
          imageUri TEXT NOT NULL DEFAULT ''
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

export async function saveScreening(input: {
  riskLevel: RiskLevel;
  confidence: number;
  note: string;
  imageUri: string;
}): Promise<ScreeningRecord> {
  const db = await getDb();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO screenings (createdAt, riskLevel, confidence, note, imageUri) VALUES (?, ?, ?, ?, ?)`,
    [createdAt, input.riskLevel, input.confidence, input.note, input.imageUri]
  );
  return {
    id: result.lastInsertRowId,
    createdAt,
    ...input,
  };
}

export async function listScreenings(): Promise<ScreeningRecord[]> {
  const db = await getDb();
  return db.getAllAsync<ScreeningRecord>(
    `SELECT * FROM screenings ORDER BY createdAt DESC`
  );
}

export async function clearScreenings(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`DELETE FROM screenings;`);
}
