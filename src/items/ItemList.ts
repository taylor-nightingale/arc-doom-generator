import { Inventory } from "../models/Inventory";

export interface ItemList<T> {
    name: string;
    jsonFilename: string;
    items: T[];
    loadItemsFromJson(jsonItems: any[]) : void;

    AddItemToInventory(inventory: Inventory, index: number): any;
}