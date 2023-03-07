import { GeneticOperations } from '../Population/GeneticOperations'
import { Muton } from './ValueObject/Muton'
import { Angle } from './ValueObject/Muton/Angle'
import { Color } from './ValueObject/Muton/Color'
import { HorizontalDistance } from './ValueObject/Muton/HorizontalDistance'
import { Opacity } from './ValueObject/Muton/Opacity'
import { Shape } from './ValueObject/Muton/Shape'
import { VerticalDistance } from './ValueObject/Muton/VerticalDistance'

export type Gene = Readonly<Mutons> & GeneticOperations

export const Gene = {
    create: (...mutons: Mutons): Gene => Object.assign(mutons, { crossover, mutate })
} as const

type Mutons = [
    r: Color,
    g: Color,
    b: Color,
    a: Opacity,
    shape: Shape,
    x: HorizontalDistance,
    y: VerticalDistance,
    width: HorizontalDistance,
    height: VerticalDistance,
    rotation: Angle,
]

function crossover(this: Gene, geneB: Gene): Gene {
    const geneA = this
    const newMutons = geneA.map((mutonA: Muton, idx) => mutonA.crossover(geneB[idx]))

    return Gene.create(...newMutons as Mutons)
}

function mutate(this: Gene): Gene {
    const newMutons = this.map(muton => muton.mutate())

    return Gene.create(...newMutons as Mutons)
}
