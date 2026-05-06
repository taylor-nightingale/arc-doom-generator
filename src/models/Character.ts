import {ApproachScores} from "./ApproachScores";
import {BloodGuts} from "./BloodGuts";
import {Skills} from "./Skills";
import {Inventory} from "./Inventory";

export class Backstory {
    difference: string = '';
    rumors: string = '';
    lesson: string = '';
}

export interface Bond {
    allyName: string;
    relationship: string;
    maxLevels: number;
}

export class Bonds {
    totalLevels: number = 0;
    bonds: Bond[] = [];

    getGridHTML(): string {
        if (this.bonds.length === 0) return '<p>No bonds established.</p>';
        return this.bonds.map((bond, index) => {
            const squares = Array(bond.maxLevels).fill(null).map((_, i) =>
                `<div class="grid-square" title="Minor Level ${i+1}"></div>`
            ).join('');
            return `
        <div class="bond-card">
          <h4>Bond ${index + 1}: ${bond.allyName}</h4>
          <p class="bond-desc"><em>"${bond.relationship}"</em></p>
          <div class="grid-container">${squares}</div>
          <small>Fill squares as you earn Minor Levels</small>
        </div>
      `;
        }).join('');
    }
}

export class Character {
    name: string = '';
    approachScores: ApproachScores = new ApproachScores();
    bloodGuts: BloodGuts = new BloodGuts();
    skills: Skills = new Skills();
    inventory: Inventory = new Inventory();
    backstory: Backstory = new Backstory();
    bonds: Bonds = new Bonds();
}