'use client';
/**
 * User Dashboard Component
 * Per User authentication, rendering user's upload videos and
 * Any associate comments assigned to user videoID
 */
// System Level Import
import { useState, useEffect, Suspense } from 'react';

// Library Level Import
import { Session } from 'next-auth';
import { toast } from 'react-toastify';


// Define the shape of comment and video data
interface Comment {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  comments: Comment[];
}

interface DashboardClientProps {
    session: Session;
}
  
function Dashboard({ session }: DashboardClientProps) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [activeVideoId, setActiveVideoId] = useState<number | null>(null);


    // Fetch videos from API via clientside useEffect (refresh on pageload)
    useEffect(() => {
        fetchVideos();
    }, []);

    /**
     * Async function to perform GET request to get data based on users
     */
    async function fetchVideos() {
        try {
            if (!session?.user?.id) {
                toast.error('User ID not found');
                return;
            }
            const params = new URLSearchParams({
                userId: session.user.id,
            }).toString();            
            const response = await fetch(`/api/videos?${params}`, {
                method: 'GET',
            }); 
            const data: Video[] = await response.json(); // Type the response as Video[]
            setVideos(data);
            setActiveVideoId(data[0]?.id || null); // Set the first video as active by default
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }


    function handleVideoSelect(videoId: any) {
        setActiveVideoId(videoId);
    }
    // /**
    //  * TODO: refactor this to fetch comments instead
    //  * User should not be able to leave any comment
    //  */
    // const handleAddComment = () => {
    //     if (newComment.trim() !== "" && activeVideoId !== null) {
    //         setVideos((prevVideos) =>
    //             prevVideos.map((video) =>
    //                 video.id === activeVideoId
    //                 ? { ...video, comments: [...video.comments, newComment] }
    //             : video
    //         ));
    //         setNewComment(""); // Clear comment input after submission
    //     }
    // };


    // Force Next to render the current active video (if any) 
    const activeVideo = Array.isArray(videos)
    ? videos.find((video) => video.id === activeVideoId)
    : null;
    
    return (
      <div className="flex-1 bg-black flex flex-col p-4 overflow-y-auto">
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
                    key={activeVideo.videoUrl}
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
      </div>
    );
}

export default Dashboard;