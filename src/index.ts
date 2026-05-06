import {Character, Backstory, Bonds, Bond} from './models/Character';
import { ApproachGenerator } from './generators/ApproachGenerator';
import { BloodGutsGenerator } from './generators/BloodGutsGenerator';
import { SkillGenerator } from './generators/SkillGenerator';
import { InventoryGenerator } from './generators/InventoryGenerator';
import { BondGenerator } from './generators/BondGenerator';
import { DiceRoller } from './generators/DiceRoller';
import {ItemLists} from "./items/ItemLists";

export class CharacterGenerator {
    static async generateRandom(): Promise<Character> {
        const character = new Character();

        await ItemLists.loadData();

        character.name = this.generateRandomName();
        character.approachScores = ApproachGenerator.generateRandom();
        character.bloodGuts = BloodGutsGenerator.generateRandom();
        character.skills = SkillGenerator.generateRandom();

        let extraDice = 0;
        if (character.approachScores.total <= 1) extraDice += 3;
        if (character.bloodGuts.totalModifier <= 3) extraDice += 3;
        if (character.skills.totalRanks <= 4) extraDice += 3;

        const totalDice = 12 + extraDice;
        character.inventory = await InventoryGenerator.generateRandom(totalDice);

        character.backstory = {
            difference: 'What makes them different from others?',
            rumors: 'What are the three rumors about them? Who believes it?',
            lesson: 'What was the most painful lesson your hero had to learn?'
        };

        character.bonds = BondGenerator.generateRandom();

        return character;
    }

    private static generateRandomName(): string {
        const firstNames = ['Kael', 'Mira', 'Thorn', 'Lyra', 'Dax', 'Nyx', 'Orin', 'Vex', 'Zara', 'Joren'];
        const lastNames = ['Stormborn', 'Ironhand', 'Shadowwalker', 'Fireheart', 'Moonwhisper', 'Stonebreaker', 'Windrunner', 'Nightblade'];
        return `${firstNames[DiceRoller.roll(0, firstNames.length - 1)]} ${lastNames[DiceRoller.roll(0, lastNames.length - 1)]}`;
    }
}

// --- 2. Render Function Outside ---

function renderCharacterSheet(character: Character): void {


    const characterSheet = document.getElementById('character-sheet');
    if (!characterSheet) return;

    characterSheet.innerHTML = `
    <h2>${character.name}</h2>
        
    <div class="section">
      <h3>Approach Scores</h3>
      <p>Creative: ${character.approachScores.creative} | Careful: ${character.approachScores.careful} | Concerted: ${character.approachScores.concerted}</p>
      <p><strong>Total:</strong> ${character.approachScores.total}</p>
    </div>

    <div class="section">
      <h3>Blood & Guts</h3>
      <p>Blood Modifier: ${character.bloodGuts.bloodModifier} | Guts Modifier: ${character.bloodGuts.gutsModifier}</p>
      <p><strong>Total Modifier:</strong> ${character.bloodGuts.totalModifier}</p>
    </div>

    <div class="section">
      <h3>Skills</h3>
      ${Array.from(character.skills.getCategories()).map(([category, skills]) => `
        <div>
          <strong>${category}:</strong>
          <ul>
            ${skills.map(s => `<li>${s.name} (+${s.rank})</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h3>Inventory</h3>
      <p><strong>Total Points:</strong> ${character.inventory.totalPoints} (Random: No Limit)</p>
      
      <h4>Damage & Defense</h4>
      <ul>
        ${character.inventory.damageDefense.map(item => `
          <li>
            ${item.name} (${item.points} pts) - 
            ${item.getFormattedTypes()}
          </li>
        `).join('')}
      </ul>

      <h4>Supplies & Sundries</h4>
      <ul>
        ${character.inventory.suppliesSundries.map(item => `<li>${item.name} (${item.points} pts)</li>`).join('')}
      </ul>

      <h4>Oddities & Valuables</h4>
      <ul>
        ${character.inventory.odditiesValuables.map(item => `<li>${item.name} (${item.points} pts)</li>`).join('')}
      </ul>

      <h4>Spells</h4>
      <ul>
        ${character.inventory.spells.map(spell => `<li>${spell.name} (${spell.points} pts): ${spell.effect}</li>`).join('')}
      </ul>

      <h4>Techniques</h4>
      <ul>
        ${character.inventory.techniques.map(tech => `<li>${tech.name} (${tech.points} pts): ${tech.effect}</li>`).join('')}
      </ul>
    </div>

    <div class="section">
      <h3>Backstory</h3>
      <p><strong>Difference:</strong> ${character.backstory.difference}</p>
      <p><strong>Rumors:</strong> ${character.backstory.rumors}</p>
      <p><strong>Lesson:</strong> ${character.backstory.lesson}</p>
    </div>

    <div class="section">
      <h3>Bonds</h3>
      
      <div class="bond-summary">
        <p><strong>Total Bond Levels Available:</strong> <span class="highlight">${character.bonds.totalLevels}</span></p>
        <p class="instruction">Distribute these levels among your 3 allies. Fill the grids below as you play.</p>
      </div>

      ${character.bonds.getGridHTML()}
    </div>
  `;
}

// --- 3. Event Listeners Inside DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
    const seedInput = document.getElementById('seed-input') as HTMLInputElement;
    const loadSeedBtn = document.getElementById('load-seed-btn') as HTMLButtonElement;
    const currentSeedDisplay = document.getElementById('current-seed') as HTMLElement;
    const characterSheet = document.getElementById('character-sheet') as HTMLElement;

    if (!generateBtn || !characterSheet) {
        console.error("Critical Error: Could not find required DOM elements.");
        return;
    }

    let currentSeed: string | null = null;

    loadSeedBtn.addEventListener('click', () => {
        const seed = seedInput.value.trim();
        if (seed) {
            DiceRoller.reseed(seed);
            currentSeed = seed;
            currentSeedDisplay.textContent = `Seed: ${seed}`;
            alert(`Seeded with: ${seed}. Click "Generate" to create the character.`);
        } else {
            alert("Please enter a seed value.");
        }
    });

    generateBtn.addEventListener('click', async () => {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        try {
            if (!currentSeed) {
                currentSeed = Math.random().toString(36).substring(2, 15);
                DiceRoller.reseed(currentSeed);
                currentSeedDisplay.textContent = `Seed: ${currentSeed} (Auto-generated)`;
            }

            const character = await CharacterGenerator.generateRandom();
            renderCharacterSheet(character);
            currentSeedDisplay.textContent = `Seed: ${currentSeed}`;

        } catch (error) {
            characterSheet.innerHTML = '<p class="placeholder" style="color:red;">Error generating character. Check console.</p>';
            console.error("Generation Error:", error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Random Character';
        }
    });
});