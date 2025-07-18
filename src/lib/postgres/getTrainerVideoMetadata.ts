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
interface TrainerVideoMetaDataProps {
  trainerID: string, 
}

export async function getTrainerVideoMetadataFromDb({ trainerID }: TrainerVideoMetaDataProps) {
    const client = await pool.connect();

    try {
        const query = `
            SELECT
              v.video_url, 
              v.video_path, 
              v.video_id, 
              v.uploaded_at
              u.name as trainee_name
              json_agg(json_build_object('content', c.content, 'created_at', c.created_at))
                FILTER (WHERE c.id IS NOT NULL) AS comments
            FROM trainer_trainee_map m
            JOIN videos v ON v.user_id = m.trainee_id
            LEFT JOIN comments c ON c.video_id = v.video_id
            WHERE m.trainer_id = $1
            GROUP BY v.id, u.name
            ORDER BY v.uploaded_at DESC;
        `;
        const result = await client.query(query, [trainerID]);
        return result.rows; // Return the saved video record
    } catch (error) {
        console.error('Error fetching video metadata:', error);
        throw new Error('Failed to fetch video metadata');
    } finally {
        client.release();
    }
}
