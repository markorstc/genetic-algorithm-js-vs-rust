import { PromiseExecutor } from '../../Application/Promise/PromiseExecutor'
import { TransferableGenotype } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import canvasWorkerUrl from './CanvasWorker?url'

export class CanvasWorkerFacade {
    private readonly worker: Worker
    private readonly promisedWorks: PromiseExecutor[] = []

    public constructor() {
        this.worker = new Worker(canvasWorkerUrl, { type: 'module', name: 'CanvasWorker' })

        this.worker.onmessage = ({ data }) => {
            const [resolve, _] = this.promisedWorks.shift()!
            resolve(data)
        }

        this.worker.onerror = ({ message }) => {
            const [_, reject] = this.promisedWorks.shift()!
            reject(message)
        }
    }

    public async init(canvas: OffscreenCanvas): Promise<true> {
        const message: InitCanvasMessage = { action: WorkKind.InitCanvas, canvas }

        return new Promise<any>((resolve, reject) => {
            this.promisedWorks.push([resolve, reject])
            this.worker.postMessage(message, [canvas])
        })
    }

    public async renderGenotype(genotype: TransferableGenotype): Promise<true> {
        const message: RenderGenotypeMessage = { action: WorkKind.RenderGenotype, genotype }

        return new Promise<any>((resolve, reject) => {
            this.promisedWorks.push([resolve, reject])
            this.worker.postMessage(message, genotype.genes.map(({ buffer }) => buffer))
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
