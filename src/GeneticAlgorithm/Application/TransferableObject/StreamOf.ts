/**
 * Convert tuple or array into transferable object (typed array Uint16Array).
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects}
 */
export type StreamOf<T extends [...any]> = {
    [P in keyof T]: number
} & Uint16Array
