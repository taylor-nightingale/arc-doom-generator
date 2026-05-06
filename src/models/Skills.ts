import { Skill } from './Skill';

export class Skills {
    private skills: Skill[] = [];

    addSkill(name: string, rank: number, category: string): void {
        this.skills.push({ name, rank, category });
    }

    get allSkills(): Skill[] {
        return [...this.skills];
    }

    get totalRanks(): number {
        return this.skills.reduce((sum, s) => sum + s.rank, 0);
    }

    getCategories(): Map<string, Skill[]> {
        const categories = new Map<string, Skill[]>();
        for (const skill of this.skills) {
            if (!categories.has(skill.category)) {
                categories.set(skill.category, []);
            }
            categories.get(skill.category)!.push(skill);
        }
        return categories;
    }

    getSkillRank(skillName: string): number {
        const skill = this.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
        return skill?.rank ?? 0;
    }
}