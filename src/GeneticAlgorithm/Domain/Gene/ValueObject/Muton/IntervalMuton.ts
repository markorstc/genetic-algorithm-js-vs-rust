import { Muton } from '../Muton'

export abstract class IntervalMuton extends Number implements Muton {
    public constructor(
        public readonly value: number,
        private readonly minMax: Readonly<[number, number]>,
    ) {
        super(value)
    }

    public crossover(mutonB: this): this {
        const mutonA = this
        const interpolatedValue = this.lerp(mutonB.value, mutonA.value, Math.random())

        return this.cloneWithValue(interpolatedValue)
    }

    public mutate(): this {
        const randomValue = this.lerp(...this.minMax, Math.random())
        const mutadedValue = this.lerp(randomValue, this.value, Math.random())

        return this.cloneWithValue(mutadedValue)
    }

    protected abstract cloneWithValue(value: number): this

    protected get min(): number {
        return this.minMax[0]
    }

    protected get max(): number {
        return this.minMax[1]
    }

    /**
     * @param {number} interpolant - between 0 and 1 inclusively (interpolates towards A < 0.5 < interpolates towards B)
     * @returns {number} interpolated value from A and B
     */
    private lerp(a: number, b: number, interpolant = .50): number {
        return interpolant * (b - a) + a
    }
}
