import { Genotype } from '../Genotype/Genotype'

export class Population<T extends Genotype> extends Array<T> {

    public async fittest(): Promise<T | undefined> {
        // TODO refactor
        await Promise.all(this.map(dna => dna.resolveFitness()))

        return this.sort((dnaA, dnaB) => dnaB.fitness! - dnaA.fitness!)[0]
    }

    public async evolve(): Promise<Population<T>> {
        const parents = this
        const newborns = new Population<T>()

        const topParents = parents.slice(0, Math.ceil(parents.length * .33)) as Population<T>
        const immortals = parents.slice(0, Math.ceil(parents.length * .05))

        newborns.push(...immortals)

        while (newborns.length < parents.length) {
            // Sodom and Gomorrah
            const parentA = topParents.random()!
            const parentB = parents.random()!

            let newborn = parentA.crossover(parentB)

            if (Math.random() < .20) {
                newborn = newborn.mutate()
            }

            newborns.push(newborn)
        }

        return newborns
    }

    public random(): T | undefined {
        return this[Math.floor(Math.random() * this.length)]
    }

    public async resolveFitness(): Promise<this> {
        await Promise.all(this.map(dna => dna.resolveFitness()))

        return this.sort((dnaA, dnaB) => dnaB.fitness! - dnaA.fitness!)
    }
}
