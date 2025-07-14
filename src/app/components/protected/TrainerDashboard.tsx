'use client';
/**
 * Trainer Dashboard Component
 * Use to pull in videos from all assigned trainee
 * Enable Trainer to provide comments on each video
 */
// System Level Import
import { useEffect, useState } from "react";

// Library Level Import
import { Session } from 'next-auth';
import { toast } from 'react-toastify';


interface TrainerDashboardClientProps {
    session: Session;
}

export default function TrainerDashboard({ session }: TrainerDashboardClientProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Videos on Component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  /**
   * Async function to perform GET request to get all videos data 
   * based on the trainer that queried it
   */
  async function fetchVideos() {
    try {
      if (!session?.user?.id) {
        toast.error('User ID not found');
        return;
      }
                  
      const response = await fetch(`/api/trainer/videos`, {
        method: 'GET',
      });

      const videos = await response.json(); // Type the response as Video[]
      console.log('Fetched videos:', videos);
      setVideos(videos);
      setLoading(false)
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
  }

  /**
   * Async function to handle posting comments
   * @param videoId - The ID of the video to comment on
   * @param content - The content of the comment
   */
  async function submitComment(videoId: number, content: string) {
    try {
      if (!session?.user?.id) {
        toast.error('User ID not found');
        return;
      }

      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoID: videoId, content }),
      });
      

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      toast.success('Comment posted successfully');
      fetchVideos(); // Refresh videos after posting a comment
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  }

  // Handle loading state
  if (loading) {
    return (
      <section className="py-24">
        <div className="container">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </section>
    );
  }

  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
      {videos.map(video => (
        <div key={video.id} className="border p-4 rounded shadow">
          <h2 className="font-semibold">{video.title} — {video.trainee_name}</h2>
          <video src={video.video_url} controls className="w-full my-2 rounded" />
          <h3 className="text-sm font-medium mb-1">Comments</h3>
          <ul className="text-sm space-y-1">
            {(video.comments || []).map((c: any, i: number) => (
              <li key={i}>– {c.content}</li>
            ))}
          </ul>
          <form
            className="mt-2"
            onSubmit={async (e) => {
              e.preventDefault()
              const content = (e.currentTarget.elements.namedItem('content') as HTMLInputElement).value
              await submitComment(video.id, content)
              e.currentTarget.reset()
            }}
          >
            <input
              type="text"
              name="content"
              placeholder="Add a comment..."
              className="border px-2 py-1 mr-2 rounded w-2/3"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Submit</button>
          </form>
        </div>
      ))}
    </div>
  )
}