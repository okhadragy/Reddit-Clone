import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader.jsx";
import ProfileTabs from "./ProfileTabs.jsx";
import RightPanel from "./RightPanel.jsx"; 
import ContentFilterBar from "./ContentFilterBar.jsx";
import CreatePostButton from "./CreatePostButton.jsx";
import EmptyState from "./EmptyState.jsx";
import "../Styles/UserProfile.css";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  // 1. Initialize State for the active tab
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();
  // 2. Helper logic to change text based on state
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "Overview":
      case "Posts":
        return {
          label: "You don't have any posts yet",
          description: "Once you post to a community, it'll show up here. If you'd rather hide your posts, update your settings.",
          showButton: true
        };
      case "Comments":
        return {
          label: "You don't have any comments yet",
          description: "Once you comment in a community, it'll show up here. If you'd rather hide your comments, update your settings.",
          showButton: true
        };
      case "Saved":
        return {
          label: "Looks like you haven't saved anything yet",
          description: null, 
          showButton: false 
        };
      case "History": 
        return {
          label: "Looks like you haven't saved anything yet",
          description: null, 
          showButton: false 
        };
      case "Hidden": 
        return {
          label: "Looks like you haven't hidden anything yet",
          description: null, 
          showButton: false 
        };
      case "Upvoted": 
        return {
          label: "Looks like you haven't upvoted anything yet",
          description: null, 
          showButton: false 
        };
      case "Downvoted": 
        return {
          label: "Looks like you haven't downvoted anything yet",
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

  const emptyStateData = getEmptyStateContent();

 return (
  <div className="app-container">
    <main className="app-main">
      <ProfileHeader />

      <ProfileTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ContentFilterBar />
      <CreatePostButton />
  <RightPanel />
      <EmptyState
        label={emptyStateData.label}
        description={emptyStateData.description}
        showButton={emptyStateData.showButton}
      />
    </main>

  
  </div>
);


}