'use server';
/**
 * Server Component to Update Username From MongoDB
 * TODO: Add other parameters for update
 */
// Library Level Import
import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

// Server Action Import - PRISMA Functions
import { saveTraineeVideoMetadataToDb } from '@/services/saveTraineeVideoMetadata';
import { getTraineeVideoMetadataFromDb } from '@/services/getTraineeVideoMetadata'; 
// ------------------------------------------------------------------

// import { updateUser } from '@/lib/mongo/users';


// // Define the function with proper TypeScript annotations
// export async function updateName(name: string, email: string): Promise<void> {
//   await updateUser(email, { name });
// }

/**
 * Function to get a list of users with their roles and relations from PRISMA
 * @param request: NextRequest
 * @returns NextResponse with JSON data of users
 */
export async function GET(request: NextRequest) {


}
