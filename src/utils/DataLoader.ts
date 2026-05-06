import { DamageDefenseItem, DamageDefenseType } from '../items/DamageDefenseItem';
import { SuppliesSundriesItem } from '../items/SuppliesSundriesItem';
import { OdditiesValuablesItem } from '../items/OdditiesValuablesItem';
import { Spell } from '../items/Spell';
import { Technique } from '../items/Technique';
import { Faction } from '../models/Character';


// Interfaces for JSON data
interface JsonDamageDefense {
    name: string;
    points: number;
    types: string[];
    modifier: number;
}

interface JsonSpell {
    name: string;
    points: number;
    effect: string;
}

interface JsonTechnique {
    name: string;
    points: number;
    effect: string;
}


export class DataLoader {
    private static damageList: DamageDefenseItem[] = [];
    private static suppliesList: SuppliesSundriesItem[] = [];
    private static odditiesList: OdditiesValuablesItem[] = [];
    private static spellsList: Spell[] = [];
    private static techniquesList: Technique[] = [];
    private static loaded = false;

    // Modified to accept faction
    static async loadData(faction: Faction = 'None'): Promise<void> {
        if (this.loaded) return;

        try {
            // Fetch base lists
            const [damageRes, suppliesRes, odditiesRes, spellsRes, techniquesRes] = await Promise.all([
                fetch(`${import.meta.env.BASE_URL}damage-defense.json`),
                fetch(`${import.meta.env.BASE_URL}supplies.json`),
                fetch(`${import.meta.env.BASE_URL}oddities.json`),
                fetch(`${import.meta.env.BASE_URL}spells.json`),
                fetch(`${import.meta.env.BASE_URL}techniques.json`)
            ]);

            const damageData: JsonDamageDefense[] = await damageRes.json();
            const suppliesData = await suppliesRes.json();

            // FIX: Corrected variable name and added type annotation
            const odditiesData: { name: string; points: number }[] = await odditiesRes.json();

            const spellsData: JsonSpell[] = await spellsRes.json();
            const techniquesData: JsonTechnique[] = await techniquesRes.json();

            // Parse Base Lists
            this.damageList = damageData.map((item: JsonDamageDefense) => {
                let typeBits = DamageDefenseType.None;
                item.types.forEach(t => {
                    if (t === 'GutsDamage') typeBits |= DamageDefenseType.GutsDamage;
                    if (t === 'BloodDamage') typeBits |= DamageDefenseType.BloodDamage;
                    if (t === 'GutsDefense') typeBits |= DamageDefenseType.GutsDefense;
                    if (t === 'BloodDefense') typeBits |= DamageDefenseType.BloodDefense;
                });
                const ddi = new DamageDefenseItem();
                ddi.name = item.name;
                ddi.points = item.points;
                ddi.types = typeBits;
                ddi.modifier = item.modifier;
                return ddi;
            });

            this.suppliesList = suppliesData.map((item: { name: string; points: number }) => ({ ...item }) as SuppliesSundriesItem);
            this.odditiesList = odditiesData.map((item: { name: string; points: number }) => ({ ...item }) as OdditiesValuablesItem);
            this.spellsList = spellsData.map((item: JsonSpell) => ({ ...item, instances: 1 }) as Spell);
            this.techniquesList = techniquesData.map((item: JsonTechnique) => ({ ...item, instances: 1 }) as Technique);

            // --- LOAD FACTION ITEMS ---
            if (faction !== 'None') {
                const factionFile = faction === 'Returner'
                    ? `${import.meta.env.BASE_URL}factions/returner-items.json`
                    : `${import.meta.env.BASE_URL}factions/swords-of-apsis-items.json`;

                const factionRes = await fetch(factionFile);
                const factionData = await factionRes.json();

                factionData.forEach((item: any) => {
                    if (item.type === 'spell') {
                        const spell = new Spell();
                        spell.name = item.name;
                        spell.points = item.points;
                        spell.effect = item.effect;
                        spell.instances = 1;
                        this.spellsList.push(spell);
                    } else if (item.type === 'technique') {
                        const tech = new Technique();
                        tech.name = item.name;
                        tech.points = item.points;
                        tech.effect = item.effect;
                        tech.instances = 1;
                        this.techniquesList.push(tech);
                    } else {
                        // Assume it's a Damage/Defense item
                        let typeBits = DamageDefenseType.None;
                        if (item.types) {
                            item.types.forEach((t: string) => {
                                if (t === 'GutsDamage') typeBits |= DamageDefenseType.GutsDamage;
                                if (t === 'BloodDamage') typeBits |= DamageDefenseType.BloodDamage;
                                if (t === 'GutsDefense') typeBits |= DamageDefenseType.GutsDefense;
                                if (t === 'BloodDefense') typeBits |= DamageDefenseType.BloodDefense;
                            });
                        }
                        const ddi = new DamageDefenseItem();
                        ddi.name = item.name;
                        ddi.points = item.points;
                        ddi.types = typeBits;
                        ddi.modifier = item.modifier || 0;
                        this.damageList.push(ddi);
                    }
                });
            }

            this.loaded = true;
        } catch (error) {
            console.error('Failed to load game data:', error);
            throw error;
        }
    }

    static getDamageList(): DamageDefenseItem[] { return this.damageList; }
    static getSuppliesList(): SuppliesSundriesItem[] { return this.suppliesList; }
    static getOdditiesList(): OdditiesValuablesItem[] { return this.odditiesList; }
    static getSpellsList(): Spell[] { return this.spellsList; }
    static getTechniquesList(): Technique[] { return this.techniquesList; }
}