export type PromiseExecutor = Readonly<[
    resolve: Parameters<PromiseExecutorFn>[0],
    reject: Parameters<PromiseExecutorFn>[1],
]>

type PromiseExecutorFn = ConstructorParameters<PromiseConstructorLike>[0]
