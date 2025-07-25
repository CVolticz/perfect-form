import { prisma } from '@/lib/prisma';

// VideoMetaData Interface - you need to add 'title' here as per your Prisma model
interface VideoMetaDataProps {
  userId: string;
  title: string; // Add title as it's a required field in your Prisma model
  videoPath: string;
  videoUrl: string;
}

/**
 * Saves video metadata to the database using Prisma.
 * @param {VideoMetaDataProps} { userId, title, videoPath, videoUrl } - Video metadata.
 * @returns {Promise<Video>} The created video record.
 * @throws {Error} If saving video metadata fails.
 */
export async function saveTraineeVideoMetadataToDb({ userId, title, videoPath, videoUrl }: VideoMetaDataProps) {
  try {
    // Prisma automatically handles UUID generation for 'id' and 'createdAt'
    const createdVideo = await prisma.video.create({
      data: {
        userId: userId,
        title: title, // Make sure to provide a title
        videoPath: videoPath,
        videoUrl: videoUrl,
        // createdAt is @default(now()) so Prisma handles it
        // id is @default(uuid()) so Prisma handles it
      },
    });

    return createdVideo;
  } catch (error) {
    console.error('Error saving video metadata:', error);
    // You might want to check for specific Prisma errors (e.g., P2002 for unique constraint violations)
    throw new Error('Failed to save video metadata. Please try again.');
  }
}

// Example usage (e.g., in an API route or server component):
/*
import { saveVideoMetadataToDb } from './services/videoService';

async function handleUpload(req, res) {
  const { userId, title, videoPath, videoUrl } = req.body; // Assuming these come from request body

  try {
    const newVideo = await saveVideoMetadataToDb({
      userId,
      title,
      videoPath,
      videoUrl,
    });
    res.status(200).json({ message: 'Video metadata saved successfully', video: newVideo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
*/