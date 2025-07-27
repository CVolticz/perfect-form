'use client';
/**
 * Trainer Dashboard Component
 * Use to pull in videos from all assigned trainees
 * Enable Trainer to provide comments on each video
 * LEFT PANEL: List of trainees assigned to this trainer
 * RIGHT PANEL: Shows selected trainee's videos with comment box
 */

// System Level Import
import { useEffect, useState, Suspense } from "react";

// Library Level Import
import { Session } from 'next-auth';
import { toast } from 'react-toastify';

// Define the shape of video data
interface Video {
  id: number;
  title: string;
  videoUrl: string;
  comments: string[];
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

  async function fetchVideos(traineeId: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos/trainee?traineeId=${traineeId}`);
      const videos: Video[] = await response.json();
      setVideos(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function submitComment(videoId: number, content: string) {
    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoID: videoId, content }),
      });
      if (!response.ok) throw new Error('Failed to post comment');
      toast.success('Comment posted successfully');
      if (selectedTraineeId) fetchVideos(selectedTraineeId);
    } catch (error) {
      toast.error('Failed to post comment');
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-[932px]">
      {/* Top panel or left column: Trainee dropdown */}
      <div className="bg-gray-100 p-4 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">Select a Trainee</h2>
        <select
          className="w-full p-2 border rounded bg-white"
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
          <div className="space-y-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded shadow p-4">
                <video
                  controls
                  className="w-full max-h-[400px] object-contain mb-2"
                  preload="auto"
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
                <div className="space-y-2">
                  <h3 className="font-semibold">Comments</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {video.comments.map((comment, idx) => (
                      <li key={idx}>{comment}</li>
                    ))}
                  </ul>
                  <textarea
                    rows={2}
                    className="w-full p-2 border rounded mt-2"
                    placeholder="Write your comment here..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const content = e.currentTarget.value.trim();
                        if (content) {
                          submitComment(video.id, content);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}
