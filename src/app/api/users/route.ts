'use server';
/**
 * Server Component to Update Username From MongoDB
 * TODO: Add other parameters for update
 */
import { updateUser } from '@/lib/mongo/users';


// Define the function with proper TypeScript annotations
export async function updateName(name: string, email: string): Promise<void> {
  await updateUser(email, { name });
}
