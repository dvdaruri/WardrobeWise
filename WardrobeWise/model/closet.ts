import { ClothingItemDTO, ClothingItem } from "./types";
import { getDatabase } from "./db";
import { RootState } from "@/redux/store";

export async function createItem(item: ClothingItemDTO): Promise<ClothingItem> {
    const db = await getDatabase()

    let insertId = null
    await db.transactionAsync(async tx => {
        console.log(item.acquisitionDate)
        const result = await tx.executeSqlAsync(`
            INSERT INTO clothing_items
            (imageUrl, description, source, category, acquisitionDate, cost)
            VALUES
            (?, ?, ?, ?, datetime(?, "unixepoch"), ?)
        `,
        [
            item.imageUrl, item.description, item.source, item.category, 
            Math.floor(new Date(item.acquisitionDate).getTime() / 1000), item.cost
        ])
        insertId = result.insertId
    })

    if(insertId == null) throw new Error("Insert ID was null")

    return {
        ...item,
        id: insertId,
        retired: false,
        numberOfWears: 0,
    }
}

export async function getItems() {
    const db = await getDatabase();

    let results: ClothingItem[] = []
    await db.transactionAsync(async tx => {
        (await tx.executeSqlAsync(`
            SELECT
                clothing_items.id,
                clothing_items.imageUrl,
                clothing_items.description,
                clothing_items.source,
                clothing_items.category,
                clothing_items.acquisitionDate,
                clothing_items.cost,
                clothing_items.retired,
                COUNT(logs_items.log_id) AS numberOfWears
            FROM
                clothing_items
            LEFT JOIN logs_items ON clothing_items.id = logs_items.item_id
            WHERE clothing_items.retired = 0
            GROUP BY clothing_items.id
        `)).rows.map((result) => {
            results.push({
                imageUrl: result["imageUrl"],
                description: result["description"],
                source: result["source"],
                category: result["category"],
                acquisitionDate: result["acquisitionDate"],
                cost: result["cost"],
                id: result["id"],
                retired: result["retired"] == 1,
                numberOfWears: result["numberOfWears"],
            })
        })
    }, true)

    return results
}

export async function retireItem(id: string) {
    const db = await getDatabase()

    await db.transactionAsync(async tx => {
       await tx.executeSqlAsync(
            "UPDATE clothing_items SET retired = 1 WHERE id = ?",
            [id]
        )
    })
}