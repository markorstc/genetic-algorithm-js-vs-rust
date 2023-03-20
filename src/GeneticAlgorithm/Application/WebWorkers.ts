import { Config } from './Command/createPopulation'
import CanvasWorkerUrl from '../Infrastructure/WebWorker/CanvasWorker?url'
import PopulationWorkerUrl from '../Infrastructure/WebWorker/PopulationWorker?url'
import { TransferableGenotype } from './TransferableObject/DTO/TransferableGenotype'

export class WebWorkers {
    private populationWorker?: PopulationWorker
    private canvasWorker?: CanvasWorker

    public get population(): PopulationWorker {
        return this.populationWorker ??= this.populationWorkerFacade(
            new Worker(PopulationWorkerUrl, { type: 'module', name: 'PopulationWorker' })
        )
    }

    public get canvas(): CanvasWorker {
        return this.canvasWorker ??= this.canvasWorkerFacade(
            new Worker(CanvasWorkerUrl, { type: 'module', name: 'CanvasWorker' })
        )
    }

    private populationWorkerFacade(worker: Worker): PopulationWorker {
        return {
            init: this.initPopulationFn(worker),
            evolveAndFindFittest: this.evolvePopulationAndFindFittestFn(worker),
        }
    }

    private canvasWorkerFacade(worker: Worker): CanvasWorker {
        return {
            init: this.initCanvasFn(worker),
            renderGenotype: this.renderGenotypeFn(worker),
        }
    }

    private initPopulationFn(worker: Worker): (config: Config) => Promise<void> {
        return (config) => {
            return new Promise((resolve, reject) => {
                worker.addEventListener('message', ...this.createMessageListener(resolve))
                worker.addEventListener('error', ...this.createErrorListener(reject))
                const message: InitPopulationMessage = { action: WorkKind.InitPopulation, config }
                worker.postMessage(message)
            })
        }
    }

    private evolvePopulationAndFindFittestFn(worker: Worker): () => Promise<TransferableGenotype> {
        return () => {
            return new Promise((resolve, reject) => {
                worker.addEventListener('message', ...this.createMessageListener(resolve))
                worker.addEventListener('error', ...this.createErrorListener(reject))
                const message: EvolvePopulationMessage = { action: WorkKind.EvolveAndFindFittest }
                worker.postMessage(message)
            })
        }
    }

    private initCanvasFn(worker: Worker): (canvas: OffscreenCanvas) => Promise<void> {
        return (canvas) => {
            return new Promise((resolve, reject) => {
                worker.addEventListener('message', ...this.createMessageListener(resolve))
                worker.addEventListener('error', ...this.createErrorListener(reject))
                const message: InitCanvasMessage = { action: WorkKind.InitCanvas, canvas }
                worker.postMessage(message, [canvas])
            })
        }
    }

    private renderGenotypeFn(worker: Worker): (genotype: TransferableGenotype) => Promise<void> {
        return (genotype) => {
            return new Promise((resolve, reject) => {
                worker.addEventListener('message', ...this.createMessageListener(resolve))
                worker.addEventListener('error', ...this.createErrorListener(reject))
                const message: RenderGenotypeMessage = { action: WorkKind.RenderGenotype, genotype }
                worker.postMessage(message, genotype.genes.map(({ buffer }) => buffer))
            })
        }
    }

    private createMessageListener(resolve: (value: any) => void): [MessageListener, AddEventListenerOptions] {
        return [
            function ({ data }) {
                resolve(data)
            },
            { once: true },
        ]
    }

    private createErrorListener(reject: (reason?: any) => void): [ErrorListener, AddEventListenerOptions] {
        return [
            function (ev) {
                ev.preventDefault()
                reject(ev.message)
            },
            { once: true },
        ]
    }
}

export enum WorkKind {
    InitPopulation,
    InitCanvas,
    EvolveAndFindFittest,
    RenderGenotype,
}

export type InitPopulationMessage = {
    action: WorkKind.InitPopulation
    config: Config
}

export type EvolvePopulationMessage = {
    action: WorkKind.EvolveAndFindFittest
}

export type InitCanvasMessage = {
    action: WorkKind.InitCanvas,
    canvas: OffscreenCanvas,
}

export type RenderGenotypeMessage = {
    action: WorkKind.RenderGenotype,
    genotype: TransferableGenotype,
}

type CanvasWorker = {
    init(canvas: OffscreenCanvas): Promise<void>
    renderGenotype(genotype: TransferableGenotype): Promise<void>
}

type PopulationWorker = {
    init(config: Config): Promise<void>
    evolveAndFindFittest(): Promise<TransferableGenotype>
}

type MessageListener = (ev: MessageEvent) => void

type ErrorListener = (ev: ErrorEvent) => void
