import { PromiseExecutor } from '../../Application/Promise/PromiseExecutor'
import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import { Config } from '../../Application/UseCase/createPopulation'
import fitnessWorkerUrl from './FitnessWorker?url'

export class FitnessWorkerFacade {
    public onfinish?: (worker: this) => void
    private readonly worker: Worker
    private readonly promisedWorks: PromiseExecutor[] = []

    public constructor() {
        this.worker = new Worker(fitnessWorkerUrl, { type: 'module', name: 'PopulationWorker' })

        this.worker.onmessage = ({ data }) => {
            const [resolve, _] = this.promisedWorks.shift()!
            resolve(data)
            this.onfinish && this.onfinish(this)
        }

        this.worker.onerror = ({ message }) => {
            const [_, reject] = this.promisedWorks.shift()!
            reject(message)
            this.onfinish && this.onfinish(this)
        }
    }

    public init(config: Config): Promise<true> {
        const message: InitMessage = { action: WorkKind.Init, config }

        return new Promise<any>((resolve, reject) => {
            this.promisedWorks.push([resolve, reject])
            this.worker.postMessage(message)
        })
    }

    public evalGenotypeFitness(genotype: TransferableGenotype): Promise<number> {
        const message: EvalFitnessMessage = { action: WorkKind.EvalGenotypeFitness, genotype }

        return new Promise<any>((resolve, reject) => {
            this.promisedWorks.push([resolve, reject])
            this.worker.postMessage(message, genotype.genes.map(({ buffer }) => buffer))
        })
    }
}

export enum WorkKind {
    Init,
    EvalGenotypeFitness,
}
export type InitMessage = {
    action: WorkKind.Init
    config: Config
}
export type EvalFitnessMessage = {
    action: WorkKind.EvalGenotypeFitness
    genotype: TransferableGenotype
}
