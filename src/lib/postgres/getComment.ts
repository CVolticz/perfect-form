/**
 * Middleware to read from postgres database
 * This fetch all comments from given videoID 
 */
import { Pool } from 'pg';

// Set up a connection pool for Vercel Postgres
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Your Vercel Postgres URL
});


// VideoMetaData Interfact
interface CommentDataProps {
    videoId: string, 
}

export async function getComment({ videoId }: CommentDataProps) {
    const client = await pool.connect();

    try {
        // Insert video metadata into your database
        const query = `
            SELECT comment
            FROM comments
            WHERE videoId = $1
        `;
        const result = await client.query(query, [videoId]);
        const commentList = result.rows.map(res => res.comment);
        return commentList; // Return the saved video record
    } catch (error) {
        console.error('Error saving video metadata:', error);
        throw new Error('Failed to save video metadata');
    } finally {
        client.release();
    }
}
