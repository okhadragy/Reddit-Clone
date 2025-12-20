import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CreatePostButton from "./CreatePostButton";
import FeedPost from './FeedPost.jsx';
import "../Styles/CreateCommunity.css";
import api from "../api/api";
import {
  Shield,
  Lock,
  MessageCircle,
  Users,
  Plus,
  Settings,
  Bell,
  MoreHorizontal,
  Trash2 // Imported Trash icon
} from "lucide-react";

export default function CreateCommunity() {

  const [isJoined, setIsJoined] = useState(false);
  const navigate = useNavigate();

  const { communityName } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModerator, setIsModerator] = useState(false);

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For 3 dots button menu
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // NEW: For Mod Tools menu
  const [showModMenu, setShowModMenu] = useState(false);
  const modMenuRef = useRef(null);

  // Use state for banner and icon URLs
  const [previewIcon, setPreviewIcon] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);


  const bannerInputRef = useRef(null);
  const iconInputRef = useRef(null);

  // UPDATED: Handle click outside for BOTH menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (modMenuRef.current && !modMenuRef.current.contains(event.target)) {
        setShowModMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, modMenuRef]);

  // Get community details
  useEffect(() => {
    let userObj = null;
    const storedUserString = localStorage.getItem("user");
    const POST_IMAGE_URL = "http://localhost:5000/uploads/posts/";
    if (storedUserString) {
      userObj = JSON.parse(storedUserString);
      setCurrentUser(userObj);
    }
    const fetchCommunity = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/community/${communityName}`);
        setCommunity(response.data.data.community);

        if (userObj) {
          const memberRes = await api.get(
            `/community/${communityName}/checkMember/${userObj.id}`
          );

          setIsJoined(memberRes.data.isMember);
          if (memberRes.data.role == "moderator") {
            setIsModerator(true);
          }
          else { setIsModerator(false); }
        }
        else { console.log("No user logged in"); }

        const postsRes = await api.get(`/posts?community=${communityName}`);
        const mappedPosts = postsRes.data.data.posts.map(post => ({
          id: post._id,
          subreddit: post.community ? `r/${post.community.name}` : 'r/Unknown',
          communityName: post.community ? post.community.name : null,
          time: new Date(post.createdAt).toLocaleDateString(),
          title: post.title,
          content: post.content,
          image: (post.media && post.media.length > 0)
            ? `${POST_IMAGE_URL}${post.media[0]}`
            : null,
          votesCount: post.upvotesCount - post.downvotesCount,
          commentsCount: post.commentsCount,
          voteStatus: post.userVote,
          isJoined: post.isJoined || false,
        }));

        setPosts(mappedPosts);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("This community does not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [communityName]);


  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setPreviewBanner(URL.createObjectURL(file));
    }
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setPreviewIcon(URL.createObjectURL(file));
    }
  };

  // NEW: Handle Delete Community
  const handleDeleteCommunity = async () => {
    if (window.confirm(`Are you sure you want to delete r/${communityName}? This action cannot be undone.`)) {
      try {
        await api.delete(`/community/${communityName}`);
        // Optional: Add success toast/alert
        window.location.href = "/";
      } catch (err) {
        console.error("Error deleting community:", err);
        alert("Failed to delete community. You may not have permission.");
      }
    }
  };

  if (loading) return <div>Loading r/{communityName}...</div>;
  if (error) return <div>{error}</div>;

  const getVisibilityIcon = () => {
    switch (community.visibility) {
      case "private": return <Lock size={16} />;
      case "public": return <Shield size={16} />;
      case "restricted": return <Users size={16} />;
      default: return <Shield size={16} />;
    }
  };

  const getVisibilityText = () => {
    switch (community.visibility) {
      case "private": return "Private";
      case "public": return "Public";
      case "restricted": return "Restricted";
      default: return community.visibility;
    }
  };

  const handleCreatePost = () => {
    navigate(`/r/${communityName}/create-post`);
  };

  const saveChanges = async () => {
    const formData = new FormData();
    if (bannerFile) formData.append("coverImage", bannerFile);
    if (iconFile) formData.append("icon", iconFile);

    try {
      await api.patch(`/community/${communityName}`, formData);
      setBannerFile(null);
      setIconFile(null);
    } catch (err) {
      setError("This community does not exist.")
    }
  };

  function getDefaultImage(imageName) {
    return `http://localhost:5000/uploads/communities/${imageName}`
  }

  async function toggleJoin() {
    if (!currentUser) {
      alert("You must be logged in to join.");
      return;
    }
    if (isJoined) {
      api.post(`/community/${communityName}/leave/${currentUser.id}`)
        .then(() => { setIsJoined(false); })
        .catch((err) => { console.error("Error leaving community:", err); });
    }
    else {
      api.post(`/community/${communityName}/join/${currentUser.id}`)
        .then(() => { setIsJoined(true); })
        .catch((err) => { console.error("Error joining community:", err); });
    }
  }

  return (
    <div className="community-page">

      <div className="community-banner">
        <img
          src={previewBanner || getDefaultImage(community.coverImage)}
          alt="banner"
          className="banner-img"
          onError={(e) => e.target.style.display = 'none'}
        />

        <button
          className="btn-change-banner"
          onClick={() => bannerInputRef.current.click()}
        >
          <svg rpl="" fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.016 3.8c.583 0 1.132.227 1.545.64.413.413.64.961.64 1.545a2.17 2.17 0 01-.64 1.545l-8.67 8.67-3.079-.01-.01-3.079 8.669-8.671c.413-.413.962-.64 1.545-.64zm0-1.8a3.97 3.97 0 00-2.817 1.167l-8.948 8.947a.858.858 0 00-.251.609l.014 4.408a.858.858 0 00.855.855L7.277 18h.003c.227 0 .446-.09.606-.251l8.947-8.947A3.985 3.985 0 0014.016 2z"></path>
          </svg>
        </button>
        <input
          type="file"
          ref={bannerInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleBannerUpload}
        />
      </div>

      {/* ---------- COMMUNITY HEADER ---------- */}
      <div className="community-header">
        <div className="community-icon-wrapper">
          <img
            src={previewIcon || getDefaultImage(community.icon)}
            alt="icon"
            className="community-icon"
          />

          <button
            className="btn-change-icon"
            onClick={() => iconInputRef.current.click()}
          >
            <svg rpl="" fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.016 3.8c.583 0 1.132.227 1.545.64.413.413.64.961.64 1.545a2.17 2.17 0 01-.64 1.545l-8.67 8.67-3.079-.01-.01-3.079 8.669-8.671c.413-.413.962-.64 1.545-.64zm0-1.8a3.97 3.97 0 00-2.817 1.167l-8.948 8.947a.858.858 0 00-.251.609l.014 4.408a.858.858 0 00.855.855L7.277 18h.003c.227 0 .446-.09.606-.251l8.947-8.947A3.985 3.985 0 0014.016 2z"></path>
            </svg>
          </button>
          <input
            type="file"
            ref={iconInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleIconUpload}
          />
        </div>

        <div className="community-header-content">
          <div className="community-title-left">
            <h1 className="community-title">{community.name}</h1>
            <span className="community-description">r/{community.name}</span>
          </div>

          <div className="community-actions">
            <button className="btn-create-post-outline" onClick={handleCreatePost}>
              <Plus size={20} /> Create Post
            </button>

            <button className="btn-icon-round" title="Notifications">
              <Bell size={20} />
            </button>

            {/* MOD TOOLS DROPDOWN */}
            {isModerator ? (
              <div className="menu-container" ref={modMenuRef}>
                <button 
                  className="btn-mod-tools" 
                  onClick={() => setShowModMenu(!showModMenu)}
                  style={{display: 'flex', alignItems: 'center', gap: '5px'}}
                >
                  <Shield size={16} /> Mod Tools
                </button>

                {showModMenu && (
                  <div className="dropdown-menu">
                     <button
                      className="dropdown-item danger"
                      onClick={handleDeleteCommunity}
                      style={{display: 'flex', alignItems: 'center', gap: '8px'}}
                    >
                      <Trash2 size={16} /> Delete Community
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={isJoined ? "btn-joined" : "btn-join-blue"}
                onClick={toggleJoin}
              >
                {isJoined ? "Joined" : "Join"}
              </button>
            )}

            {/* 3 DOTS MENU */}
            <div className="menu-container" ref={menuRef}>
              <button
                className="btn-icon-round"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal size={20} />
              </button>

              {showMenu && (
                <div className="dropdown-menu">
                  {isModerator && (
                    <button
                      className="dropdown-item danger"
                      onClick={() => {
                        toggleJoin();
                        setShowMenu(false);
                      }}
                    >
                      Leave Community
                    </button>
                  )}
                  <button
                    className="dropdown-item"
                    onClick={() => setShowMenu(false)}
                  >
                    Mute r/{community.name}
                  </button>
                </div>
              )}
            </div>

            {(bannerFile || iconFile) && (
              <button onClick={saveChanges} className="btn-save">
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="community-content">
        {/* LEFT SIDE - FEED */}
        <div className="community-feed">
          {posts.length > 0 ? (
            <div className="posts-container">
              {posts.map((post) => (
                <FeedPost key={post.id} post={post} currentUser={currentUser} />
              ))}
            </div>
          ) : (
            <div className="empty-feed">
              <h2>This community doesn't have any posts yet</h2>
              <p>Make one and get this feed started.</p>
              <button onClick={handleCreatePost} className="btn-create-post-blue">
                Create Post
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="right-sidebar">
          {/* ... Sidebar content remains exactly the same ... */}
          <div className="sidebar-card">
            <h2 className="sidebar-title">r/{community.name}</h2>
            <p className="sidebar-description">{community.description}</p>

            {community.topics && community.topics.length > 0 && (
              <div className="topics-section">
                <h4>Topics</h4>
                <div className="topics-list">
                  {community.topics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="topic-tag">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="sidebar-row">
              {getVisibilityIcon()}
              <span className="private-text">{getVisibilityText()}</span>
            </div>

            <div className="sidebar-row">
              <Shield size={16} />
              <span>
                Created{" "}
                {new Date(community.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {isModerator && (
              <>
                <button className="btn-add-guide">
                  <Plus size={16} /> Add a community guide
                </button>

                <div className="sidebar-insights">
                  <div>
                    <h3>{community.membersCount || 1}</h3>
                    <p>Members</p>
                  </div>
                  <div>
                    <h3>0</h3>
                    <p>Online</p>
                  </div>
                </div>
              </>
            )}

            <div className="sidebar-divider"></div>

            {community.userFlairs && community.userFlairs.length > 0 && (
              <div className="flair-widget">
                <h3 className="sidebar-subtitle">USER FLAIRS</h3>
                <div className="flair-list">
                  {community.userFlairs.map((flair, index) => (
                    <span
                      key={index}
                      className="flair-tag"
                      style={{
                        backgroundColor: flair.backgroundColor || '#eee',
                        color: flair.textColor || 'black'
                      }}
                    >
                      {flair.text}
                    </span>
                  ))}
                </div>
                <div className="sidebar-divider"></div>
              </div>
            )}

            <h3 className="sidebar-subtitle">MODERATORS</h3>

            <button className="btn-message-mods">
              <MessageCircle size={16} /> Message Mods
            </button>

            {isModerator && (
              <button className="btn-add-guide">
                <Plus size={16} /> Invite Mod
              </button>
            )}

            <div className="moderator-item">
              <div className="mod-icon">G</div>
              <span>u/{community.createdBy?.name || "Unknown"}</span>
            </div>

            <button className="btn-view-mods">View all moderators</button>
          </div>

          {isModerator && (
            <div className="settings-card">
              <h3 className="settings-title">COMMUNITY SETTINGS</h3>
              <div className="settings-item">
                <span className="settings-item-label">Community Appearance</span>
                <Settings size={16} className="settings-item-value" />
              </div>
              <div className="settings-item">
                <span className="settings-item-label">Edit Widgets</span>
                <Settings size={16} className="settings-item-value" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}