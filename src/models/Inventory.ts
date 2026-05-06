import { DamageDefenseItem } from '../items/DamageDefenseItem';
import { SuppliesSundriesItem } from '../items/SuppliesSundriesItem';
import { OdditiesValuablesItem } from '../items/OdditiesValuablesItem';
import { Spell } from '../items/Spell';
import { Technique } from '../items/Technique';

export class Inventory {
    damageDefense: DamageDefenseItem[] = [];
    suppliesSundries: SuppliesSundriesItem[] = [];
    odditiesValuables: OdditiesValuablesItem[] = [];
    spells: Spell[] = [];
    techniques: Technique[] = [];

    get totalPoints(): number {
        return (
            this.damageDefense.reduce((sum, i) => sum + i.points, 0) +
            this.suppliesSundries.reduce((sum, i) => sum + i.points, 0) +
            this.odditiesValuables.reduce((sum, i) => sum + i.points, 0) +
            this.spells.reduce((sum, i) => sum + i.points, 0) +
            this.techniques.reduce((sum, i) => sum + i.points, 0)
        );
    }
}