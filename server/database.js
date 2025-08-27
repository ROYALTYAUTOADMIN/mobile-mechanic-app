// server/database.js
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDirectory = process.env.DATA_DIRECTORY || path.join(__dirname, '../data');
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const dbPath = path.join(dataDirectory, 'database.sqlite');

// Open SQLite database with better-sqlite3
const sqliteDb = new Database(dbPath);

// Initialize Kysely with SQLite dialect
export const db = new Kysely({
  dialect: new SqliteDialect({ database: sqliteDb }),
  log: ['query', 'error'],
});
