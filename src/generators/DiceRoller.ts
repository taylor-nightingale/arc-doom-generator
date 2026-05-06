import seedrandom from 'seedrandom';

// Singleton instance to manage the random state
class SeededRandomManager {
    private _rng: any;

    constructor(seed?: string) {
        this._rng = seed ? seedrandom(seed) : seedrandom();
    }

    next(): number {
        return this._rng();
    }

    reseed(seed: string): void {
        this._rng = seedrandom(seed);
    }
}

export const randomManager = new SeededRandomManager();

export class DiceRoller {
    static roll(min: number, max: number): number {
        if (min > max) throw new Error('Min cannot be greater than Max');
        const float = randomManager.next();
        return Math.floor(float * (max - min + 1)) + min;
    }

    static rollDice(numberOfDice: number, sides: number = 6): number {
        let sum = 0;
        for (let i = 0; i < numberOfDice; i++) {
            sum += this.roll(1, sides);
        }
        return sum;
    }

    static shuffle<T>(list: T[]): void {
        for (let i = list.length - 1; i > 0; i--) {
            const j = this.roll(0, i);
            [list[i], list[j]] = [list[j], list[i]];
        }
    }

    // Public method to reseed the generator
    static reseed(seed: string): void {
        randomManager.reseed(seed);
    }
}