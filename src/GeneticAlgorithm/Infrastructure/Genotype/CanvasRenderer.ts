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
        this.ctx = canvas.getContext('2d') as RenderingContext2D
    }

    public renderGenotype({ genes }: Genotype) {
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
        }, x, y, width, height)

        if (shape.value === ShapeKind.Rectangle) {
            this.ctx.fillRect(+x, +y, +width, +height)
        }

        this.ctx.resetTransform()
    }

    private executeInCenter(
        execute: (ctx: RenderingContext2D) => void,
        x: Number,
        y: Number,
        width: Number,
        height: Number
    ): void {
        const [xC, yC] = this.calcCenter(+x, +y, +width, +height)

        this.ctx.translate(xC, yC)
        execute(this.ctx)
        this.ctx.translate(-xC, -yC)
    }

    private calcCenter(x: number, y: number, width: number, height: number): [x: number, y: number] {
        return [
            x + width / 2,
            y + height / 2,
        ]
    }

    private clear(): RenderingContext2D {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        return this.ctx
    }
}

type RenderingContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
