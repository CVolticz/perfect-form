/**
 * Middleware for video management operations.
 * This includes fetching video metadata for trainers and trainees.
 */
import { prisma } from '@/lib/prisma';


// ------------------------------------------------------------------

interface GetVideoMetaDataProps {
  userId: string;
}

interface SaveVideoMetaDataProps {
  userId: string;
  title: string; 
  videoPath: string;
  videoUrl: string;
}

// ------------------------------------------------------------------

/**
 * GET video metadata from the database using Prisma.
 * @param {GetVideoMetaDataProps} { userId } - User ID to fetch videos for.
 * @returns {Promise<Video[]>} A promise that resolves to an array of video metadata.
 * @throws {Error} If getting video metadata fails.
 */
export async function getTraineeVideoMetadataFromDb({ userId }: GetVideoMetaDataProps) {
  try {
    const videos = await prisma.video.findMany({
      where: {
        userId: userId,
      },
      select: { 
        id: true,
        title: true,
        videoPath: true,
        videoUrl: true,
      },
    });
    return videos;
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw new Error('Failed to retrieve video metadata');
  }
}


/**
 * Saves video metadata to the database using Prisma.
 * @param {VideoMetaDataProps} { userId, title, videoPath, videoUrl } - Video metadata.
 * @returns {Promise<Video>} The created video record.
 * @throws {Error} If saving video metadata fails.
 */
export async function saveTraineeVideoMetadataToDb({ userId, title, videoPath, videoUrl }: SaveVideoMetaDataProps) {
  try {
    // Prisma automatically handles UUID generation for 'id' and 'createdAt'
    const createdVideo = await prisma.video.create({
      data: {
        userId: userId,
        title: title, // Make sure to provide a title
        videoPath: videoPath,
        videoUrl: videoUrl,
      },
    });

    return createdVideo;
  } catch (error) {
    console.error('Error saving video metadata:', error);
    throw new Error('Failed to save video metadata. Please try again.');
  }
}