import { useEffect, useRef } from 'react'
import { WebWorkers } from '../../Application/WebWorkers'
import css from './Canvas.module.css'

export default function Cavas({ targetImage, numberOfSquares, doEvolve }: Props) {
    const workers = useRef(new WebWorkers()).current
    const canvas = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!doEvolve) {
            workers.terminate()
            return
        }

        if (!targetImage) {
            return
        }

        const { width: canvasWidth, height: canvasHeight } = targetImage

        canvas.current!.width = canvasWidth
        canvas.current!.height = canvasHeight

        workers.canvas.init(canvas.current!.transferControlToOffscreen())
        workers.population.init({ numberOfShapes: numberOfSquares, targetImage, canvasWidth, canvasHeight });

        (async function draw() {
            try {
                const [bestGenotype, _] = await workers.population.evolveAndFindFittest()
                workers.canvas.renderGenotype(bestGenotype)
            } catch (e) {
                console.error(e)
            }

            draw()
        })()
    }, [targetImage, numberOfSquares, doEvolve])

    return (
        <output className={css.output}>
            <canvas ref={canvas}></canvas>
        </output>
    )
}

type Props = {
    targetImage: ImageData | null
    numberOfSquares: number
    doEvolve: boolean
}
