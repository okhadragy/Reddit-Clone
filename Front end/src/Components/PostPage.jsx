import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../Styles/PostPage.css";

/* ---- ICONS (unchanged, keep yours) ---- */
const Icons = {
  // Uses stroke (Outline style)
  Back: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  // Uses fill (Solid style)
  Up: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
    </svg>
  ),
  // Uses fill (Solid style)
  Down: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399 6.081 12H10V4h4v8h3.919L12 19.399z" />
    </svg>
  ),
  // Uses fill
  Comment: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
  ),
  // ... rest of your icons (Save, Share, etc.)
  Save: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
    </svg>
  ),
  Share: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
    </svg>
  ),
  Image: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  ),
  Gif: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 12h3m-3 0v4m0-4V8m16 4h-3m3 0v4m0-4V8m-7 4v4m0-4V8m-3 4h3"></path>
    </svg>
  ),
};

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [voteStatus, setVoteStatus] = useState("none");
  const [isSaved, setIsSaved] = useState(false);
  const [shareText, setShareText] = useState("Share");
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Post ---------------- */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const fetchedPost = res.data.data.post;

        setPost(fetchedPost);
        setComments(fetchedPost.comments || []);
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) return <div className="post-loading">Loading...</div>;
  if (!post) return null;

  /* ---------------- Voting ---------------- */
  const handleVote = async (type) => {
    try {
      await api.post(`/posts/${post._id}/vote`, { action: type });

      setPost((prev) => ({
        ...prev,
        upvotesCount:
          type === "up"
            ? prev.upvotesCount + 1
            : prev.upvotesCount,
        downvotesCount:
          type === "down"
            ? prev.downvotesCount + 1
            : prev.downvotesCount,
      }));

      setVoteStatus(type);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Save Post ---------------- */
  const toggleSave = async () => {
    try {
      await api.post(`/posts/${post._id}/save`);
      setIsSaved((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Add Comment ---------------- */
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/comments/${post._id}`, {
        text: newComment,
      });

      setComments((prev) => [res.data.data.comment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Vote Comment ---------------- */
  const handleCommentVote = async (commentId, action) => {
    try {
      await api.post(`/comments/vote/${commentId}`, { action });

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
              ...c,
              upvotesCount:
                action === "up"
                  ? c.upvotesCount + 1
                  : c.upvotesCount,
              downvotesCount:
                action === "down"
                  ? c.downvotesCount + 1
                  : c.downvotesCount,
            }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Share ---------------- */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText("Copied!");
    setTimeout(() => setShareText("Share"), 2000);
  };

  const now = new Date();
  const createdAt = new Date(post.createdAt);

  let years = now.getFullYear() - createdAt.getFullYear();
  let months = now.getMonth() - createdAt.getMonth();
  let days = now.getDate() - createdAt.getDate();
  let hours = now.getHours() - createdAt.getHours();
  let minutes = now.getMinutes() - createdAt.getMinutes();
  let seconds = now.getSeconds() - createdAt.getSeconds();

  // Adjust if necessary
  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }

  if (hours < 0) {
    days--;
    hours += 24;
  }

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); // last day of previous month
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Determine display
  let postTime;
  if (years > 0) {
    postTime = `${years}y`;
  } else if (months > 0) {
    postTime = `${months}m`;
  } else if (days > 0) {
    postTime = `${days}d`;
  } else if (hours > 0) {
    postTime = `${hours}h`;
  } else if (minutes > 0) {
    postTime = `${minutes}m`;
  } else {
    postTime = `${seconds}s`;
  }

  return (
    <div className="post-page-container">
      {/* Navbar */}
      <div className="post-nav-bar">
        <button className="back-btn-nav" onClick={() => navigate(-1)}>
          <Icons.Back /> Back
        </button>
      </div>

      <div className="layout-grid">
        <div className="main-col">
          {/* -------- Post -------- */}
          <div className="post-card">
            <div className="post-header-bar">
              <span className="sub-name">
                r/{post.community?.name}
              </span>
              <span className="meta-dot">•</span>
              <span className="user-meta">
                Posted by u/{post.author?.name} {" "}
                {postTime || "1d"} {" ago"}
              </span>
            </div>

            <div className="post-title-block">
              <h1 className="post-title">{post.title}</h1>
              <span className="flair-tag">{post.flair || "Discussion"}</span>
            </div>

            {post.media && post.media.length > 0 && (
              <div className="post-media-container">
                {post.media.map((mediaUrl, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/uploads/posts/${mediaUrl}`}
                    alt={`Post media ${index + 1}`}
                    className="post-image-content"
                  />
                ))}
              </div>
            )}

            <div className="post-body-text">{post.content || ""}</div>

            {/* Footer */}
            <div className="post-footer-actions">
              <div className="vote-pill">
                <button
                  className={`icon-btn up ${voteStatus === "up" ? "active" : ""
                    }`}
                  onClick={() => handleVote("up")}
                >
                  <Icons.Up />
                </button>

                <span className="vote-score">
                  {post.upvotesCount - post.downvotesCount}
                </span>

                <button
                  className={`icon-btn down ${voteStatus === "down" ? "active" : ""
                    }`}
                  onClick={() => handleVote("down")}
                >
                  <Icons.Down />
                </button>
              </div>

              <button className="action-pill">
                <Icons.Comment /> {comments.length}
              </button>

              <button
                className={`action-pill ${isSaved ? "active-save" : ""}`}
                onClick={toggleSave}
              >
                <Icons.Save /> {isSaved ? "Saved" : "Save"}
              </button>

              <button className="action-pill" onClick={handleShare}>
                <Icons.Share /> {shareText}
              </button>
            </div>
          </div>

          {/* -------- Comment Input -------- */}
          <div className="comment-input-area">
            <textarea
              className="comment-textarea"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
            />
            <button
              className={`comment-btn-submit ${newComment.trim() ? "active" : ""
                }`}
              onClick={handleCommentSubmit}
            >
              Comment
            </button>
          </div>

          {/* -------- Comments -------- */}
          <div className="comments-list">
            {comments.map((c) => (
              <div key={c._id} className="comment-thread">
                <div className="comment-body">
                  <div className="comment-meta">
                    <span className="c-user">{c.user?.name}</span>
                  </div>

                  <p className="c-text">{c.text}</p>

                  <div className="c-actions">
                    <button onClick={() => handleCommentVote(c._id, "up")}>
                      <Icons.Up />
                    </button>
                    <span>
                      {c.upvotesCount - c.downvotesCount}
                    </span>
                    <button onClick={() => handleCommentVote(c._id, "down")}>
                      <Icons.Down />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-col"></div>
      </div>
    </div>
  );
};

export default PostPage;
