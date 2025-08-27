// server/database.js
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';

// Directory to store the SQLite database
const dataDirectory = process.env.DATA_DIRECTORY || path.join(process.cwd(), 'data');

// Ensure the directory exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

// Path to the SQLite database file
const dbPath = path.join(dataDirectory, 'database.sqlite');

// Open SQLite database
const sqliteDb = new Database(dbPath);

// Kysely database instance
export const db = new Kysely({
  dialect: new SqliteDialect({ database: sqliteDb }),
  log: ['query', 'error'],
});
