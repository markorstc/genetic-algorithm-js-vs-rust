import { EvaluableGeneticOperations } from './GeneticOperations'

export class Population<T extends EvaluableGeneticOperations> extends Array<T> {
    public fittest(): T {
        return this.sort()[0]
    }

    public evolve(): Population<T> {
        const parents = this
        const newborns = new Population<T>()

        const topParents = <Population<T>> parents
            .sort()
            .slice(0, Math.ceil(parents.length * .50))

        const immortals = topParents
            .slice(0, Math.ceil(topParents.length * .05))

        newborns.push(...immortals)

        while (newborns.length < parents.length) {
            // Sodom and Gomorrah
            const parentA = topParents.random()
            const parentB = topParents.random()

            let newborn = parentA.crossover(parentB)

            if (Math.random() < .25) {
                newborn = newborn.mutate()
            }

            newborns.push(newborn)
        }

        return newborns
    }

    public sort(compareFn?: (dnaA: T, dnaB: T) => number): this {
        if (compareFn === undefined) {
            return super.sort((dnaA, dnaB) => dnaB.fitness - dnaA.fitness)
        }

        return super.sort(compareFn)
    }

    public random(): T {
        return this[Math.floor(Math.random() * this.length)]
    }
}
