import { Gene } from '../../Domain/Gene/Gene'
import { ShapeKind } from '../../Domain/Gene/ValueObject/Muton/Shape'
import { Genotype } from '../../Domain/Genotype/Genotype'
import { RenderGenotype } from '../../Domain/Genotype/RenderGenotype'

export class CanvasRenderer implements RenderGenotype {
    private readonly canvasWidth: number
    private readonly canvasHeight: number
    private readonly ctx: RenderingContext2D

    public constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
        this.canvasWidth = canvas.width
        this.canvasHeight = canvas.height

        const settings: CanvasRenderingContext2DSettings = {}

        if (canvas instanceof OffscreenCanvas) {
            settings.willReadFrequently = true
        }

        this.ctx = canvas.getContext('2d', settings) as RenderingContext2D
    }

    public renderGenotype({ genes }: Genotype): RenderingContext2D {
        this.clear()
        genes.forEach(gene => this.renderGene(gene))

        return this.ctx
    }

    public renderGenotypeImage(genotype: Genotype): ImageData {
        return this.renderGenotype(genotype).getImageData(0, 0, this.canvasWidth, this.canvasHeight)
    }

    private renderGene([ r, g, b, a, shape, x, y, width, height, rotation ]: Gene): void {
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b}, ${a})`
        
        this.executeInCenter(ctx => {
            ctx.rotate(+rotation * Math.PI / 180)
        }, +x, +y)

        let [top, left] = this.calcTopLeft(+x, +y, +width, +height)

        if (shape.value === ShapeKind.Rectangle) {
            this.ctx.fillRect(top, left, +width, +height)
        }

        this.ctx.resetTransform()
    }

    private executeInCenter(execute: (ctx: RenderingContext2D) => void, x: number, y: number): void {
        this.ctx.translate(x, y)
        execute(this.ctx)
        this.ctx.translate(-x, -y)
    }

    private calcTopLeft(x: number, y: number, width: number, height: number): [x: number, y: number] {
        return [
            y - height / 2,
            x - width / 2,
        ]
    }

    private clear(): RenderingContext2D {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        return this.ctx
    }
}

type RenderingContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
