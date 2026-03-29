import { useEffect, useRef, useState } from 'react'
import { EngineMode, WebWorkers } from '../../Application/WebWorkers'
import css from './Canvas.module.css'

export default function Canvas({ targetImage, numberOfSquares, doEvolve, engineMode }: Props) {
    const workers = useRef<WebWorkers | null>(null)
    const canvas = useRef<HTMLCanvasElement>(null)
    const [fitness, setFitness] = useState<number | null>(null)
    const [generation, setGeneration] = useState(0)

    useEffect(() => {
        if (!doEvolve) {
            workers.current?.terminate()
            workers.current = null
            return
        }

        if (!targetImage) {
            return
        }

        const { width: canvasWidth, height: canvasHeight } = targetImage

        workers.current = new WebWorkers(engineMode)

        canvas.current!.width = canvasWidth
        canvas.current!.height = canvasHeight

        workers.current.canvas.init(canvas.current!.transferControlToOffscreen())
        workers.current.population.init({ numberOfShapes: numberOfSquares, targetImage, canvasWidth, canvasHeight });

        let active = true
        let gen = 0

        ;(async function draw() {
            if (!active) return
            try {
                const [bestGenotype, bestFitness] = await workers.current!.population.evolveAndFindFittest()
                workers.current!.canvas.renderGenotype(bestGenotype)
                setFitness(bestFitness)
                setGeneration(++gen)
            } catch (e) {
                console.error(e)
            }

            if (active) draw()
        })()

        return () => { active = false }
    }, [targetImage, numberOfSquares, doEvolve, engineMode])

    return (
        <output className={css.output}>
            <canvas ref={canvas}></canvas>
            {fitness !== null && (
                <small className={css.output__stats}>
                    Gen {generation} &mdash; Fitness {fitness.toFixed(2)}%
                </small>
            )}
        </output>
    )
}

type Props = {
    targetImage: ImageData | null
    numberOfSquares: number
    doEvolve: boolean
    engineMode: EngineMode
}

