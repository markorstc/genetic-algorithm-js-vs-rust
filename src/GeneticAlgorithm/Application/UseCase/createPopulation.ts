import { Gene } from '../../Domain/Gene/Gene'
import { Angle } from '../../Domain/Gene/ValueObject/Muton/Angle'
import { Color } from '../../Domain/Gene/ValueObject/Muton/Color'
import { HorizontalDistance } from '../../Domain/Gene/ValueObject/Muton/HorizontalDistance'
import { Opacity } from '../../Domain/Gene/ValueObject/Muton/Opacity'
import { Shape, ShapeKind } from '../../Domain/Gene/ValueObject/Muton/Shape'
import { VerticalDistance } from '../../Domain/Gene/ValueObject/Muton/VerticalDistance'
import { ZIndex } from '../../Domain/Gene/ValueObject/Muton/ZIndex'
import { Genotype } from '../../Domain/Genotype/Genotype'
import { Population } from '../../Domain/Population/Population'
import { FitnessWorkerPool } from '../../Infrastructure/WebWorker/FitnessWorkerPool'

export function createPopulation(config: Config): Population<Genotype> {
    const fitnessFunction = new FitnessWorkerPool(config, navigator.hardwareConcurrency / 2)
    const length = config.populationSize ?? 300

    return <Population<Genotype>> Population
        .from({ length }, _ => new Genotype(createGenes(config), fitnessFunction))
}

export type Config = {
    numberOfShapes: number
    targetImage: ImageData
    canvasWidth: number
    canvasHeight: number
    populationSize?: number
}

function createGenes({ numberOfShapes: length, canvasWidth, canvasHeight }: Config): ReadonlyArray<Gene> {
    return Array.from({ length }, _ => Gene.create(
        new Color(255),
        new Color(255),
        new Color(255),
        new Opacity(100),
        new Shape(ShapeKind.Rectangle),
        new HorizontalDistance(canvasWidth / 2, canvasWidth),
        new VerticalDistance(canvasHeight / 2, canvasHeight),
        new ZIndex(0, length),
        new HorizontalDistance(1, canvasWidth),
        new VerticalDistance(1, canvasHeight),
        new Angle(0),
    ))
}
