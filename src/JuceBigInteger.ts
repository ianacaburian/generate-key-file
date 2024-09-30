import { BigInteger as JSBN } from 'jsbn'

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
        // TODO divide with JSBN
        remainder.value = this.value % divisor.value
        this.value = this.value / divisor.value
    }

    exponentModulo(exponent: JuceBigInteger, modulus: JuceBigInteger): void {
        const b = new JSBN(this.toHex())
        const e = new JSBN(exponent.toHex())
        const m = new JSBN(modulus.toHex())
        const em = b.modPow(e, m)
        this.value = JuceBigInteger.fromHex(em.toString(16)).value
    }
}
