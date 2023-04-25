import { PopulationWorkerFacade } from '../Infrastructure/WebWorker/PopulationWorkerFacade'
import { CanvasWorkerFacade } from '../Infrastructure/WebWorker/CanvasWorkerFacade'

export class WebWorkers {
    private populationWorker?: PopulationWorkerFacade
    private canvasWorker?: CanvasWorkerFacade

    public get population(): PopulationWorkerFacade {
        return this.populationWorker ??= new PopulationWorkerFacade()
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
