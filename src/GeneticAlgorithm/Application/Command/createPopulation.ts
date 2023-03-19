import { Gene } from '../../Domain/Gene/Gene'
import { Angle } from '../../Domain/Gene/ValueObject/Muton/Angle'
import { Color } from '../../Domain/Gene/ValueObject/Muton/Color'
import { HorizontalDistance } from '../../Domain/Gene/ValueObject/Muton/HorizontalDistance'
import { Opacity } from '../../Domain/Gene/ValueObject/Muton/Opacity'
import { Shape, ShapeKind } from '../../Domain/Gene/ValueObject/Muton/Shape'
import { VerticalDistance } from '../../Domain/Gene/ValueObject/Muton/VerticalDistance'
import { Genotype } from '../../Domain/Genotype/Genotype'
import { Population } from '../../Domain/Population/Population'
import { CanvasRenderer } from '../../Infrastructure/Genotype/CanvasRenderer'
import { ImageSimilarityEvaluator } from '../../Infrastructure/Genotype/ImageSimilarityEvaluator'

export function createPopulation(config: Config): Population<Genotype> {
    const renderer = new CanvasRenderer(new OffscreenCanvas(config.canvasWidth, config.canvasHeight), true)
    const fitnessFunction = new ImageSimilarityEvaluator(config.targetImage, renderer)
    const length = config.populationSize ?? 100

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
        new HorizontalDistance(canvasWidth, canvasWidth),
        new VerticalDistance(canvasHeight, canvasHeight),
        new Angle(0),
    ))
}
