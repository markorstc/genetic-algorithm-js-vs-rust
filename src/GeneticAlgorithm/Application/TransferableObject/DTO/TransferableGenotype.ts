import { Genotype } from '../../../Domain/Genotype/Genotype'
import { TransferableGene } from './TransferableGene'

export const TransferableGenotype = {
    create: function ({ genes }: Genotype): TransferableGenotype {
        const geneStreams = genes.map(gene => {
            return new Uint16Array(gene.map(muton => muton.valueOf())) as TransferableGene
        })

        return { genes: geneStreams }
    }
} as const

export type TransferableGenotype = Readonly<{
    genes: ReadonlyArray<TransferableGene>
}>
