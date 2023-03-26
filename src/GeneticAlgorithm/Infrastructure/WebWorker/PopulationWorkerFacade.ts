import { Config } from '../../Application/Command/createPopulation'
import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import populationWorkerUrl from './PopulationWorker?url'

export class PopulationWorkerFacade {
    private readonly worker: Worker
    private readonly workConsumers: WorkConsumer[] = []

    public constructor() {
        this.worker = new Worker(populationWorkerUrl, { type: 'module', name: 'PopulationWorker' })

        this.worker.onmessage = ({ data }) => {
            const [resolve, _, defferedWork] = this.workConsumers.shift()!
            resolve(data)
            defferedWork?.startWorking()
        }

        this.worker.onerror = ({ message }) => {
            const [_, reject, defferedWork] = this.workConsumers.shift()!
            reject(message)
            defferedWork?.startWorking()
        }
    }

    public init(config: Config): Promise<true> {
        return this.promiseWork(() => {
            const message: InitPopulationMessage = { action: WorkKind.InitPopulation, config }
            this.worker.postMessage(message)
        })
    }

    public evolveAndFindFittest(): Promise<TransferableGenotype> {
        return this.promiseWork(() => {
            const message: EvolvePopulationMessage = { action: WorkKind.EvolveAndFindFittest }
            this.worker.postMessage(message)
        })
    }

    private promiseWork<T>(startWorking: () => void): Promise<T> {
        return new Promise<any>((resolve, reject) => {
            const numberOfPromises = this.workConsumers.push([resolve, reject])

            if (numberOfPromises === 1) {
                startWorking()
            } else {
                this.workConsumers[numberOfPromises - 1].push({ startWorking })
            }
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
type WorkConsumer = [
    resolve: Parameters<PromiseExecutor>[0],
    reject: Parameters<PromiseExecutor>[1],
    defferedWork?: { startWorking: () => void },
]
type PromiseExecutor = ConstructorParameters<PromiseConstructorLike>[0]
