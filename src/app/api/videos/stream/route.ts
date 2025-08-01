'use server';
/**
 * Route handler for streaming video files from Azure Blob Storage.
 */
import { NextRequest, NextResponse } from 'next/server';

import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';


// Azure Blob Storage Configuration
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (!AZURE_CONTAINER_NAME) {
  throw new Error('Azure Storage connection string or container name is not set in environment variables.');
}

const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID!,
  process.env.AZURE_CLIENT_ID!,
  process.env.AZURE_CLIENT_SECRET!
);



export async function GET(req: NextRequest) {
  try {
    const blobPath = req.nextUrl.searchParams.get('path'); // full path: videos/{userId}/{fileName}
    if (!blobPath) {
      return new NextResponse('Missing blob path', { status: 400 });
    }

    if (!AZURE_CONTAINER_NAME) {
      return new NextResponse('Azure Storage connection string or container name is not set in environment variables', { status: 400 });
    }

    const blobServiceClient = new BlobServiceClient(
      `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      credential
    );
    const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
    const blobClient = containerClient.getBlobClient(blobPath);
    const downloadBlockBlobResponse = await blobClient.download();
    const readable = downloadBlockBlobResponse.readableStreamBody;

    if (!readable) {
      return new NextResponse('Failed to get blob stream', { status: 500 });
    }

    // Convert Node.js Readable to a web ReadableStream
    const { Readable } = await import('stream');

    // @ts-ignore
    const webStream = readable as any;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': downloadBlockBlobResponse.contentType || 'video/mov',
        'Content-Length': downloadBlockBlobResponse.contentLength?.toString() || '',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (err) {
    console.error('Error streaming video:', err);
    return new NextResponse('Failed to stream video', { status: 500 });
  }
}
