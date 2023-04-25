import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import { createPopulation } from '../../Application/UseCase/createPopulation'
import { Genotype } from '../../Domain/Genotype/Genotype'
import { Population } from '../../Domain/Population/Population'
import { EvolvePopulationMessage, InitPopulationMessage, WorkKind } from './PopulationWorkerFacade'

let population: Population<Genotype> | undefined

self.onmessage = async ({ data }: MessageEvent<Message>) => {
    switch (data.action) {
        case WorkKind.InitPopulation:
            population = createPopulation(data.config)
            self.postMessage(true)

            break
        case WorkKind.EvolveAndFindFittest:
            if (!population) {
                throw new Error('Population must be initialized first.')
            }

            population = await population.evolve()
            const bestGenotype = await population.fittest()

            if (!bestGenotype) {
                throw new Error('Population is empty.');
            }

            const genotypeDTO = TransferableGenotype.create(bestGenotype)
            self.postMessage([genotypeDTO, bestGenotype.fitness], genotypeDTO.genes.map(({ buffer }) => buffer))

            break
        default:
            throw new Error(`Unsupported action [${(data as any).action}] for ${self.name}.`)
    }
}

type Message = InitPopulationMessage | EvolvePopulationMessage
declare var self: DedicatedWorkerGlobalScope
