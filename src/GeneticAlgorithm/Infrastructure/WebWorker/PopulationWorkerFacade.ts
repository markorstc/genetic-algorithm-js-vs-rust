import { PromiseExecutor } from '../../Application/Promise/PromiseExecutor'
import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import { Config } from '../../Application/UseCase/createPopulation'
import populationWorkerUrl from './PopulationWorker?url'

export class PopulationWorkerFacade {
    private readonly worker: Worker
    private readonly promisedWorks: PromiseExecutor[] = []

    public constructor() {
        this.worker = new Worker(populationWorkerUrl, { type: 'module', name: 'PopulationWorker' })

        this.worker.onmessage = ({ data }) => {
            const [resolve, _] = this.promisedWorks.shift()!
            resolve(data)
        }

        this.worker.onerror = ({ message }) => {
            const [_, reject] = this.promisedWorks.shift()!
            reject(message)
        }
    }

    public init(config: Config): Promise<true> {
        const message: InitPopulationMessage = { action: WorkKind.InitPopulation, config }

        return new Promise<any>((resolve, reject) => {
            this.promisedWorks.push([resolve, reject])
            this.worker.postMessage(message, [config.targetImage.data.buffer])
        })
    }

    public evolveAndFindFittest(): Promise<TransferableGenotype> {
        const message: EvolvePopulationMessage = { action: WorkKind.EvolveAndFindFittest }

        return new Promise<any>((resolve, reject) => {
            this.promisedWorks.push([resolve, reject])
            this.worker.postMessage(message)
        })
    }
}

export enum WorkKind {
    InitPopulation,
    EvolveAndFindFittest,
}
export type InitPopulationMessage = {
    action: WorkKind.InitPopulation
    config: Config
}
export type EvolvePopulationMessage = {
    action: WorkKind.EvolveAndFindFittest
}
