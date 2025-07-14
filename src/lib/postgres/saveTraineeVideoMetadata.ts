/**
 * Middleware to write metadata to postgres
 * This register a video to a user
 */
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Set up a connection pool for Vercel Postgres
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Your Vercel Postgres URL
});

// VideoMetaData Interfact
interface VideoMetaDataProps {
  userId: string, 
  videoPath: string, 
  videoUrl: string
}

export async function saveVideoMetadataToDb({ userId, videoPath, videoUrl }: VideoMetaDataProps) {
  const client = await pool.connect();
  
  try {
    // TODO: user can add the same value over and over again
    // Insert video metadata into your database
    const query = `
      INSERT INTO videos (user_id, video_id, video_path, video_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const uuid = uuidv4();
    const values = [userId, uuid, videoPath, videoUrl];
    const result = await client.query(query, values);
    return result.rows[0]; // Return the saved video record
  } catch (error) {
    console.error('Error saving video metadata:', error);
    throw new Error('Failed to save video metadata');
  } finally {
    client.release();
  }
}
