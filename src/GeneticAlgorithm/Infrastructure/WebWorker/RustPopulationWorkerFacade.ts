import { PromiseExecutor } from '../../Application/Promise/PromiseExecutor'
import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import { Config } from '../../Application/UseCase/createPopulation'
import { WorkKind, InitPopulationMessage, EvolvePopulationMessage } from './PopulationWorkerFacade'
import RustWorkerClass from './RustPopulationWorker?worker'

export class RustPopulationWorkerFacade {
    private readonly worker: Worker
    private readonly promisedWorks: PromiseExecutor[] = []

    public constructor() {
        this.worker = new RustWorkerClass()

        this.worker.onmessage = ({ data }) => {
            const [resolve, _] = this.promisedWorks.shift()!
            resolve(data)
        }

        this.worker.onerror = ({ message }) => {
            const [_, reject] = this.promisedWorks.shift()!
            reject(message)
        }
    }

    public async init(config: Config): Promise<true> {
        const message: InitPopulationMessage = { action: WorkKind.InitPopulation, config }

        return new Promise<any>((resolve, reject) => {
            this.promisedWorks.push([resolve, reject])
            this.worker.postMessage(message, [config.targetImage.data.buffer])
        })
    }

    public async evolveAndFindFittest(): Promise<[genotype: TransferableGenotype, fitness: number]> {
        const message: EvolvePopulationMessage = { action: WorkKind.EvolveAndFindFittest }

        return new Promise<any>((resolve, reject) => {
            this.promisedWorks.push([resolve, reject])
            this.worker.postMessage(message)
        })
    }

    public terminate(): void {
        this.worker.terminate()
    }
}
