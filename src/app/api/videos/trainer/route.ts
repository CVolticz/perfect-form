/**
 * API Route for trainer to extract video from meta data
 */
// Library Level Import
import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';


// Server Action Import
// import { saveVideoMetadataToDb } from '@/lib/postgres/saveTraineeVideoMetadata'; // Your function to save video metadata
import { getTrainerVideoMetadataFromDb } from '@/lib/postgres/getTrainerVideoMetadata'; // Your function to save video metadata


// Define the shape of the Video interface
interface Video {
  id: string;
  title: string;
  videoUrl: string;
  comments: string[];
}

// Azure Blob Storage Configuration
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING || !AZURE_CONTAINER_NAME) {
  throw new Error('Azure Storage connection string or container name is not set in environment variables.');
}

// Initialize the BlobServiceClient using your connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// Get a reference to the container where your videos are stored
const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);


/**
 * GET handler to get videos only from the "videos" subfolder
 * @param request: GET request body params
 * @returns JSON string containing video object
 */
export async function GET(request: NextRequest) {

  try {
    // TODO: Maintain this metadata database
    // Extract the search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '';

    if (!userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    // Fetch Videos Metadata
    const videoList = await getTrainerVideoMetadataFromDb({ trainerID: userId});


    // Define the prefix for the "videos" subfolder
    // List all blobs in the container with the "videos" prefix (subfolder) and get all videos assigned to the user
    const prefix = 'videos/';
    const videoBlobs: Video[] = [];
    for await (const blob of containerClient.listBlobsFlat({ prefix })) {
      if (videoList.includes(blob.name)) {
        const videoUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${blob.name}?${process.env.AZURE_SAS_TOKEN}`;
        videoBlobs.push({
          id: blob.name,                            // Blob name as ID
          title: blob.name.split('/').pop() || '',  // Get the actual video file name (e.g., video1.mp4)
          videoUrl: videoUrl,                       // URL to the video
          comments: [],                             // Initialize empty comments array
        });
      }
    }
  
      // Return the list of videos as a response
      return NextResponse.json(videoBlobs);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ message: 'Error fetching videos' }, { status: 500 });
  }
}