import { WorkKind, InitCanvasMessage, RenderGenotypeMessage } from '../../Application/WebWorkers'
import { CanvasRenderer } from '../Genotype/CanvasRenderer'

let renderer: CanvasRenderer | null = null

self.onmessage = function ({ data }: MessageEvent<Message>) {
    switch (data.action) {
        case WorkKind.InitCanvas:
            renderer = new CanvasRenderer(data.canvas)
            self.postMessage(undefined)
            break

        case WorkKind.RenderGenotype:
            if (!renderer) {
                throw new Error('Canvas must be initialized first.')
            }
            requestAnimationFrame(() => {
                renderer!.renderGenotype(data.genotype)
                self.postMessage(undefined)
            })
            break

        default:
            throw new Error(`Unsupported action [${(data as any).action}] for ${self.name}.`)
    }
}

type Message = InitCanvasMessage | RenderGenotypeMessage

declare var self: DedicatedWorkerGlobalScope
