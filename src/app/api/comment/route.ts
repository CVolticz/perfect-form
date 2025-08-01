'use server';
/**
 * Server Comment API for handling comments on videos
 */
// Library Level Import
import { NextRequest, NextResponse } from 'next/server';

// Service Level Import
import { createComment, getCommentsByVideoId } from '@/services/commentManagement';


export async function POST(request: NextRequest): Promise<NextResponse> {

  // Parse form data and get the file and userId from the request
  const formData = await request.formData();
  const userId = formData.get('userId') as string | '';
  const role = formData.get('role') as string | '';
  const videoId = formData.get('videoId') as string | '';
  const content = formData.get('content') as string | '';

  console.log('Received form data:', {  userId, role, videoId, content });

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized! Missing userId' }, { status: 400 });
  }

  // Only trainer & admin role is allowed to post comments
  if (role === 'USER') {
    return NextResponse.json({ error: 'Unauthorized! Only Trainer can post comments' }, {
      status: 403,
  })};

  if (!videoId) {
    return NextResponse.json({ error: 'Missing Video ID' }, { status: 400 });
  }

  try {
    const newComment = await createComment(
      videoId,
      userId,
      content
    );
    return NextResponse.json(newComment);
  } catch (error: any) {
    console.error('Error saving comment:', error);
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}
