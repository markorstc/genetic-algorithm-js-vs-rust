import { useRef } from 'react'
import { WebWorkers } from '../../Application/WebWorkers'

export async function useImageData(img: HTMLImageElement): Promise<ImageData> {
    await img.decode()
    const { width, height } = img

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx!.drawImage(img, 0, 0, width, height)
    
    return ctx!.getImageData(0, 0, width, height)
}

export function useWebWorkers(): WebWorkers {
    return useRef(new WebWorkers()).current
}

export type Config = {
    numberOfShapes: number
    targetImage: ImageData
    canvasWidth: number
    canvasHeight: number
    populationSize?: number
}
