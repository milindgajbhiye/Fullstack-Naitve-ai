import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../docs.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[ERROR] Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✓ Connected to SQLite database');
    initializeDB();
  }
});

function initializeDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      owner TEXT NOT NULL,
      sharedWith TEXT DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('[ERROR] Table creation failed:', err.message);
      process.exit(1);
    } else {
      console.log('✓ Documents table initialized');
      // Show stats
      db.get('SELECT COUNT(*) as count FROM documents', (err, row) => {
        if (!err && row) {
          console.log(`✓ Documents in database: ${row.count}`);
        }
      });
    }
  });
}

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('[DB ERROR]', err.message, 'SQL:', sql);
        reject(new Error('Database operation failed'));
      }
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('[DB ERROR]', err.message, 'SQL:', sql);
        reject(new Error('Database query failed'));
      }
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('[DB ERROR]', err.message, 'SQL:', sql);
        reject(new Error('Database query failed'));
      }
      else resolve(rows || []);
    });
  });
};

export default db;
