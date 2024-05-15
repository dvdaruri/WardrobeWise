import * as SQLite from "expo-sqlite";

let db = SQLite.openDatabase("clothingAppDB");

let initializeDatabase = (async () => {
  await db.execAsync([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false);

  await db.transactionAsync(async (tx) => {
    tx.executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS clothing_items
    (
        id INTEGER PRIMARY KEY ASC,
        imageUrl TEXT NOT NULL,
        description TEXT NOT NULL,
        source TEXT NOT NULL,
        category INTEGER NOT NULL,
        acquisitionDate TEXT NOT NULL,
        cost INTEGER NOT NULL,
        retired INT NOT NULL DEFAULT 0
    );
    `),
    tx.executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS log_entries
    (
        id INTEGER PRIMARY KEY ASC,
        date TEXT NOT NULL
    )
    `),
    tx.executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS logs_items
    (
    log_id INTEGER REFERENCES log_entries (id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES clothing_items (id) ON DELETE CASCADE,
    PRIMARY KEY (log_id, item_id) ON CONFLICT IGNORE
    )
    `);
    });
})();

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  await initializeDatabase;
  return db;
}
