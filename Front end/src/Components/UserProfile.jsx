import React, { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader.jsx";
import ProfileTabs from "./ProfileTabs.jsx";
import RightPanel from "./RightPanel.jsx";
import FeedPost from "./FeedPost.jsx";
import EmptyState from "./EmptyState.jsx";
import "../Styles/UserProfile.css";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function UserProfile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${username}?include=posts,comments,saved,upvoted,downvoted`);
        if (res.data.status === "success") {
          setUser(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [username]);

  const handleAvatarChange = async (file) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await api.patch(`/users/${user.name}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.status === "success") {
        setUser(prevUser => ({
          ...prevUser,           
          photo: res.data.data.photo 
        }));

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.name === user.name) {
          localStorage.setItem("user", JSON.stringify({
            ...storedUser,
            photo: res.data.data.photo
          }));
        }
      }
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      setPreviewUrl(null); // Revert image on failure
      alert("Failed to update profile picture.");
    }
  };

  const getPostsForActiveTab = () => {
    if (!user) return [];
    switch (activeTab) {
      case "Overview":
      case "Posts":
        return user.posts || [];
      case "Saved":
        return user.saved || [];
      case "Upvoted":
        return user.upvoted || [];
      case "Downvoted":
        return user.downvoted || [];
      default:
        return [];
    }
  };

  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "Overview":
      case "Posts":
        return {
          label: "You don't have any posts yet",
          description: "Once you post to a community, it'll show up here.",
          showButton: true
        };
      default:
        return {
          label: `Looks like you haven't ${activeTab.toLowerCase()} anything yet`,
          description: null,
          showButton: false
        };
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  const emptyStateData = getEmptyStateContent();
  const tabs = user?.upvoted ? ["Overview", "Posts", "Saved", "Upvoted", "Downvoted"] : ["Overview", "Posts"];

  // Age calculation (restored logic)
  const createdAt = new Date(user.createdAt);
  const now = new Date();
  let years = now.getFullYear() - createdAt.getFullYear();
  let redditAge = years > 0 ? `${years} y` : `${now.getMonth() - createdAt.getMonth()} m`;
  const POST_IMAGE_URL = "http://localhost:5000/uploads/posts/";
  const userobj = {
    username: user.name,
    photo: user.photo,
    id: user._id,
  }

  const currentAvatarUrl = previewUrl || (user?.photo
    ? `http://localhost:5000/uploads/profiles/${user.photo}`
    : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png");

  return (
    <div className="app-container">
      <main className="app-main">
        <ProfileHeader
          onAvatarChange={handleAvatarChange}
          username={user.name}
          avatarUrl={currentAvatarUrl}
        />

        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <RightPanel username={user.name} karma={(user.postKarma || 0) + (user.commentKarma || 0)} redditAge={redditAge} onAvatarChange={handleAvatarChange} />

        {getPostsForActiveTab().length > 0 ? (
          getPostsForActiveTab().map((post) => (
            <FeedPost
              key={post._id}
              post={{
                ...post,
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
              }}
              onClick={() => navigate(`/post/${post._id}`)}
              currentUser={userobj}
            />
          ))
        ) : (
          <EmptyState
            label={emptyStateData.label}
            description={emptyStateData.description}
            showButton={emptyStateData.showButton}
          />
        )}
      </main>
    </div>
  );
}