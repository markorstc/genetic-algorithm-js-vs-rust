import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import { Config } from '../../Application/UseCase/createPopulation'
import { EvalGenotypeFitness } from '../../Domain/Genotype/EvalGenotypeFitness'
import { Genotype } from '../../Domain/Genotype/Genotype'
import { FitnessWorkerFacade } from './FitnessWorkerFacade'

export class FitnessWorkerPool implements EvalGenotypeFitness {
    private readonly freeWorkers = new Array<FitnessWorkerFacade>()
    private readonly occupiedWorkers = new Set<FitnessWorkerFacade>()
    private readonly promisedWorkers = new Array<(w: FitnessWorkerFacade) => void>()

    public constructor(private readonly config: Config, private readonly numberOfThreads: number) {}

    public async evalGenotypeFitness(genotype: Genotype): Promise<number> {
        const worker = await this.getWorker()
        const genotypeDTO = TransferableGenotype.create(genotype)

        return worker.evalGenotypeFitness(genotypeDTO)
    }

    private async getWorker(): Promise<FitnessWorkerFacade> {
        return new Promise(resolve => {
            if (this.freeWorkers.length) {
                const worker = this.freeWorkers.pop()!

                this.occupiedWorkers.add(worker)
                resolve(worker)

                return
            }

            this.promisedWorkers.push(resolve)

            if (this.occupiedWorkers.size < this.numberOfThreads) {
                this.createWorker()
            }
        })
    }

    private createWorker(): void {
        const worker = new FitnessWorkerFacade()

        worker.onfinish = this.disposeWorker.bind(this)

        worker.init(this.config)
        this.occupiedWorkers.add(worker)
    }

    private disposeWorker(worker: FitnessWorkerFacade): void {
        if (this.promisedWorkers.length) {
            const resolvePromise = this.promisedWorkers.shift()!
            resolvePromise(worker)
        } else {
            this.occupiedWorkers.delete(worker)
            this.freeWorkers.push(worker)
        }
    }
}
