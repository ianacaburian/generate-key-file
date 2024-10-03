import { JuceBigInteger } from './JuceBigInteger'

export class JuceRSAKey {
    protected part1: JuceBigInteger
    protected part2: JuceBigInteger
    constructor(public s: string) {
        // Ports juce::RSAKey::RSAKey()
        if (s.includes(',')) {
            const [p1, p2] = s.split(',').map(p => JuceBigInteger.fromHex(p))
            this.part1 = p1
            this.part2 = p2
        } else {
            this.part1 = new JuceBigInteger()
            this.part2 = new JuceBigInteger()
        }
    }
    applyToValue(val: JuceBigInteger): void {
        // Ports juce::RSAKey::applyToValue()
        if (this.part1.isZero() || this.part2.isZero() || val.value <= 0n) {
            return
        }

        const result = new JuceBigInteger()

        while (!val.isZero()) {
            result.value *= this.part2.value

            const remainder = new JuceBigInteger()
            val.divideBy(this.part2, remainder)

            remainder.exponentModulo(this.part1, this.part2)

            result.value += remainder.value
        }

        val.value = result.value
    }
}
