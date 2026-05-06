export class ApproachScores {
    creative: number = 0;
    careful: number = 0;
    concerted: number = 0;

    get total(): number {
        return this.creative + this.careful + this.concerted;
    }
}