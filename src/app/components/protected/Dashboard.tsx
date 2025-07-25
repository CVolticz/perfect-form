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


// Define the shape of video data
interface Video {
  id: number;
  title: string;
  videoUrl: string;
  comments: string[];
}

interface DashboardClientProps {
    session: Session;
}
  
function Dashboard({ session }: DashboardClientProps) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [newComment, setNewComment] = useState<string>("");
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
            const response = await fetch(`/api/videos/trainee?${params}`, {
                method: 'GET',
            }); 
            const data: Video[] = await response.json(); // Type the response as Video[]
            setVideos(data);
            setActiveVideoId(data[0]?.id || null); // Set the first video as active by default
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }

    /**
     * TODO: refactor this to fetch comments instead
     * User should not be able to leave any comment
     */
    const handleAddComment = () => {
        if (newComment.trim() !== "" && activeVideoId !== null) {
            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video.id === activeVideoId
                    ? { ...video, comments: [...video.comments, newComment] }
                : video
            ));
            setNewComment(""); // Clear comment input after submission
        }
    };


    // Force Next to render the current active video (if any) 
    const activeVideo = Array.isArray(videos)
    ? videos.find((video) => video.id === activeVideoId)
    : null;

    console.log('Active Video:', activeVideo);
    
    return (
        <div className="flex h-[932px] font-sans">
            {/* Left Side: Videos List */}
            <div className="flex-1 bg-[#f4f4f4] p-5 overflow-y-auto border-r border-[#ddd]">
                <h2>Videos</h2>
                <div>
                {Array.isArray(videos) && videos.length > 0 ? (
                    videos.map((video) => (
                    <div
                        key={video.id}
                        className={`p-2 mb-2 rounded cursor-pointer transition-colors ${
                        activeVideoId === video.id
                            ? 'border-2 border-[#0070f3] bg-[#e0f7fa]'
                            : 'border border-[#ddd]'
                        }`}
                        onClick={() => setActiveVideoId(video.id)}
                    >
                        {video.title}
                    </div>
                    ))
                ) : (
                    <p>No Videos Found</p>
                )}
                </div>
            </div>

            {/* Middle: Active Video */}
            <div className="flex-[2] bg-black flex justify-center items-center p-2 overflow-hidden">
                <Suspense fallback={<p className="text-white">Loading video...</p>}>
                    {Array.isArray(videos) && videos.length > 0 ? (
                    activeVideo ? (
                        <div className="h-full flex justify-center items-center">
                        <video
                            key={activeVideo.videoUrl}
                            src={activeVideo.videoUrl}
                            controls
                            className="max-h-full max-w-full object-contain"
                        />
                        </div>
                    ) : (
                        <p className="text-white">Select a video to play</p>
                    )
                    ) : (
                    <p className="text-white">
                        Welcome Trainee! Please Upload Your Videos to Receive Feedbacks
                    </p>
                    )}
                </Suspense>
            </div>

            {/* Right Side: Comments */}
            <div className="flex-1 bg-[#f4f4f4] p-5 overflow-y-auto border-l border-[#ddd]">
                <h2>Comments</h2>
                <div>
                {Array.isArray(videos) && videos.length > 0 ? (
                    videos
                    .find((video) => video.id === activeVideoId)
                    ?.comments.map((comment, index) => (
                        <div
                        key={index}
                        className="mb-2 p-2 border border-[#ddd] rounded bg-[#f9f9f9]"
                        >
                        {comment}
                        </div>
                    ))
                ) : (
                    <p>Welcome Trainee! Please Upload Your Videos to Receive Feedbacks</p>
                )}
                </div>
                <div className="mt-5">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full h-20 p-2 border border-[#ddd] rounded resize-none"
                ></textarea>
                </div>
            </div>
            </div>
    );
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

export default Dashboard;
