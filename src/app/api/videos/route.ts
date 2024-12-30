/**
 * API Component for video management
 */
// Library Level Import
import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

// Server Action Import
import { saveVideoMetadataToDb } from '@/lib/postgres/saveVideoMetadata'; // Your function to save video metadata


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
    // Define the prefix for the "videos" subfolder
    const prefix = 'videos/';

    // List all blobs in the container with the "videos" prefix (subfolder)
    const videoBlobs: Video[] = [];
    for await (const blob of containerClient.listBlobsFlat({ prefix })) {
      const videoUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${blob.name}?${process.env.AZURE_SAS_TOKEN}`;

      // Debugging: Log the video URL and SAS token
      // console.log('Video URL:', videoUrl);
      
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


/**
 * API Component to upload video to Azure Blob Storage
 * When uploaded, register the video to a user given the session.user.id
 * @param request: POST request body params
 * @returns JSON string containing upload messag
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse form data and get the file and userId from the request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    // Convert the file stream to ArrayBuffer
    const filename = `videos/${file.name}`;
    const arrayBuffer = await streamToArrayBuffer(file.stream());

    // Upload the file to Azure Blob Storage
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(arrayBuffer, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    // Store the video metadata in PostgreSQL
    const videoUrl = blockBlobClient.url;
    const videoMetadata = await saveVideoMetadataToDb({
      userId: userId,
      videoPath: filename,
      videoUrl: videoUrl,
    });

    return NextResponse.json({ videoUrl, videoMetadata });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}


async function streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer> {
  const reader = stream.getReader();
  const chunks = [];
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = streamDone;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
  const arrayBuffer = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    arrayBuffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return arrayBuffer.buffer;
}
