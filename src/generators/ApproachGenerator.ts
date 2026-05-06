import { ApproachScores } from '../models/ApproachScores';
import { DiceRoller } from './DiceRoller';

export class ApproachGenerator {
    static generateRandom(): ApproachScores {
        const totalPoints = DiceRoller.roll(1, 6);
        const scores = new ApproachScores();
        let pointsAllocated = 0;

        while (pointsAllocated < totalPoints) {
            let allocated = false;
            let attempts = 0;

            while (!allocated && attempts < 100) {
                const roll = DiceRoller.roll(1, 6);
                const choice = roll <= 2 ? 0 : roll <= 4 ? 1 : 2;

                if (choice === 0 && scores.creative < 3) {
                    scores.creative++;
                    allocated = true;
                } else if (choice === 1 && scores.careful < 3) {
                    scores.careful++;
                    allocated = true;
                } else if (choice === 2 && scores.concerted < 3) {
                    scores.concerted++;
                    allocated = true;
                }
                attempts++;
            }
            pointsAllocated++;
        }

        return scores;
    }
}