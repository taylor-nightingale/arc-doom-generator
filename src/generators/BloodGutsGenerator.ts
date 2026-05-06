import { BloodGuts } from '../models/BloodGuts';
import { DiceRoller } from './DiceRoller';

export class BloodGutsGenerator {
    static generateRandom(): BloodGuts {
        const bg = new BloodGuts();
        bg.bloodModifier = DiceRoller.roll(1, 6);
        bg.gutsModifier = DiceRoller.roll(1, 6);
        return bg;
    }
}