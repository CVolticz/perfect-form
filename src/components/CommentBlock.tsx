/**
 * Functional Component to render a comment block
 */
// system level import
import React from 'react';


/**
 * CommentBlock Interface
 */
interface CommentBlockProps {
    text: string;
}

function CommentBlock({text}: CommentBlockProps) {
    return(
      <div
        style={{
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {text}
      </div>
    )
}

export default CommentBlock;
