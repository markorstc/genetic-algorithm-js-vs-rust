import { PopulationWorkerFacade } from '../Infrastructure/WebWorker/PopulationWorkerFacade'
import { RustPopulationWorkerFacade } from '../Infrastructure/WebWorker/RustPopulationWorkerFacade'
import { CanvasWorkerFacade } from '../Infrastructure/WebWorker/CanvasWorkerFacade'

export type EngineMode = 'js' | 'rust'

export class WebWorkers {
    private populationWorker?: PopulationWorkerFacade | RustPopulationWorkerFacade
    private canvasWorker?: CanvasWorkerFacade

    public constructor(private readonly mode: EngineMode = 'js') {}

    public get population(): PopulationWorkerFacade | RustPopulationWorkerFacade {
        if (!this.populationWorker) {
            this.populationWorker = this.mode === 'rust'
                ? new RustPopulationWorkerFacade()
                : new PopulationWorkerFacade()
        }
        return this.populationWorker
    }

    public get canvas(): CanvasWorkerFacade {
        return this.canvasWorker ??= new CanvasWorkerFacade()
    }

    public terminate(): void {
        if (this.populationWorker) {
            this.populationWorker.terminate()
        }
    }
}

