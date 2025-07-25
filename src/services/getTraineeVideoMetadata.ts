import { prisma } from '@/lib/prisma';

interface GetVideoMetaDataProps {
  userId: string;
}

export async function getTraineeVideoMetadataFromDb({ userId }: GetVideoMetaDataProps) {
  try {
    const videos = await prisma.video.findMany({
      where: {
        userId: userId,
      },
      select: { // Select only the fields you need for the API response
        id: true,
        title: true,
        videoPath: true, // Needed for comparison with blob.name
        videoUrl: true,
        // If you had comments relation and wanted to include them:
        // comments: true,
      },
    });
    return videos;
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw new Error('Failed to retrieve video metadata');
  }
}