export interface GeneticOperations {
    crossover(dna: this): this
    mutate(): this
}
