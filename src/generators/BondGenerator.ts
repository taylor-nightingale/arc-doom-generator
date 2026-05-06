import { Bonds, Bond } from '../models/Character';
import { DiceRoller } from './DiceRoller';

const relationshipPrompts = [
    "Greatly admire the other?",
    "Find the other hero intriguing?",
    "Become reminded of someone else from their past?",
    "Know them from before?",
    "Find themselves compelled to protect the other?",
    "Feel or know something else? (Define it)"
];

export class BondGenerator {
    static generateRandom(): Bonds {
        const bonds = new Bonds();

        // 1. Roll 3d6 for total Bond Levels
        const totalLevels = DiceRoller.rollDice(3, 6);
        bonds.totalLevels = totalLevels;

        console.log(`Rolled 3d6 for Bonds: ${totalLevels} levels to distribute.`);

        // 2. Create 3 Bond Slots (Ally 1, Ally 2, Ally 3)
        // Each bond has a max capacity of 4 levels (standard for 3 Major Bonds)
        for (let i = 0; i < 3; i++) {
            const allyName = `Ally ${i + 1}`;
            const relationship = relationshipPrompts[DiceRoller.roll(0, relationshipPrompts.length - 1)];

            bonds.bonds.push({
                allyName,
                relationship,
                maxLevels: 4 // Standard capacity per bond
            });
        }

        return bonds;
    }
}