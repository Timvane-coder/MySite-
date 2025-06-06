// components/SocialPost.js
import React from 'react';

const SocialPost = ({ post, delay = 0 }) => {
  return (
    <div 
      className="social-post" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="post-content">{post.content}</div>
      <div className="post-engagement">
        <span className="likes">❤️ {post.likes} likes</span>
        {post.warning && <span className="warning-flag">⚠️</span>}
      </div>
    </div>
  );
};

export default SocialPost;
