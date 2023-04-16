import { Muton } from '../Muton'

export class Shape implements Muton {

    public constructor(public readonly value: ShapeKind) {}

    public crossover(mutonB: this): this {
        return this
    }

    public mutate(): this {
        return this
    }

    public valueOf(): number {
        return this.value
    }
}

export enum ShapeKind {
    Rectangle,
    Circle,
}
