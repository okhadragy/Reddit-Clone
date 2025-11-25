import React, { useState } from "react";
import "../Styles/PostPage.css";

// --- ICONS ---
const Icons = {
  // Uses stroke (Outline style)
  Back: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  // Uses fill (Solid style)
  Up: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
       <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
    </svg>
  ),
  // Uses fill (Solid style)
  Down: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
       <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399 6.081 12H10V4h4v8h3.919L12 19.399z" />
    </svg>
  ),
  // Uses fill
  Comment: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
       <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  ),
  // ... rest of your icons (Save, Share, etc.)
  Save: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>,
  Share: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>,
  Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  Gif: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h3m-3 0v4m0-4V8m16 4h-3m3 0v4m0-4V8m-7 4v4m0-4V8m-3 4h3"></path></svg>,
};

const DEFAULT_COMMENTS = [
  { id: 1, user: "legallytrash666", time: "21h ago", score: 13, text: "Full honesty: works very well.", avatarColor: "#54b258" },
  { id: 2, user: "FlyingLawnmowerMan", time: "18h ago", score: 5, text: "I've used it a couple years now myself. Works great!", avatarColor: "#d45858" },
  { id: 3, user: "RandoDando10", time: "17h ago", score: 2, text: "Wired version here too, 3 years and still going strong.", avatarColor: "#ea6e78" },
];

const PostPage = ({ post, onBack }) => {
  

  const [votes, setVotes] = useState(post.votes || 0);
  const [voteStatus, setVoteStatus] = useState('none'); // 'up', 'down', 'none'
  const [comments, setComments] = useState(post.commentList || DEFAULT_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [shareText, setShareText] = useState("Share");
if (!post) return null;
  const handleVote = (type) => {
    if (voteStatus === type) {
      setVotes(type === 'up' ? votes - 1 : votes + 1);
      setVoteStatus('none');
    } else if (type === 'up') {
      setVotes(voteStatus === 'down' ? votes + 2 : votes + 1);
      setVoteStatus('up');
    } else {
      setVotes(voteStatus === 'up' ? votes - 2 : votes - 1);
      setVoteStatus('down');
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    const newObj = {
      id: Date.now(),
      user: "Current_User",
      time: "Just now",
      score: 1,
      text: newComment,
      avatarColor: "#0079d3",
      voteStatus: null
    };
    setComments([newObj, ...comments]);
    setNewComment("");
  };

  const handleCommentVote = (id, type) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        let newScore = c.score || 0;
        if (c.voteStatus === type) {
          newScore += type === 'up' ? -1 : 1;
          return { ...c, score: newScore, voteStatus: null };
        } else if (type === 'up') {
          newScore += c.voteStatus === 'down' ? 2 : 1;
          return { ...c, score: newScore, voteStatus: 'up' };
        } else {
          newScore -= c.voteStatus === 'up' ? 2 : 1;
          return { ...c, score: newScore, voteStatus: 'down' };
        }
      })
    );
  };

  const handleShare = () => {
    setShareText("Copied!");
    setTimeout(() => setShareText("Share"), 2000);
  };

  return (
    <div className="post-page-container">
      {/* Navbar */}
      <div className="post-nav-bar">
        <button className="back-btn-nav" onClick={onBack}>
          <Icons.Back /> Back to Feed
        </button>
      </div>

      <div className="layout-grid">
        {/* Main Column */}
        <div className="main-col">
          {/* Post Card */}
          <div className="post-card">
            <div className="post-header-bar">
              <span className="sub-name">{post.subreddit || "r/LogitechG"}</span>
              <span className="meta-dot">•</span>
              <span className="user-meta">Posted by u/{post.author || "Formal_Fig1078"} {post.time || "1d ago"}</span>
            </div>

            <div className="post-title-block">
              <h1 className="post-title">{post.title}</h1>
              <span className="flair-tag">{post.flair || "Discussion"}</span>
            </div>

            {post.image && (
              <div className="post-media-container">
                <img src={post.image} alt="Post" className="post-image-content" />
              </div>
            )}

            <div className="post-body-text">{post.body || ""}</div>

            {/* Footer Actions */}
            <div className="post-footer-actions">
              <div className={`vote-pill`}>
                <button className={`icon-btn up ${voteStatus==='up' ? 'active' : ''}`} onClick={()=>handleVote('up')}>
                  <Icons.Up />
                </button>
                <span className={`vote-score ${voteStatus}`}>{votes}</span>
                <button className={`icon-btn down ${voteStatus==='down' ? 'active' : ''}`} onClick={()=>handleVote('down')}>
                  <Icons.Down />
                </button>
              </div>

              <button className="action-pill"><Icons.Comment /> {comments.length}</button>
              <button className={`action-pill ${isSaved ? 'active-save' : ''}`} onClick={()=>setIsSaved(!isSaved)}><Icons.Save /> {isSaved ? 'Saved' : 'Save'}</button>
              <button className="action-pill" onClick={handleShare}><Icons.Share /> {shareText}</button>
            </div>
          </div>

          {/* Comment Input */}
          <div className="comment-input-area">
            <span className="user-label">Comment as <span className="blue-text">Current_User</span></span>
            <div className="input-box-wrapper">
              <textarea className="comment-textarea" value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="What are your thoughts?"/>
              <div className="input-actions">
                <div className="text-tools">
                  <button className="tool-btn"><Icons.Image /></button>
                  <button className="tool-btn"><Icons.Gif /></button>
                </div>
                <button className={`comment-btn-submit ${newComment.trim() ? 'active' : ''}`} onClick={handleCommentSubmit}>Comment</button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {comments.map(c => (
              <div key={c.id} className="comment-thread">
                <div className="comment-avatar" style={{backgroundColor: c.avatarColor}}></div>
                <div className="comment-body">
                  <div className="comment-meta">
                    <span className="c-user">{c.user}</span>
                    <span className="c-dot">•</span>
                    <span className="c-time">{c.time}</span>
                  </div>
                  <p className="c-text">{c.text}</p>
                  <div className="c-actions">
                    <button className={`c-btn up ${c.voteStatus==='up' ? 'active' : ''}`} onClick={()=>handleCommentVote(c.id,'up')}><Icons.Up /></button>
                    <span className={`c-score ${c.voteStatus || ''}`}>{c.score}</span>
                    <button className={`c-btn down ${c.voteStatus==='down' ? 'active' : ''}`} onClick={()=>handleCommentVote(c.id,'down')}><Icons.Down /></button>
                    <button className="c-btn-text"><Icons.Comment /> Reply</button>
                    <button className="c-btn-text">Share</button>
                    <button className="c-dots">•••</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column (placeholder) */}
        <div className="sidebar-col"></div>
      </div>
    </div>
  );
};

export default PostPage;
