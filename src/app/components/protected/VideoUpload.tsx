'use client';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const VideoUpload = () => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!session?.user?.id) {
      toast.error('User ID not found');
      return;
    }

    if (!fileInputRef.current?.files?.[0]) {
      toast.error('No file selected');
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', session.user.id);

    setUploading(true);

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success('Video uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Video</h1>
      <input type="file" ref={fileInputRef} />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
};

export default VideoUpload;