/**
 * API Route for video management
 */
// Library Level Import
import { NextRequest, NextResponse } from 'next/server';
import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';

// Server Action Import - PRISMA Functions
import { getTraineeVideoMetadataFromDb, saveTraineeVideoMetadataToDb } from '@/services/videoManagement';
import { getCommentsByVideoId } from '@/services/commentManagement';

// ------------------------------------------------------------------

// Define the shape of the Video interface
interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  authorName: string | null;
}

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  comments?: Comment[];
}

// Azure Blob Storage Configuration
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (!AZURE_CONTAINER_NAME) {
  throw new Error('Azure Storage connection string or container name is not set in environment variables.');
}

const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID!,
  process.env.AZURE_CLIENT_ID!,
  process.env.AZURE_CLIENT_SECRET!
);


// Authenticate to the blob and the container where your videos are stored
const blobServiceClient = new BlobServiceClient(`https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, credential);
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
    
    // --- Using Prisma to get video metadata ---
    const dbVideos = await getTraineeVideoMetadataFromDb({ userId });
    
    // Create a map for quick lookup by videoPath (blob.name)
    const dbVideoMap = new Map<string, typeof dbVideos[0]>();
    dbVideos.forEach((video: typeof dbVideos[0]) => dbVideoMap.set(video.videoPath, video));

    // Access Azure Blob Storage to get the list of video blobs
    const prefix = `videos/${userId}/`; 
    const videoBlobs: Video[] = [];

    for await (const blob of containerClient.listBlobsFlat({ prefix })) {
      const dbVideo = dbVideoMap.get(blob.name);
      console.log(`Processing blob: ${blob.name}, DB Video: ${dbVideo ? dbVideo.title : 'Not found'}`);
      if (dbVideo) { // Only include blobs that have corresponding metadata in the DB for this user
        // const videoUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${blob.name}`;
        const videoUrl = `/api/videos/stream?path=${blob.name}`;
        const comments = await getCommentsByVideoId(dbVideo.id);

        videoBlobs.push({
          id: dbVideo.id,                           // Blob name as ID
          title: dbVideo.title,                     // Get the actual video file name (e.g., video1.mp4)
          videoUrl: videoUrl,                       // URL to the video
          comments: comments.map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt,
            authorName: c.authorName || null, // Optional author name
          })),                             
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
    const userId = formData.get('userId') as string | '';
    const title = formData.get('title') as string | ''; // IMPORTANT: Add title here


    if (!file || !userId || !title) {
      return NextResponse.json({ error: 'Missing file, userId, or title' }, { status: 400 });
    }

    // Convert the file stream to ArrayBuffer
    const filename = `videos/${userId}/${file.name}`;
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
    const videoMetadata = await saveTraineeVideoMetadataToDb({
      userId: userId,
      title: title,
      videoPath: filename,
      videoUrl: videoUrl,
    });

    return NextResponse.json({ videoUrl, videoMetadata });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}

/**
 * Helper function to convert to video stream
 * @param stream 
 * @returns 
 */
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
