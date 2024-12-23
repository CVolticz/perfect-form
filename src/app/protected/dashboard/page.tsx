"use client";
/**
 * User Dashboard Component
 * User can upload video for trainers to view and comments on
 * User can also interacts with trainers on this page
 */
// System Level Import
import { useState } from 'react';

// Package Level Import
// Component Level Import


export default function Dashboard() {

  const [comments, setComments] = useState(["Great video!", "This was super helpful.", "Can you do more on this topic?"]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Left Side: Video */}
      <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <video controls style={{ width: '90%', height: 'auto' }}>
          <source src="/sample-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Side: Comments */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'scroll', borderLeft: '1px solid #ccc' }}>
        <h2>Comments</h2>
        <div>
          {comments.map((comment, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              {comment}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={{ width: '100%', height: '80px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          ></textarea>
          <button
            onClick={handleAddComment}
            style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}