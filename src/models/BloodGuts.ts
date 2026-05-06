export class BloodGuts {
    bloodModifier: number = 0;
    gutsModifier: number = 0;

    get totalModifier(): number {
        return this.bloodModifier + this.gutsModifier;
    }
}