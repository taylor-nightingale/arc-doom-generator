import { Skills } from '../models/Skills';
import { DiceRoller } from './DiceRoller';

const skillCategories: Record<string, string[]> = {
    Knowledge: ['Academic', 'Culture', 'Observe'],
    Social: ['Tactics', 'Charisma', 'Guile'],
    Pragmatic: ['Physique', 'Weaponry', 'Artistry', 'Survival', 'Tinker', 'Trade', 'Arcana', 'Focus']
};

const allSkillNames = Object.values(skillCategories).flat();

export class SkillGenerator {
    static generateRandom(): Skills {
        const totalRanks = DiceRoller.rollDice(2, 6);
        const skills = new Skills();
        const shuffledSkills = [...allSkillNames];
        DiceRoller.shuffle(shuffledSkills);

        let pointsAllocated = 0;
        let rankTwoCount = 0;

        for (const skillName of shuffledSkills) {
            if (pointsAllocated >= totalRanks) break;

            let pointsToGive = 1;
            if (totalRanks - pointsAllocated >= 2 && rankTwoCount < 2) {
                pointsToGive = 2;
                rankTwoCount++;
            }

            if (pointsToGive > totalRanks - pointsAllocated) {
                pointsToGive = totalRanks - pointsAllocated;
            }

            const category = Object.entries(skillCategories).find(([_, skills]) =>
                skills.includes(skillName)
            )?.[0] || 'Knowledge';

            skills.addSkill(skillName, pointsToGive, category);
            pointsAllocated += pointsToGive;
        }

        return skills;
    }
}