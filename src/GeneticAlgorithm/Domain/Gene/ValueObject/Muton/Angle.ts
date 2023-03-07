import { IntervalMuton } from './IntervalMuton'

export class Angle extends IntervalMuton {
    // @ts-expect-error nominal typing hack
    private readonly _: void

    public constructor(value: number) {
        super(value, [0, 360])
    }

    protected cloneWithValue(value: number): this {
        return new (this.constructor as new (v: number) => this)(value)
    }
}
