import { CanvasRenderer } from '../Genotype/CanvasRenderer'
import { ImageSimilarityEvaluator } from '../Genotype/ImageSimilarityEvaluator'
import { EvalFitnessMessage, InitMessage, WorkKind } from './FitnessWorkerFacade'

let fitnessFunction: ImageSimilarityEvaluator | undefined

self.onmessage = function ({ data }: MessageEvent<Message>) {
    switch (data.action) {
        case WorkKind.Init:
            const canvas = new OffscreenCanvas(data.config.canvasWidth, data.config.canvasHeight)
            const renderer = new CanvasRenderer(canvas, true)

            fitnessFunction = new ImageSimilarityEvaluator(data.config.targetImage, renderer)
            self.postMessage(true)

            break
        case WorkKind.EvalGenotypeFitness:
            if (!fitnessFunction) {
                throw new Error('Worker must be initialized first.')
            }

            const fitness = fitnessFunction.evalGenotypeFitness(data.genotype)
            self.postMessage(fitness)

            break
        default:
            throw new Error(`Unsupported action [${(data as any).action}] for ${self.name}.`)
    }
}

type Message = InitMessage | EvalFitnessMessage
declare var self: DedicatedWorkerGlobalScope
