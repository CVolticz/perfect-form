"use client";

/**
 * User Dashboard Component
 * Users can upload videos for trainers to view and comment on.
 * Users can also interact with trainers on this page.
 */

// System Level Import
import { useState, useEffect, Suspense } from 'react';

// Component Level Import
// import { VideoComponent } from "@/app/components/protected/VideoComponent"; // Adjust if needed

// Define the shape of video data
interface Video {
  id: number;
  title: string;
  videoUrl: string;
  comments: string[];
}

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  // Fetch videos from API
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch('/api/videos'); // Fetch from your API
        const data: Video[] = await response.json(); // Type the response as Video[]
        setVideos(data);
        setActiveVideoId(data[0]?.id || null); // Set the first video as active by default
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }

    fetchVideos();
  }, []);

  const handleAddComment = () => {
    if (newComment.trim() !== "" && activeVideoId !== null) {
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === activeVideoId
            ? { ...video, comments: [...video.comments, newComment] }
            : video
        )
      );
      setNewComment(""); // Clear comment input after submission
    }
  };

  // Force Next to render the current active video  
  const activeVideo = videos.find((video) => video.id === activeVideoId);


  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Left Side: Videos List */}
      <div style={{ flex: 1, backgroundColor: '#f4f4f4', padding: '20px', overflowY: 'auto', borderRight: '1px solid #ddd' }}>
        <h2>Videos</h2>
        <div>
          {videos.map((video) => (
            <div
              key={video.id}
              style={{
                padding: '10px',
                marginBottom: '10px',
                border: activeVideoId === video.id ? '2px solid #0070f3' : '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                backgroundColor: activeVideoId === video.id ? '#e0f7fa' : 'transparent',
              }}
              onClick={() => setActiveVideoId(video.id)}
            >
              {video.title}
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Active Video */}
      <div style={{ flex: 2, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <Suspense fallback={<p>Loading video...</p>}>
          {activeVideo ? (
            <VideoComponent key={activeVideo.videoUrl} videoUrl={activeVideo.videoUrl} />
          ) : (
            <p style={{ color: "#fff" }}>Select a video to play</p>
          )}
        </Suspense>
      </div>

      {/* Right Side: Comments */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'scroll', borderLeft: '1px solid #ccc' }}>
        <h2>Comments</h2>
        <div>
          {videos.find((video) => video.id === activeVideoId)?.comments.map((comment, index) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9',
              }}
            >
              {comment}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={{
              width: '100%',
              height: '80px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          ></textarea>
          <button
            onClick={handleAddComment}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// Video component that takes video URL as a prop
interface VideoComponentProps {
  videoUrl: string;
}

function VideoComponent({ videoUrl }: VideoComponentProps) {
  return (
    <div style={{ maxWidth: '800px', width: '100%' }}>
      <video controls width="100%" preload="auto">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
