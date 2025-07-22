'use client';
/**
 * Trainer Dashboard Component
 * Use to pull in videos from all assigned trainee
 * Enable Trainer to provide comments on each video
 */
// System Level Import
import { useEffect, useState, Suspense } from "react";

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

      console.log('Response status:', response.status);
      if (response.status === 200) {
        const videos = await response.json(); // Type the response as Video[]
        setVideos(videos);
      } 
      setLoading(false);
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

  console.log('Videos:', videos);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Trainer Dashboard</h1>

      {/* Handle case when no videos are available */}
      {/* <div className="text-center py-12 text-stone-500"> */}
      <Suspense fallback={<p>Loading video...</p>}>
        {Array.isArray(videos) && videos.length > 0 ? (
            videos.map((video) => (
              <VideoComponent key={video.video_id} videoUrl={video.video_url} />
          ))) : (
            <p style={{ color: "#fff" }}>Welcome Trainee! Please Upload Your Videos to Receive Feedbacks</p>
        )}
      </Suspense>
      {/* </div> */}
    </div>
  )
}



// TODO: refactor this to VideoComponent.tsx
// Video component that takes video URL as a prop
interface VideoComponentProps {
    videoUrl: string;
}

function VideoComponent({ videoUrl }: VideoComponentProps) {
  return (
    <video 
      controls 
      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
      preload="auto">
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}



