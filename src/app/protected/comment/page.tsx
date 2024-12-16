'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import CommentBlock from '../../components/protected/CommentBlock';

interface Comment {
  id: number;
  text: string;
}

const CommentPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>('');

  // Handle form submission
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (commentText.trim() === '') return;

    const newComment: Comment = {
      id: Date.now(),
      text: commentText,
    };

    setComments([...comments, newComment]);
    setCommentText(''); // Clear the input field
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCommentText(e.target.value);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Post a Comment</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={handleInputChange}
          style={{
            padding: '10px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginRight: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Post
        </button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <h2>Comments</h2>
        {comments.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {comments.map((comment) => (
              <li key={comment.id}>
                <CommentBlock text={comment.text} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
};

export default CommentPage;
