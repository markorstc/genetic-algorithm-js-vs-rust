export interface GeneticOperations {
    crossover(dna: this): this
    mutate(): this
}

export interface EvaluableGeneticOperations extends GeneticOperations {
    fitness: number
}
