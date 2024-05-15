export enum Category {
    Headwear = 1,
    Top,
    Bottom,
    Footwear
}

export interface ClothingItemDTO {
    imageUrl: string;
    description: string;
    source: string;
    category: Category;
    acquisitionDate: string;
    cost: number;
}

export interface ClothingItem extends ClothingItemDTO {
    id: string;
    retired: boolean;
    // begin calculated statisics
    numberOfWears: number;
}

export interface LogEntryDTO {
    date: string;
    itemIDs: string[]
}

export interface LogEntry extends LogEntryDTO {
    id: string;
}

export const categoryToName = (c: Category): string => {
    if(c == Category.Headwear) return "Headwear"
    if(c == Category.Top) return "Top"
    if(c == Category.Bottom) return "Bottom"
    if(c == Category.Footwear) return "Footwear"
    return "Unknown Category"
}