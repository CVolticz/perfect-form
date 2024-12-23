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
}

/**
 * Video Block Component
 * @returns 
 */
export async function VideoComponent({ prefix }: VideoBlockProps) {
    const { blobs } = await list({
        prefix: prefix,
        limit: 1,
        token: process.env.BLOB_READ_WRITE_TOKEN
    })
    const url = blobs[0]?.url || '';
    console.log(url);
    return (
        <video controls 
            style={{ width: '90%', height: 'auto' }} preload="none" aria-label="Video player">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    )
}


