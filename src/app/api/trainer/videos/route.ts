/**
 * API Route for trainer to extract video from meta data
 */
// Library Level Import
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// Server Action Import
// import { saveVideoMetadataToDb } from '@/lib/postgres/saveTraineeVideoMetadata'; // Your function to save video metadata
import { getTrainerVideoMetadataFromDb } from '@/lib/postgres/getTrainerVideoMetadata'; // Your function to save video metadata

// API Level Import
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export async function GET() {
  // Handling user's authentication
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'trainer')) {
    return NextResponse.json({ error: 'Unautorized' }, { status: 401 })
  } else if (!session.user.id) {
    return NextResponse.json({ error: 'Trainer ID is missing' }, { status: 400 });
  }

  // Fetch Videos Metadata
  const videos = await getTrainerVideoMetadataFromDb({ trainerID: session.user.id });
  return NextResponse.json({ videos });
}