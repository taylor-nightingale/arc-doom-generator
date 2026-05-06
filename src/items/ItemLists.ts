import {ItemList} from "./ItemList";
import {OdditiesValuablesItem} from "./OdditiesValuablesItem";
import {Technique} from "./Technique";
import {SuppliesSundriesItem} from "./SuppliesSundriesItem";
import {Spell} from "./Spell";
import {DamageDefenseItem, DamageDefenseType} from "./DamageDefenseItem";
import {DiceRoller} from "../generators/DiceRoller";
import {Inventory} from "../models/Inventory";

function addItemIfNotFound(itemsToPickFrom: any[], index: number, inventoryItems: any[]) {
    let itemToAdd = itemsToPickFrom[index];
    let includes = inventoryItems.includes(itemToAdd);
    if (includes) {
        return null;
    } else {
        inventoryItems.push(itemToAdd);
        return itemToAdd;
    }
}

class DamageDefenseList implements ItemList<DamageDefenseItem> {
    items: DamageDefenseItem[] = [];
    name: string = "Damage & Defense";
    jsonFilename: string = "damage-defense.json";

    loadItemsFromJson(damageData: any[]): void {
        this.items = damageData.map(item => {
            let typeBits = DamageDefenseType.None;
            item.types.forEach(t => {
                if (t === 'GutsDamage') typeBits |= DamageDefenseType.GutsDamage;
                if (t === 'BloodDamage') typeBits |= DamageDefenseType.BloodDamage;
                if (t === 'GutsDefense') typeBits |= DamageDefenseType.GutsDefense;
                if (t === 'BloodDefense') typeBits |= DamageDefenseType.BloodDefense;
            });
            const ddi = new DamageDefenseItem();
            ddi.name = item.name;
            ddi.points = item.points;
            ddi.types = typeBits;
            ddi.modifier = item.modifier;
            return ddi;
        });
    }

    AddItemToInventory(inventory: Inventory, index: number) {
        let damageDefenseItem = this.items[index];
        if (damageDefenseItem.hasType(DamageDefenseType.GutsDamage) && inventory.damageDefense.some(item => item.hasType(DamageDefenseType.GutsDamage))) {
            return null;
        }
        if (damageDefenseItem.hasType(DamageDefenseType.GutsDefense) && inventory.damageDefense.some(item => item.hasType(DamageDefenseType.GutsDefense))) {
            return null;
        }
        return addItemIfNotFound(this.items, index, inventory.damageDefense)
    }
}

class SpellList implements ItemList<Spell> {
    name: string = "Spells";
    jsonFilename: string = "spells.json";
    items: Spell[] = [];

    loadItemsFromJson(jsonItems: any[]): void {
        this.items = jsonItems.map((item: { name: string; points: number; effect: string; }) => ({
            ...item,
            instances: 1
        }) as Spell);
    }

    AddItemToInventory(inventory: Inventory, index: number) {
        return addItemIfNotFound(this.items, index, inventory.spells)
    }
}

class SuppliesSundriesList implements ItemList<SuppliesSundriesItem> {
    name: string = "Supplies";
    jsonFilename: string = "supplies.json";
    items: SuppliesSundriesItem[] = [];

    loadItemsFromJson(jsonItems: any[]): void {
        this.items = jsonItems.map((item: { name: string; points: number }) => ({...item}) as SuppliesSundriesItem);
    }

    AddItemToInventory(inventory: Inventory, index: number) {
        return addItemIfNotFound(this.items, index, inventory.suppliesSundries)
    }
}

class TechniqueList implements ItemList<Technique> {
    name: string = "Technique";
    jsonFilename: string = "techniques.json";
    items: Technique[] = [];

    loadItemsFromJson(jsonItems: any[]): void {
        this.items = jsonItems.map((item: { name: string; points: number; effect: string; }) => ({
            ...item,
            instances: 1
        }) as Technique);
    }

    AddItemToInventory(inventory: Inventory, index: number) {
        return addItemIfNotFound(this.items, index, inventory.techniques)
    }
}

class OdditiesValuablesList implements ItemList<OdditiesValuablesItem> {
    name: string = "Oddities and Valuables";
    jsonFilename: string = "oddities.json";
    items: OdditiesValuablesItem[] = [];

    loadItemsFromJson(jsonItems: any[]): void {
        this.items = jsonItems.map((item: { name: string; points: number }) => ({...item}) as OdditiesValuablesItem);
    }

    AddItemToInventory(inventory: Inventory, index: number) {
        return addItemIfNotFound(this.items, index, inventory.odditiesValuables)
    }
}

export class ItemLists {
    static itemLists: ItemList<any>[] = [];
    private static loaded: boolean = false;

    constructor() {
    }

    static async loadData(): Promise<void> {
        if (this.loaded) return;

        try {
            const baseUrl = import.meta.env.BASE_URL;
            this.registerItemLists();
            await this.loadItemLists(baseUrl);

            this.loaded = true;
        } catch (error) {
            console.error('Failed to load game data:', error);
            throw error;
        }
    }

    private static async loadItemLists(baseUrl: string) {
        let promises: Promise<void>[] = [];
        for (const itemList of this.itemLists) {
            promises.push(this.loadItemsIntoOneList(baseUrl, itemList));
        }
        await Promise.all(promises);
    }

    private static registerItemLists() {
        this.itemLists.push(new DamageDefenseList());
        this.itemLists.push(new OdditiesValuablesList());
        this.itemLists.push(new SpellList());
        this.itemLists.push(new SuppliesSundriesList());
        this.itemLists.push(new TechniqueList());
    }

    private static async loadItemsIntoOneList(baseUrl: string, itemList: ItemList<any>): Promise<void> {
        let response = await fetch(baseUrl + itemList.jsonFilename);
        let items: any[] = await response.json();
        itemList.loadItemsFromJson(items);
    }

    static randomList(): ItemList<any> {
        const index = DiceRoller.roll(0, this.itemLists.length - 1);
        return this.itemLists[index];
    }
}