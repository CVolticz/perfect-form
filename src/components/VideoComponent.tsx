/**
 * Component to render video in a block
 */
// System level import
import { list } from '@vercel/blob'

/**
 * Video Block Interface
 */
interface VideoBlockProps {
    prefix: string;
    fileName: string;
}

/**
 * Video Block Component
 * @returns 
 */
export async function VideoComponent({ prefix, fileName }: VideoBlockProps) {
    const { blobs } = await list({
        prefix: prefix,
        limit: 1,
    })
    console.log(blobs)

    let url = blobs[0]['url'] + `${fileName}`;

    return (
        <video controls preload="none" aria-label="Video player">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    )
}