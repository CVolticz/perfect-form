'use client';
/**
 * Trainer Dashboard Component
 * Use to pull in videos from all assigned trainees
 * Enable Trainer to provide comments on each video
 * LEFT PANEL: List of trainees assigned to this trainer
 * RIGHT PANEL: Shows selected trainee's videos with comment box
 */

// System Level Import
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';

// Library Level Import
import { Session } from 'next-auth';
import { toast } from 'react-toastify';

// Define the shape of video data
interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  authorName: string | null;
}

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  comments: Comment[];
}

interface Trainee {
  id: string;
  name: string;
}

interface TrainerDashboardClientProps {
  session: Session;
}

export default function TrainerDashboard({ session }: TrainerDashboardClientProps) {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');


  useEffect(() => {
    
    fetchTrainees();
  }, []);

  async function fetchTrainees() {
    try {
      if (!session?.user?.id) {
        toast.error('User ID not found');
        return;
      }
      const response = await fetch('/api/trainer/list', {
        method: 'POST',
        body: JSON.stringify({ trainerId: session.user.id, role: session.user.role }),
        headers: { 'Content-Type': 'application/json' },
      });
      const trainees: Trainee[] = await response.json();
      setTrainees(trainees);
    } catch (error) {
      console.error('Error fetching trainees:', error);
    }
  }

  /**
   * Async function to perform GET request to get data based on traineeID
   */
  async function fetchVideos(traineeId: string) {
    setLoading(true);
    try {
        const params = new URLSearchParams({
            userId: traineeId,
        }).toString();            
        const response = await fetch(`/api/videos?${params}`, {
            method: 'GET',
        }); 
        const data: Video[] = await response.json(); // Type the response as Video[]

        console.log('Fetched Videos:', data); // Debugging log
        setVideos(data);
        setActiveVideoId(data[0]?.id || null); // Set the first video as active by default
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
    setLoading(false);
  }

  async function submitComment(videoId: any, content: string) {
    console.log('Submitting comment:', { videoId, content });
    try {
      const formData = new FormData();
      formData.append('userId', String(session.user.id ?? ''));
      formData.append('role', String(session.user.role ?? ''));
      formData.append('videoId', videoId);
      formData.append('content', content);

      const response = await fetch('/api/comment', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to post comment');
      toast.success('Comment posted successfully');
      if (selectedTraineeId) fetchVideos(selectedTraineeId);
    } catch (error) {
      toast.error('Failed to post comment');
    }
  }

  function handleVideoSelect(videoId: any) {
    setActiveVideoId(videoId);
  }

  // Force Next to render the current active video (if any) 
  const activeVideo = Array.isArray(videos)
  ? videos.find((video) => video.id === activeVideoId)
  : null;

  return (
    <div className="flex flex-col md:flex-row w-full h-[932px]">
      {/* Top panel or left column: Trainee dropdown */}
      <div className="bg-gray-100 p-3 md:w-1/4 border-b md:border-b-0 md:border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">Select a Trainee</h2>
        <select
          className="w-full p-1.5 border rounded bg-white text-sm max-w-xs"
          value={selectedTraineeId ?? ''}
          onChange={(e) => {
            const traineeId = e.target.value;
            setSelectedTraineeId(traineeId);
            if (traineeId) fetchVideos(traineeId);
          }}
        >
          <option value="">-- Choose a trainee --</option>
          {trainees.map((trainee) => (
            <option key={trainee.id} value={trainee.id}>
              {trainee.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right panel: Videos for selected trainee */}
      <div className="flex-1 bg-black flex flex-col p-4 overflow-y-auto">
        <h2 className="text-white text-2xl font-semibold mb-4">Trainee Videos</h2>
        {loading ? (
          <p className="text-white">Loading videos...</p>
        ) : selectedTraineeId === null ? (
          <p className="text-white">Please select a trainee to view their videos.</p>
        ) : videos.length === 0 ? (
          <p className="text-white">No videos found for this trainee.</p>
        ) : (
          <>
            {/* Video selector dropdown */}
            <div className="mb-4">
              <label className="text-white block mb-2 font-medium">Select a video</label>
              <select
                className="w-full p-2 border rounded bg-white"
                value={activeVideoId ?? ''}
                onChange={(e) => handleVideoSelect(e.target.value)}
              >
                {videos.map((video) => (
                  <option key={video.id} value={video.id}>
                    {video.title || `Video ${video.id}`}
                  </option>
                ))}
              </select>
            </div>


            {/* Render selected video */}
            {Array.isArray(videos) && videos.length > 0 ? (
              activeVideo ? (
                <>
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Video section */}
                    <div className="bg-white rounded shadow p-4 flex justify-center items-center md:w-2/3">
                      <video
                        key={activeVideo.id}
                        src={activeVideo.videoUrl}
                        controls
                        className="max-w-full max-h-[450px] object-contain"
                      />
                    </div>

                    {/* Comments section */}
                    <div className="bg-white rounded shadow p-4 md:w-1/3 flex flex-col">
                      <h3 className="font-semibold mb-2">Comments</h3>
                      <ul>
                        {activeVideo.comments.map((comment, idx) => (
                          <li key={comment.id}>
                            <div className="text-sm text-gray-800">
                              <strong>{comment.authorName}</strong>: {comment.content}
                              <br />
                              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <textarea
                        rows={4}
                        className="w-full p-2 border rounded mt-2 resize-none"
                        placeholder="Write your comment here..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className="mt-2"
                        disabled={!commentText.trim()}
                        onClick={() => {
                          if (!commentText.trim()) return;
                          submitComment(activeVideo.id, commentText.trim());
                          setCommentText('');
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-white">Select a video to play</p>
              )
              ) : (
                <p className="text-white">
                  Please Select a Trainee to View Their Videos
                </p>
              )}
          </>
        )}
      </div>
    </div>
  );

}
