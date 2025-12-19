import React, { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader.jsx";
import ProfileTabs from "./ProfileTabs.jsx";
import RightPanel from "./RightPanel.jsx";
import ContentFilterBar from "./ContentFilterBar.jsx";
import CreatePostButton from "./CreatePostButton.jsx";
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

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;


  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "Overview":
      case "Posts":
        return {
          label: "You don't have any posts yet",
          description: "Once you post to a community, it'll show up here. If you'd rather hide your posts, update your settings.",
          showButton: true
        };
      case "Saved":
      case "Upvoted":
      case "Downvoted":
        return {
          label: `Looks like you haven't ${activeTab.toLowerCase()} anything yet`,
          description: null,
          showButton: false
        };
      default:
        return {
          label: `Looks like you haven't visited any posts yet`,
          description: null,
          showButton: false
        };
    }
  };

  const getPostsForActiveTab = () => {
    switch (activeTab) {
      case "Overview":
      case "Posts":
        return user.posts;
      case "Saved":
        return user.saved;
      case "Upvoted":
        return user.upvoted;
      case "Downvoted":
        return user.downvoted;
      default:
        return [];
    }
  };
  const emptyStateData = getEmptyStateContent();

  const tabs = user?.upvoted ? [
    "Overview",
    "Posts",
    "Saved",
    "Upvoted",
    "Downvoted"
  ] : [
    "Overview",
    "Posts",
  ];

  // Inside your component
  const now = new Date();
  const createdAt = new Date(user.createdAt);

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
  let redditAge;
  if (years > 0) {
    redditAge = `${years} y`;
  } else if (months > 0) {
    redditAge = `${months} m`;
  } else if (days > 0) {
    redditAge = `${days} d`;
  } else if (hours > 0) {
    redditAge = `${hours} h`;
  } else if (minutes > 0) {
    redditAge = `${minutes} m`;
  } else {
    redditAge = `${seconds} s`;
  }



  return (
    <div className="app-container">
      <main className="app-main">
        <ProfileHeader
          profile_img={`http://localhost:5000/uploads/profiles/${user.photo}` || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png"}
          username={user.name}
        />

        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <RightPanel username={user.name} karma={user.postKarma + user.commentKarma} redditAge={redditAge} />

        {getPostsForActiveTab().length > 0 ? (
          getPostsForActiveTab().map((post) => (
            <FeedPost key={post.id} post={post} onClick={() => navigate(`/post/${post._id}`)} currentUser={user} />
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
