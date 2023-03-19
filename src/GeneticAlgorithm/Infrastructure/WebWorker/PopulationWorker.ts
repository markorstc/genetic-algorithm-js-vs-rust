import { createPopulation } from '../../Application/Command/createPopulation';
import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype';
import { EvolvePopulationMessage, InitPopulationMessage, WorkKind } from '../../Application/WebWorkers';
import { Genotype } from '../../Domain/Genotype/Genotype';
import { Population } from '../../Domain/Population/Population';

let population: Population<Genotype> | null = null

self.onmessage = function ({ data }: MessageEvent<Message>) {
    switch (data.action) {
        case WorkKind.InitPopulation:
            population = createPopulation(data.config)
            self.postMessage(undefined)
            break

        case WorkKind.EvolveAndFindFittest:
            if (!population) {
                throw new Error('Population must be initialized first.')
            }

            population = population.evolve()
            const bestGenotype = population.fittest()

            if (!bestGenotype) {
                throw new Error('Population is empty.');
            }

            const genotypeDTO = TransferableGenotype.create(bestGenotype)
            self.postMessage(genotypeDTO, genotypeDTO.genes.map(({ buffer }) => buffer))
            break

        default:
            throw new Error(`Unsupported action [${(data as any).action}] for ${self.name}.`)
    }
}

type Message = InitPopulationMessage | EvolvePopulationMessage

declare var self: DedicatedWorkerGlobalScope