import { TransferableGene as GeneDTO } from '../../Application/TransferableObject/DTO/TransferableGene'
import { TransferableGenotype as GenotypeDTO } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import { Gene as GeneEntity } from '../../Domain/Gene/Gene'
import { ShapeKind } from '../../Domain/Gene/ValueObject/Muton/Shape'
import { Genotype as GenotypeEntity } from '../../Domain/Genotype/Genotype'

export class CanvasRenderer {
    private readonly canvasWidth: number
    private readonly canvasHeight: number
    private readonly ctx: RenderingContext2D

    public constructor(canvas: HTMLCanvasElement | OffscreenCanvas, willReadFrequently = false) {
        this.canvasWidth = canvas.width
        this.canvasHeight = canvas.height
        this.ctx = canvas.getContext('2d', { willReadFrequently }) as RenderingContext2D
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
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b}, ${a}%)`
        
        this.executeInCenter(ctx => {
            ctx.rotate(+rotation * Math.PI / 180)
        }, +x, +y)

        let [top, left] = this.calcTopLeft(+x, +y, +width, +height)

        if (+shape === ShapeKind.Rectangle) {
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
type Genotype = GenotypeEntity | GenotypeDTO
type Gene = GeneEntity | GeneDTO
