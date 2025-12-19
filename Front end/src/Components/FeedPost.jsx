// FeedPost.jsx
import React, { useState } from "react";
import "../Styles/FeedPost.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
// In FeedPost.jsx

const Icons = {
  Up: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
    </svg>
  ),
  Down: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399 6.081 12H10V4h4v8h3.919L12 19.399z" />
    </svg>
  ),
  Comment: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
  ),
  Share: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
    </svg>
  ),
  Award: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c-3.31 0-6 2.69-6 6 0 1.18.34 2.28.96 3.22L4.6 19.72l6.33-2.11 1.07.36 1.07-.36 6.33 2.11-2.36-3.5c.62-.94.96-2.04.96-3.22 0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4 0 1.08-.43 2.06-1.13 2.78l-.04.03-2.83.94-2.83-.94-.04-.03A3.97 3.97 0 0 1 8 13c0-2.21 1.79-4 4-4z" />
    </svg>
  ),
};

const FeedPost = ({ post, onClick,currentUser }) => {
  const [voteCount, setVoteCount] = useState(post.upvotes);
  const [voteStatus, setVoteStatus] = useState(post.voteStatus||0);
  const [isJoined, setIsJoined] = useState(false);
  const [shareText, setShareText] = useState("Share");
  const [awards, setAwards] = useState(0);
  const navigate = useNavigate();


const handleVote = async (type) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const actionValue = type === "up" ? "up" : "down";

      const res = await api.post(`/posts/${post._id}/vote`, { action: actionValue });
      const { userVote, upvotesCount, downvotesCount } = res.data.data;

      const newVoteCount = upvotesCount - downvotesCount;
      setVoteCount(newVoteCount);

      setVoteStatus(userVote); // 1, -1, or 0
    } catch (err) {
      console.error(err);
    }
  };


  const handleShare = (e) => {
    e.stopPropagation();
    setShareText("Copied!");
    setTimeout(() => setShareText("Share"), 2000);
  };

  const isThumbnailLayout = post.thumbnail && !post.image;

  return (
    <div className="feed-post-container" onClick={onClick}>
      <div className="post-meta-header">
        <div className="sub-icon-img"></div>
        <span className="sub-name-text">{post.subreddit}</span>
        <span className="meta-dot">•</span>
        <span className="time-text">{post.time}</span>

        <button
          className={`join-btn-small ${isJoined ? "joined" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsJoined(!isJoined);
          }}
        >
          {isJoined ? "Joined" : "Join"}
        </button>

        <button className="dots-btn" onClick={(e) => e.stopPropagation()}>
          •••
        </button>
      </div>

      <div
        className={`post-main-content ${
          isThumbnailLayout ? "flex-content" : ""
        }`}
      >
        <div className="post-text-area">
          <h3 className="post-headline">{post.title}</h3>
          {post.content && <p className="post-body-text">{post.content}</p>}

          {post.linkDomain && (
            <a
              href="#"
              className="post-link-domain"
              onClick={(e) => e.stopPropagation()}
            >
              {post.linkDomain} <span className="open-icon">↗</span>
            </a>
          )}
        </div>

        {isThumbnailLayout && (
          <div className="post-thumbnail-wrapper">
            <img src={post.thumbnail} alt="thumb" className="post-thumbnail" />
            <div className="external-icon-overlay">↗</div>
          </div>
        )}

        {post.image && (
          <div className="post-image-container">
            <img src={post.image} alt="Post content" className="post-image" />
          </div>
        )}
      </div>

      <div className="post-footer-actions">
        <div className={`action-pill vote-pill ${voteStatus}`}>
          <button
            className={`icon-btn vote-up ${
              voteStatus === "up" ? "active" : ""
            }`}
            onClick={(e) => handleVote("up", e)}
          >
            <Icons.Up />
          </button>

          <span className={`vote-number ${voteStatus}`}>{voteCount}</span>

          <button
            className={`icon-btn vote-down ${
              voteStatus === "down" ? "active" : ""
            }`}
            onClick={(e) => handleVote("down", e)}
          >
            <Icons.Down />
          </button>
        </div>

        <div
          className="action-pill hover-bg" onClick={onClick}
        >
          <Icons.Comment />
          <span className="action-text">{post.comments}</span>
        </div>

        <div
          className="action-pill hover-bg"
          onClick={(e) => {
            e.stopPropagation();
            setAwards(awards + 1);
          }}
        >
          <Icons.Award />
          {awards > 0 && <span className="action-text">{awards}</span>}
        </div>

        <div className="action-pill hover-bg" onClick={handleShare}>
          <Icons.Share />
          <span className="action-text">{shareText}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
