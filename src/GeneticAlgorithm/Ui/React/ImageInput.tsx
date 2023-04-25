import { useState, ChangeEvent, DragEvent, useCallback } from 'react'
import css from './ImageInput.module.css'

export default function ImageInput({ onImageData }: Props) {
    const [file, setFile] = useState<File>()
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setFile(e.currentTarget.files?.item(0) ?? undefined)

    const onDrop = (e: DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files.item(0)
        file?.type.match(/^image/) && setFile(file)
    }

    const onImage = useCallback(async (img: HTMLImageElement) => {
        onImageData(await extractImageData(img))
    }, [])

    return (
        <div className={css.imageInput} onDrop={onDrop} onDragOver={e => e.preventDefault()}>
            {file
                ? <img className={css.imageInput__img} src={URL.createObjectURL(file)} ref={onImage} />
                : <>
                    <p>Drag & Drop Image</p>
                    <p>OR</p>
                    <input className={css.imageInput__input} type="file" accept="image/*" onChange={onChange} />
                  </>
            }
        </div>
    )
}

async function extractImageData(img: HTMLImageElement): Promise<ImageData> {
    await img.decode()
    const { width, height } = img

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx!.drawImage(img, 0, 0, width, height)

    return ctx!.getImageData(0, 0, width, height)
}

type Props = { onImageData: (imgData: ImageData) => void }
