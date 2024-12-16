/**
 * API Component use to upload video to vercel blob storage 
 * When upload register the video to a user given the session.user.id
 */
// Library Level Import
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Server Action Import
import { saveVideoMetadataToDb } from '@/lib/postgres/saveVideoMetadata'; // Your function to save video metadata

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse form data and get the file and userId from the request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    // Generate a unique filename for the uploaded video
    const filename = `videos/${file.name}`;

    // Upload the file to Vercel Blob Storage using the 'put' function
    const blob = await put(filename, file.stream(), {
      access: 'public', // Set the file access to public
    });

    // Store the video metadata in PostgreSQL
    const videoMetadata = await saveVideoMetadataToDb({
      userId: userId,
      videoPath: filename,
      videoUrl: blob.url, // Store the URL of the uploaded video
    });

    // Return the URL of the uploaded video
    return NextResponse.json({ videoUrl: blob.url, videoMetadata });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}