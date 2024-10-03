import { BigInteger as JSBN } from 'jsbn'

export class JuceBigInteger {
    constructor(public value: bigint = 0n) {}

    static fromJSBN(b: JSBN): JuceBigInteger {
        return JuceBigInteger.fromHex(b.toString(16))
    }

    toJSBN(): JSBN {
        return new JSBN(this.toHex(), 16)
    }

    static fromHex(hex: string): JuceBigInteger {
        const h = hex.trim()
        return new JuceBigInteger(h ? BigInt(`0x${h}`) : 0n)
    }

    toHex(): string {
        return this.value.toString(16)
    }

    static fromUTF8MemoryBlock(input: string): JuceBigInteger {
        // Ports juce::BigInteger::loadFromMemoryBlock()
        const u = Buffer.from(input, 'utf8')
        const b = new JuceBigInteger()
        for (let i = u.length - 1; i >= 0; i--) {
            b.value = (b.value << 8n) | BigInt(u[i])
        }
        return b
    }

    isZero(): boolean {
        return this.value === 0n
    }

    divideBy(divisor: JuceBigInteger, remainder: JuceBigInteger): void {
        // Ports juce::BigInteger::divideBy()
        if (divisor.isZero()) {
            this.value = 0n
            return
        }
        const b = this.toJSBN()
        const d = divisor.toJSBN()
        const [q, r] = b.divideAndRemainder(d)
        this.value = JuceBigInteger.fromJSBN(q).value
        remainder.value = JuceBigInteger.fromJSBN(r).value
    }

    exponentModulo(exponent: JuceBigInteger, modulus: JuceBigInteger): void {
        // Ports juce::BigInteger::exponentModulo()
        const b = this.toJSBN()
        const e = exponent.toJSBN()
        const m = modulus.toJSBN()
        const em = b.modPow(e, m)
        this.value = JuceBigInteger.fromJSBN(em).value
    }
}
