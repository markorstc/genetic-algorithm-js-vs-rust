import { CanvasRenderer } from '../Genotype/CanvasRenderer'
import { InitCanvasMessage, RenderGenotypeMessage, WorkKind } from './CanvasWorkerFacade'

let renderer: CanvasRenderer | undefined

self.onmessage = function ({ data }: MessageEvent<Message>) {
    switch (data.action) {
        case WorkKind.InitCanvas:
            renderer = new CanvasRenderer(data.canvas)
            self.postMessage(true)

            break
        case WorkKind.RenderGenotype:
            if (!renderer) {
                throw new Error('Canvas must be initialized first.')
            }

            requestAnimationFrame(() => {
                renderer!.renderGenotype(data.genotype)
                self.postMessage(true)
            })

            break
        default:
            throw new Error(`Unsupported action [${(data as any).action}] for ${self.name}.`)
    }
}

type Message = InitCanvasMessage | RenderGenotypeMessage
declare var self: DedicatedWorkerGlobalScope
