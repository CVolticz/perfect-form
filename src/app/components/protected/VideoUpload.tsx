'use client';
/**
 * Video Upload Component to allow users to upload videos
 * and save metadata to the database.
 */
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

const VideoUpload = () => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpload = async () => {
    setMessage(null);

    if (!session?.user?.id) {
      setMessage({ text: 'User ID not found', type: 'error' });
      return;
    }

    if (!fileInputRef.current?.files?.[0]) {
      setMessage({ text: 'No file selected', type: 'error' });
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', session.user.id);
    formData.append('title', file.name);
    setUploading(true);

    try {
      const response = await fetch('/api/videos/trainee', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || data?.error) {
        throw new Error(data?.error || 'Failed to upload video');
      }

      setMessage({ text: 'Video uploaded successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'An error occurred', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Upload Video</h1>

        <input
          type="file"
          ref={fileInputRef}
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>

        {message && (
          <p
            className={`mt-4 font-medium ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
