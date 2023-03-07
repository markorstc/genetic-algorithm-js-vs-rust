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

export function usePopulation(config: Config): Population<Genotype> {
    const canvasRenderer = new CanvasRenderer(config.canvas)
    const offsreenRenderer = new CanvasRenderer(new OffscreenCanvas(config.canvas.width, config.canvas.height))
    const fitnessFunction = new ImageSimilarityEvaluator(config.targetImage, offsreenRenderer)
    const length = config.populationSize ?? 100

    return <Population<Genotype>> Population
        .from({ length }, _ => new Genotype(createGenes(config), fitnessFunction, canvasRenderer))
}

export async function useImageData(img: HTMLImageElement): Promise<ImageData> {
    await img.decode()
    const { width, height } = img

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx!.drawImage(img, 0, 0, width, height)
    
    return ctx!.getImageData(0, 0, width, height)
}

function createGenes({ numberOfShapes: length, canvas: { width, height } }: Config): ReadonlyArray<Gene> {
    return Array.from({ length }, _ => Gene.create(
        new Color(255),
        new Color(255),
        new Color(255),
        new Opacity(1),
        new Shape(ShapeKind.Rectangle),
        new HorizontalDistance(0, width),
        new VerticalDistance(0, height),
        new HorizontalDistance(width, width),
        new VerticalDistance(height, height),
        new Angle(0),
    ))
}

type Config = {
    numberOfShapes: number
    targetImage: ImageData
    canvas: HTMLCanvasElement
    populationSize?: number
}
