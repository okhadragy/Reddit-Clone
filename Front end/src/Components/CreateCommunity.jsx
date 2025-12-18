import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreatePostButton from "./CreatePostButton";
import "../Styles/CreateCommunity.css";
import {
  Shield,
  Lock,
  MessageCircle,
  Users,
  Plus,
  Settings,
} from "lucide-react";

export default function CreateCommunity() {
  const { state } = useLocation();

  // Destructure ALL properties with defaults
  const {
    name = "communityname",
    description = "No description",
    visibility = "private",
    bannerFile = null,
    iconFile = null,
    topics = [],
  } = state || {};

  // Use state for banner and icon URLs
  const [bannerUrl, setBannerUrl] = useState(null);
  const [iconUrl, setIconUrl] = useState(null);
  const [localBannerFile, setLocalBannerFile] = useState(bannerFile);
  const [localIconFile, setLocalIconFile] = useState(iconFile);
const createPostRef = useRef(null);

  const bannerInputRef = useRef(null);
  const iconInputRef = useRef(null);

  // Create URLs from files when component mounts or files change
  useEffect(() => {
    if (localBannerFile) {
      const url = URL.createObjectURL(localBannerFile);
      setBannerUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBannerUrl(null);
    }
  }, [localBannerFile]);

  useEffect(() => {
    if (localIconFile) {
      const url = URL.createObjectURL(localIconFile);
      setIconUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setIconUrl(null);
    }
  }, [localIconFile]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (bannerUrl) URL.revokeObjectURL(bannerUrl);
      if (iconUrl) URL.revokeObjectURL(iconUrl);
    };
  }, []);

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous URL
    if (bannerUrl) {
      URL.revokeObjectURL(bannerUrl);
    }

    setLocalBannerFile(file);
  };

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous URL
    if (iconUrl) {
      URL.revokeObjectURL(iconUrl);
    }

    setLocalIconFile(file);
  };

  // Get visibility icon based on visibility type
  const getVisibilityIcon = () => {
    switch (visibility) {
      case "private":
        return <Lock size={16} />;
      case "public":
        return <Shield size={16} />;
      case "restricted":
        return <Users size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  // Get visibility text
  const getVisibilityText = () => {
    switch (visibility) {
      case "private":
        return "Private";
      case "public":
        return "Public";
      case "restricted":
        return "Restricted";
      default:
        return visibility;
    }
  };

  return (
    <div className="community-page">
      {/* ---------- BANNER ---------- */}
      <div className="community-banner">
        {bannerUrl ? (
          <img src={bannerUrl} alt="banner" className="banner-img" />
        ) : (
          <div className="banner-placeholder"></div>
        )}

        <button
          className="btn-change-banner"
          onClick={() => bannerInputRef.current.click()}
        >
          <svg
            rpl=""
            fill="currentColor"
            height="16"
            icon-name="edit"
            viewBox="0 0 20 20"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            {" "}
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
          {iconUrl ? (
            <img src={iconUrl} alt="icon" className="community-icon" />
          ) : (
            <div className="community-icon-placeholder">r/</div>
          )}

          <button
            className="btn-change-icon"
            onClick={() => iconInputRef.current.click()}
          >
           <svg
            rpl=""
            fill="currentColor"
            height="16"
            icon-name="edit"
            viewBox="0 0 20 20"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            {" "}
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

        <div className="community-title-box">
          <h1 className="community-title">r/{name}</h1>
          <span className="community-description">{description}</span>
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="community-content">
        {/* LEFT SIDE - FEED */}
        <div className="community-feed">
          {/* CREATE POST SECTION */}
          <div className="create-post-section">
            <CreatePostButton ref={createPostRef} />

          </div>

          {/* EMPTY FEED */}
          <div className="empty-feed">
            <h2>This community doesn't have any posts yet</h2>
            <p>Make one and get this feed started.</p>
            <button
              className="btn-create-post-blue"
              onClick={() => createPostRef.current?.openCreatePost()}
            >
  Create Post
</button>

          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="right-sidebar">
          {/* COMMUNITY INFO CARD */}
          <div className="sidebar-card">
            <h2 className="sidebar-title">r/{name}</h2>
            <p className="sidebar-description">{description}</p>

            {/* Display topics if available */}
            {topics && topics.length > 0 && (
              <div className="topics-section">
                <h4>Topics</h4>
                <div className="topics-list">
                  {topics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="topic-tag">
                      {topic}
                    </span>
                  ))}
                  {topics.length > 3 && (
                    <span className="topic-tag">+{topics.length - 3}</span>
                  )}
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
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <button className="btn-add-guide">
              <Plus size={16} /> Add a community guide
            </button>

            {/* INSIGHTS */}
            <div className="sidebar-insights">
              <div>
                <h3>0</h3>
                <p>Visitors</p>
              </div>
              <div>
                <h3>0</h3>
                <p>Contributions</p>
              </div>
            </div>

            <div className="sidebar-divider"></div>

            {/* MODERATORS */}
            <h3 className="sidebar-subtitle">MODERATORS</h3>

            <button className="btn-message-mods">
              <MessageCircle size={16} /> Message Mods
            </button>

            <button className="btn-add-guide">
              <Plus size={16} /> Invite Mod
            </button>

            <div className="moderator-item">
              <div className="mod-icon">G</div>
              <span>u/Greedy-Advance-2017</span>
            </div>

            <button className="btn-view-mods">View all moderators</button>
          </div>

          {/* SETTINGS CARD */}
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
        </div>
      </div>
    </div>
  );
}