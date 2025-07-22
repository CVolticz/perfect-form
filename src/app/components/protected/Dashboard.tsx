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
import { Libre_Caslon_Display } from 'next/font/google';


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
            const response = await fetch(`/api/videos?${params}`, {
                method: 'GET',
            }); 
            const data: Video[] = await response.json(); // Type the response as Video[]
            console.log('Fetched videos:', data);
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
        <div style={{ display: 'flex', height: '75vh', fontFamily: 'Arial, sans-serif'}}>
            {/* Left Side: Videos List */}
            <div style={{ flex: 1, backgroundColor: '#f4f4f4', padding: '20px', overflowY: 'auto', borderRight: '1px solid #ddd' }}>
                <h2>Videos</h2>
                <div>
                    {Array.isArray(videos) && videos.length > 0 ? (
                    videos.map((video) => (
                    <div
                        key={video.id}
                        style={{
                            padding: '10px',
                            marginBottom: '10px',
                            border: activeVideoId === video.id ? '2px solid #0070f3' : '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            backgroundColor: activeVideoId === video.id ? '#e0f7fa' : 'transparent'}}
                            onClick={() => setActiveVideoId(video.id)}
                        >
                            {video.title}
                        </div>
                    ))) :
                    (
                        <p>
                            No Videos Found
                        </p>
                    )}
                </div>
            </div>

            {/* Middle: Active Video */}
            <div style={{ flex: 2, backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                <Suspense fallback={<p>Loading video...</p>}>
                {Array.isArray(videos) && videos.length > 0 ? activeVideo ? (
                    <VideoComponent key={activeVideo.videoUrl} videoUrl={activeVideo.videoUrl} />
                ) : ( 
                    <p style={{ color: "#fff" }}>Select a video to play</p>
                ) : (
                    <p style={{ color: "#fff" }}>Welcome Trainee! Please Upload Your Videos to Receive Feedbacks</p>
                )}

                </Suspense>
            </div>

            {/* Right Side: Comments */}
            <div style={{ flex: 1, backgroundColor: '#f4f4f4', padding: '20px', overflowY: 'auto', borderRight: '1px solid #ddd' }}>
                <h2>Comments</h2>
                <div>
                    {Array.isArray(videos) && videos.length > 0 ? ( 
                        videos.find((video) => video.id === activeVideoId)?.comments.map((comment, index) => (
                        <div
                            key={index}
                            style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9'}}
                        > 
                            {comment} 
                        </div>
                    ))):
                    (
                        <p>
                            Welcome Trainee! Please Upload Your Videos to Receive Feedbacks
                        </p>
                    )}
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
                    {/* <button
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
                    </button> */}
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
