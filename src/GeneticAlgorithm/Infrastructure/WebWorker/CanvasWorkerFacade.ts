import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import canvasWorkerUrl from './CanvasWorker?url'

export class CanvasWorkerFacade {
    private readonly worker: Worker
    private readonly workConsumers: WorkConsumer[] = []

    public constructor() {
        this.worker = new Worker(canvasWorkerUrl, { type: 'module', name: 'CanvasWorker' })

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

    public init(canvas: OffscreenCanvas): Promise<true> {
        return this.promiseWork(() => {
            const message: InitCanvasMessage = { action: WorkKind.InitCanvas, canvas }
            this.worker.postMessage(message, [canvas])
        })
    }

    public renderGenotype(genotype: TransferableGenotype): Promise<true> {
        return this.promiseWork(() => {
            const message: RenderGenotypeMessage = { action: WorkKind.RenderGenotype, genotype }
            this.worker.postMessage(message, genotype.genes.map(({ buffer }) => buffer))
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
    InitCanvas,
    RenderGenotype,
}
export type InitCanvasMessage = {
    action: WorkKind.InitCanvas
    canvas: OffscreenCanvas
}
export type RenderGenotypeMessage = {
    action: WorkKind.RenderGenotype,
    genotype: TransferableGenotype,
}
type WorkConsumer = [
    resolve: Parameters<PromiseExecutor>[0],
    reject: Parameters<PromiseExecutor>[1],
    defferedWork?: { startWorking: () => void },
]
type PromiseExecutor = ConstructorParameters<PromiseConstructorLike>[0]
