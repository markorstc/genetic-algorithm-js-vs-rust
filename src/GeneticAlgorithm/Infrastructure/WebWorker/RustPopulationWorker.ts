import init, { init_population, evolve_and_get_fittest, get_best_fitness } from '../../../wasm/rust_genetic_algorithm.js'
import { EvolvePopulationMessage, InitPopulationMessage, WorkKind } from './PopulationWorkerFacade'

let wasmReady = false

async function ensureWasm() {
    if (!wasmReady) {
        await init()
        wasmReady = true
    }
}

self.onmessage = async ({ data }: MessageEvent<Message>) => {
    await ensureWasm()

    switch (data.action) {
        case WorkKind.InitPopulation: {
            const { numberOfShapes, targetImage, canvasWidth, canvasHeight } = data.config
            const populationSize = data.config.populationSize ?? 300

            init_population(
                numberOfShapes,
                canvasWidth,
                canvasHeight,
                new Uint8Array(targetImage.data.buffer),
                populationSize,
            )

            self.postMessage(true)
            break
        }

        case WorkKind.EvolveAndFindFittest: {
            const genesFlat = evolve_and_get_fittest()
            const fitness = get_best_fitness()

            // Reconstruct TransferableGenotype shape:
            // genes is an array of Uint16Array (one per shape, 11 values each)
            const numGenes = genesFlat.length / 11
            const genes: Uint16Array[] = []
            for (let i = 0; i < numGenes; i++) {
                genes.push(genesFlat.slice(i * 11, (i + 1) * 11) as Uint16Array)
            }

            const genotype = { genes }
            self.postMessage([genotype, fitness], genes.map(g => g.buffer as ArrayBuffer))
            break
        }

        default:
            throw new Error(`Unsupported action [${(data as any).action}] for RustPopulationWorker.`)
    }
}

type Message = InitPopulationMessage | EvolvePopulationMessage
declare var self: DedicatedWorkerGlobalScope
