/**
 * API to handle comments posting and fetching
 */
// Library Level Import
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// Server Action Import
// import { saveVideoMetadataToDb } from '@/lib/postgres/saveTraineeVideoMetadata'; // Your function to save video metadata
// import { getTrainerVideoMetadataFromDb } from '@/lib/postgres/getTrainerVideoMetadata'; // Your function to save video metadata

// API Level Import
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export async function POST(req: NextRequest) {
  // Handling user's authentication
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'trainer')) {
    return NextResponse.json({ error: 'Unautorized' }, { status: 401 });
  } else if (!session.user.id) {
    return NextResponse.json({ error: 'Trainer ID is missing' }, { status: 400 });
  }

  // save comments to postgres if exists
  const { videoID, content } = await req.json();
  if  (!videoID || !content ){
    return NextResponse.json({ error: 'Missing Video ID or Comment'}, { status: 400 });
  }

  await sql `
    INSERT INTO comments (video_id, author_id, content)
    VALUES (${videoID}, ${session.user.id}, ${content})
  `;

  return NextResponse.json({success: true});
}