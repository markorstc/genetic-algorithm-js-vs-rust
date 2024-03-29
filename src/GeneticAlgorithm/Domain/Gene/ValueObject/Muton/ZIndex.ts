import { IntervalMuton } from './IntervalMuton'

export class ZIndex extends IntervalMuton {
    // @ts-expect-error nominal typing hack
    private readonly _: void

    public constructor(value: number, max: number) {
        super(value, [0, max])
    }

    protected cloneWithValue(value: number): this {
        return new (this.constructor as any)(value, this.max)
    }
}
