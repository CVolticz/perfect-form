/**
 * Middleware to read from postgres database
 * This fetch the user id and all associate values
 */
import { Pool } from 'pg';

// Set up a connection pool for Vercel Postgres
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Your Vercel Postgres URL
});


// VideoMetaData Interfact
interface VideoMetaDataProps {
    userId: string, 
}

export async function getVideoMetadataFromDb({ userId }: VideoMetaDataProps) {
    const client = await pool.connect();

    try {
        // Insert video metadata into your database
        const query = `
            SELECT video_path
            FROM videos
            WHERE user_id = $1
        `;
        const result = await client.query(query, [userId]);
        const videoName = result.rows.map(res => res.video_path);
        return videoName; // Return the saved video record
    } catch (error) {
        console.error('Error saving video metadata:', error);
        throw new Error('Failed to save video metadata');
    } finally {
        client.release();
    }
}
