import { Inventory } from '../models/Inventory';
import { DamageDefenseItem } from '../items/DamageDefenseItem';
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

            const rollSum = DiceRoller.rollDice(diceToRoll, 6);
            const index = Math.min(rollSum - 1, 17); // Max index is 17 for 18 items (or 19 for spells/tech)

            // Handle each list separately to avoid type intersection issues
            switch (listChoice) {
                case 0: {
                    const items = DataLoader.getDamageList();
                    const item = items[Math.min(index, items.length - 1)];
                    inventory.damageDefense.push(item);
                    console.log(`Rolled ${diceToRoll}d6 on Damage & Defense -> ${item.name}`);
                    break;
                }
                case 1: {
                    const items = DataLoader.getSuppliesList();
                    const item = items[Math.min(index, items.length - 1)];
                    inventory.suppliesSundries.push(item);
                    console.log(`Rolled ${diceToRoll}d6 on Supplies & Sundries -> ${item.name}`);
                    break;
                }
                case 2: {
                    const items = DataLoader.getOdditiesList();
                    const item = items[Math.min(index, items.length - 1)];
                    inventory.odditiesValuables.push(item);
                    console.log(`Rolled ${diceToRoll}d6 on Oddities & Valuables -> ${item.name}`);
                    break;
                }
                case 3: {
                    const items = DataLoader.getSpellsList();
                    const item = items[Math.min(index, items.length - 1)];
                    inventory.spells.push(item);
                    console.log(`Rolled ${diceToRoll}d6 on Spells -> ${item.name}`);
                    break;
                }
                case 4: {
                    const items = DataLoader.getTechniquesList();
                    const item = items[Math.min(index, items.length - 1)];
                    inventory.techniques.push(item);
                    console.log(`Rolled ${diceToRoll}d6 on Techniques -> ${item.name}`);
                    break;
                }
            }

            totalDiceRolled += diceToRoll;
        }

        return inventory;
    }
}