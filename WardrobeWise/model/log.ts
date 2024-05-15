import { ClothingItemDTO, ClothingItem, LogEntry, LogEntryDTO } from "./types";
import { getDatabase } from "./db";

export async function getLogEntries(): Promise<LogEntry[]> {
    const db = await getDatabase()

    let entries: LogEntry[] = []
    await db.transactionAsync(async tx => {
        const result = await tx.executeSqlAsync(`
            SELECT
                log_entries.id AS logEntryId,
                log_entries.date AS logEntryDate,
                clothing_items.id AS id
            FROM log_entries
            LEFT JOIN logs_items ON logs_items.log_id = log_entries.id
            LEFT JOIN clothing_items ON logs_items.item_id = clothing_items.id
            ORDER BY log_entries.date DESC
        `)

        result.rows.forEach((row) => {
            if(entries.length == 0 || entries[entries.length - 1].id != row["logEntryId"]){
                entries.push({
                    id: row["logEntryId"],
                    date: row["logEntryDate"],
                    itemIDs: []
                })
            }

            entries[entries.length - 1].itemIDs.push(row["id"])
        })
    })

    return entries

}

export async function createLogEntry(date: Date, items: string[]): Promise<LogEntry> {
    const db = await getDatabase()

    let entry: LogEntry | null = null
    await db.transactionAsync(async tx => {
        const result = await tx.executeSqlAsync(`INSERT INTO log_entries (date) VALUES (datetime(?, "unixepoch"))`, [Math.floor(date.getTime() / 1000)])
        
        items.forEach(id => tx.executeSqlAsync("INSERT INTO logs_items (log_id, item_id) VALUES (?, ?)", [result.insertId!, id]))

        if(result.insertId == null) throw new Error("Insert id is null")
        entry = {
            id: result.insertId.toString(),
            date: date.toISOString(),
            itemIDs: items,
        }
    })

    if(entry == null) throw new Error("entry is null")
    return entry

}

export async function deleteLogEntry(id: string) {
    const db = await getDatabase()

    await db.transactionAsync(async tx => {
        tx.executeSqlAsync("DELETE FROM log_entries WHERE id = ?", [id])
    })

}
