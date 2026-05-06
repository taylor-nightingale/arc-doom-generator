import { Inventory } from '../models/Inventory';
import { DamageDefenseItem, DamageDefenseType } from '../items/DamageDefenseItem';
import { SuppliesSundriesItem } from '../items/SuppliesSundriesItem';
import { OdditiesValuablesItem } from '../items/OdditiesValuablesItem';
import { Spell } from '../items/Spell';
import { Technique } from '../items/Technique';
import { DiceRoller } from './DiceRoller';
import { DataLoader } from '../utils/DataLoader';

export class InventoryGenerator {
    static async generateRandom(baseDice: number = 12): Promise<Inventory> {
        await DataLoader.loadData();

        const inventory = new Inventory();
        let totalDiceRolled = 0;
        const targetDice = baseDice;

        while (totalDiceRolled < targetDice) {
            const remaining = targetDice - totalDiceRolled;
            const diceToRoll = DiceRoller.roll(1, Math.min(3, remaining));

            // Roll for list choice (0-4)
            const listChoice = DiceRoller.roll(0, 4);

            let itemAdded = false;
            let attempts = 0;
            const maxAttempts = 20; // Prevent infinite loops if list is full

            // Inner loop: Keep rolling until we find a valid, non-duplicate item
            while (!itemAdded && attempts < maxAttempts) {
                attempts++;

                // Re-roll the index for this specific list choice
                const rollSum = DiceRoller.rollDice(diceToRoll, 6);
                const index = Math.min(rollSum - 1, 17); // Max index is 17 for 18 items (adjust if lists differ)

                let item: any = null;
                let listName = "";
                let isValid = true;

                switch (listChoice) {
                    case 0: { // Damage & Defense
                        const items = DataLoader.getDamageList();
                        item = items[Math.min(index, items.length - 1)];
                        listName = "Damage & Defense";

                        // 1. Check for Guts Damage/Defense duplicates
                        if (item.hasType(DamageDefenseType.GutsDamage) && inventory.damageDefense.some(i => i.hasType(DamageDefenseType.GutsDamage))) {
                            isValid = false;
                        } else if (item.hasType(DamageDefenseType.GutsDefense) && inventory.damageDefense.some(i => i.hasType(DamageDefenseType.GutsDefense))) {
                            isValid = false;
                        }

                        // 2. Check for ANY duplicate name in this list
                        if (isValid && inventory.damageDefense.some(i => i.name === item.name)) {
                            isValid = false;
                        }
                        break;
                    }
                    case 1: { // Supplies & Sundries
                        const items = DataLoader.getSuppliesList();
                        item = items[Math.min(index, items.length - 1)];
                        listName = "Supplies & Sundries";

                        // Check for duplicate name
                        if (inventory.suppliesSundries.some(i => i.name === item.name)) {
                            isValid = false;
                        }
                        break;
                    }
                    case 2: { // Oddities & Valuables
                        const items = DataLoader.getOdditiesList();
                        item = items[Math.min(index, items.length - 1)];
                        listName = "Oddities & Valuables";

                        // Check for duplicate name
                        if (inventory.odditiesValuables.some(i => i.name === item.name)) {
                            isValid = false;
                        }
                        break;
                    }
                    case 3: { // Spells
                        const items = DataLoader.getSpellsList();
                        item = items[Math.min(index, items.length - 1)];
                        listName = "Spells";

                        // Check for duplicate name
                        if (inventory.spells.some(i => i.name === item.name)) {
                            isValid = false;
                        }
                        break;
                    }
                    case 4: { // Techniques
                        const items = DataLoader.getTechniquesList();
                        item = items[Math.min(index, items.length - 1)];
                        listName = "Techniques";

                        // Check for duplicate name
                        if (inventory.techniques.some(i => i.name === item.name)) {
                            isValid = false;
                        }
                        break;
                    }
                }

                if (isValid && item) {
                    // Add item
                    if (item instanceof DamageDefenseItem) inventory.damageDefense.push(item);
                    else if (item instanceof SuppliesSundriesItem) inventory.suppliesSundries.push(item);
                    else if (item instanceof OdditiesValuablesItem) inventory.odditiesValuables.push(item);
                    else if (item instanceof Spell) inventory.spells.push(item);
                    else if (item instanceof Technique) inventory.techniques.push(item);

                    console.log(`Rolled ${diceToRoll}d6 on ${listName} -> ${item.name}`);
                    itemAdded = true;
                } else {
                    console.log(`Skipped ${item?.name || 'unknown'} (Duplicate or Invalid). Rerolling...`);
                }
            }

            if (!itemAdded) {
                console.warn(`Failed to add item after ${maxAttempts} attempts. Skipping roll (List might be full of duplicates).`);
            }

            totalDiceRolled += diceToRoll;
        }

        return inventory;
    }
}