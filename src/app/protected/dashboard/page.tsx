"use client";
/**
 * User Dashboard Component
 * Users can upload videos for trainers to view and comment on.
 * Users can also interact with trainers on this page.
 */

// System Level Import
import { useState } from 'react';

export default function Dashboard() {
  const [videos, setVideos] = useState([
    { id: 1, url: "/sample-video1.mp4", comments: ["Great video!", "This was super helpful."] },
    { id: 2, url: "/sample-video2.mp4", comments: ["Amazing explanation!", "Very clear and concise."] }
  ]);

  const [newComment, setNewComment] = useState("");
  const [activeVideoId, setActiveVideoId] = useState(videos[0]?.id || null);

  const handleAddComment = () => {
    if (newComment.trim() !== "" && activeVideoId !== null) {
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === activeVideoId
            ? { ...video, comments: [...video.comments, newComment] }
            : video
        )
      );
      setNewComment("");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Left Side: Videos List */}
      <div style={{ flex: 1, backgroundColor: '#f4f4f4', padding: '10px', overflowY: 'auto' }}>
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
              }}
              onClick={() => setActiveVideoId(video.id)}
            >
              Video {video.id}
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Active Video */}
      <div style={{ flex: 2, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {activeVideoId && (
          <video controls style={{ width: '90%', height: 'auto' }}>
            <source
              src={videos.find((video) => video.id === activeVideoId)?.url}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
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
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
