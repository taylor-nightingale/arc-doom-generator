export enum DamageDefenseType {
  None = 0,
  GutsDamage = 1,
  BloodDamage = 2,
  GutsDefense = 4,
  BloodDefense = 8
}

export class DamageDefenseItem {
  name: string = '';
  points: number = 0;
  types: DamageDefenseType = DamageDefenseType.None;
  modifier: number = 0;

  hasType(type: DamageDefenseType): boolean {
    return (this.types & type) === type;
  }

  getFormattedTypes(): string {
    const parts: string[] = [];
    if (this.hasType(DamageDefenseType.GutsDamage)) parts.push(`Guts Damage +${this.modifier}`);
    if (this.hasType(DamageDefenseType.BloodDamage)) parts.push(`Blood Damage +${this.modifier}`);
    if (this.hasType(DamageDefenseType.GutsDefense)) parts.push(`Guts Defense +${this.modifier}`);
    if (this.hasType(DamageDefenseType.BloodDefense)) parts.push(`Blood Defense +${this.modifier}`);
    return parts.join(', ');
  }
}