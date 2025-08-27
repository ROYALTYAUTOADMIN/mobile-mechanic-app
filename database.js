import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import path from 'path';

const dataDirectory = process.env.DATA_DIRECTORY || './data';
const dbPath = path.join(dataDirectory, 'database.sqlite');

const sqliteDb = new Database(dbPath);

export const db = new Kysely({
  dialect: new SqliteDialect({ database: sqliteDb }),
  log: ['query', 'error']
});