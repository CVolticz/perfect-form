import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

// Define the shape of the Video interface
interface Video {
  id: string;
  title: string;
  videoUrl: string;
  comments: string[];
}

// GET handler to get videos only from the "videos" subfolder
export async function GET(req: NextRequest) {
  try {
    // Initialize the BlobServiceClient using your connection string
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);

    // Get a reference to the container where your videos are stored
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME!);

    // Define the prefix for the "videos" subfolder
    const prefix = 'videos/';

    // List all blobs in the container with the "videos" prefix (subfolder)
    const videoBlobs: Video[] = [];
    for await (const blob of containerClient.listBlobsFlat({ prefix })) {
      const videoUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blob.name}?${process.env.AZURE_SAS_TOKEN}`;

      // Debugging: Log the video URL and SAS token
    //   console.log('Video URL:', videoUrl);
      
      videoBlobs.push({
        id: blob.name, // Blob name as ID
        title: blob.name.split('/').pop() || '', // Get the actual video file name (e.g., video1.mp4)
        videoUrl: videoUrl, // URL to the video
        comments: [], // Initialize empty comments array
      });
    }

    // Return the list of videos as a response
    return NextResponse.json(videoBlobs);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ message: 'Error fetching videos' }, { status: 500 });
  }
}
