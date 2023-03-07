import { IntervalMuton } from './IntervalMuton'

export class Color extends IntervalMuton {
    // @ts-expect-error nominal typing hack
    private readonly _: void

    public constructor(value: number) {
        super(value, [0, 255])
    }

    protected cloneWithValue(value: number): this {
        return new (this.constructor as new (v: number) => this)(value)
    }
}
