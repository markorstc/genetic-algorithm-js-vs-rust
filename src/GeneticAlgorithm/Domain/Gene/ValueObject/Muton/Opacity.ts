import { IntervalMuton } from './IntervalMuton'

export class Opacity extends IntervalMuton {
    // @ts-expect-error nominal typing hack
    private readonly _: void

    public constructor(value: number) {
        super(value, [0, 1])
    }

    protected cloneWithValue(value: number): this {
        return new (this.constructor as any)(value)
    }
}
