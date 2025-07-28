// commentService.ts
import { prisma } from '@/lib/prisma';

export interface Comment {
  id: string;
  videoId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  authorName?: string | null;
}

/**
 * Creates a comment for a given video by an author.
 *
 * @param videoId - The ID of the video to comment on.
 * @param authorId - The ID of the user posting the comment.
 * @param content - The comment text content.
 * @returns The created comment object.
 */
export async function createComment(videoId: string, authorId: string, content: string): Promise<Comment> {
  const comment = await prisma.comment.create({
    data: {
      videoId,
      authorId,
      content,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    id: comment.id,
    videoId: comment.videoId,
    authorId: comment.authorId,
    content: comment.content,
    createdAt: comment.createdAt,
    authorName: comment.author?.name ?? null,
  };
}

/**
 * Fetches all comments for a given video, ordered by creation time ascending.
 *
 * @param videoId - The ID of the video.
 * @returns An array of comments.
 */
export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    where: { videoId },
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return comments.map((c) => ({
    id: c.id,
    videoId: c.videoId,
    authorId: c.authorId,
    content: c.content,
    createdAt: c.createdAt,
    authorName: c.author?.name ?? null,
  }));
}
