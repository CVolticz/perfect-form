import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Add 'videos/' prefix to the file path
        const videoPathname = `videos/${pathname}`;

        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        return {
          allowedContentTypes: ['video/mp4', 'video/mov'], // Adjust as needed
          pathname: videoPathname,
          tokenPayload: JSON.stringify({
            customPath: videoPathname, // Custom data sent with the token
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Notify on client upload completion
        console.log('Blob upload completed', blob);

        try {
          // Extract the custom path if needed
          const { customPath } = JSON.parse(tokenPayload);

          // Add any custom logic here, such as saving blob metadata to a database
          console.log(`Uploaded file saved at path: ${customPath}`);
        } catch (error) {
          throw new Error('Could not process upload metadata');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // Webhook retries if not 200
    );
  }
}
