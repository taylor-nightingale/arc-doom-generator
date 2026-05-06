import { Inventory } from '../models/Inventory';
import { DiceRoller } from './DiceRoller';
import {ItemLists} from "../items/ItemLists";

export class InventoryGenerator {
    static async generateRandom(baseDice: number = 12): Promise<Inventory> {
        await ItemLists.loadData();

        const inventory = new Inventory();
        let totalDiceRolled = 0;
        const targetDice = baseDice;

        while (totalDiceRolled < targetDice) {
            const itemList = ItemLists.randomList();
            const remaining = targetDice - totalDiceRolled;

            const maximumAvailableDiceForList = itemList.items.length / 6;
            const diceToRoll = DiceRoller.roll(1, Math.min(maximumAvailableDiceForList, remaining));

            let itemAdded = null;
            let attempts = 0;
            while (itemAdded === null && attempts < 30) {
                attempts++;
                const rollSum = DiceRoller.rollDice(diceToRoll, 6);
                const index = Math.min(rollSum, itemList.items.length) -1;
                itemAdded = itemList.AddItemToInventory(inventory, index);
            }

            console.log(`Rolled ${diceToRoll}d6 on ${itemList.name} -> ${itemAdded.name}`);
            totalDiceRolled += diceToRoll;
        }

        return inventory;
    }
}