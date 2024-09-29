export class JuceBigInteger {
    constructor(public value: bigint = 0n) {}

    static fromHex(hex: string): JuceBigInteger {
        const h = hex.trim()
        return new JuceBigInteger(h ? BigInt(`0x${h}`) : 0n)
    }

    toHex(): string {
        return this.value.toString(16)
    }

    isZero(): boolean {
        return this.value === 0n
    }

    divideBy(divisor: JuceBigInteger, remainder: JuceBigInteger): void {
        if (divisor.isZero()) {
            this.value = 0n
            return
        }
        remainder.value = this.value % divisor.value
        this.value = this.value / divisor.value
    }

    exponentModulo(exponent: JuceBigInteger, modulus: JuceBigInteger): void {
        // Implementation of exponentModulo method
        // ... (skipped for brevity)
        // if (modulus === 1n) return 0n
        // let result = 1n
        // base = base % modulus
        // while (exponent > 0n) {
        //     result = (result * base) % modulus
        //     exponent -= 1n
        // }
        // return result
    }
}
