'use client';
/**
 * Client Page Component For User to Upload Assignment and Receive Feedbacks
 * TODO: Update student-assignment link through database
 */
import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { type PutBlobResult } from '@vercel/blob';

export default function AvatarUploadClient() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      alert('No file selected');
      return;
    }

    const file = inputFileRef.current.files[0];

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      setBlob(newBlob);
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          name="file"
          ref={inputFileRef}
          type="file"
          required
          className="block w-full border p-2 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Upload
        </button>
      </form>
      {blob && (
        <div className="mt-4">
          <p>Blob URL:</p>
          <a href={blob.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            {blob.url}
          </a>
        </div>
      )}
    </>
  );
}
