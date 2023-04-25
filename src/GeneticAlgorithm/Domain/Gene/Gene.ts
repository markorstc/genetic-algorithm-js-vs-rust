import { GeneticOperations } from '../Population/GeneticOperations'
import { Muton } from './ValueObject/Muton'
import { Angle } from './ValueObject/Muton/Angle'
import { Color } from './ValueObject/Muton/Color'
import { HorizontalDistance } from './ValueObject/Muton/HorizontalDistance'
import { Opacity } from './ValueObject/Muton/Opacity'
import { Shape } from './ValueObject/Muton/Shape'
import { VerticalDistance } from './ValueObject/Muton/VerticalDistance'
import { ZIndex } from './ValueObject/Muton/ZIndex'

export type Gene = Readonly<Mutons> & GeneticOperations

export type Mutons = [
    r: Color,
    g: Color,
    b: Color,
    a: Opacity,
    shape: Shape,
    x: HorizontalDistance,
    y: VerticalDistance,
    z: ZIndex,
    width: HorizontalDistance,
    height: VerticalDistance,
    rotation: Angle,
]

export const Gene = {
    create: (...mutons: Mutons): Gene => Object.assign(mutons, { crossover, mutate })
} as const

function crossover(this: Gene, geneB: Gene): Gene {
    const geneA = this
    const newMutons = geneA.map((mutonA: Muton, idx) => mutonA.crossover(geneB[idx]))

    return Gene.create(...newMutons as Mutons)
}

function mutate(this: Gene): Gene {
    const newMutons = this.map(muton => Math.random() < .25 ? muton.mutate() : muton)

    return Gene.create(...newMutons as Mutons)
}
