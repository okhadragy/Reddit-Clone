import React from 'react';
import { useNavigate } from "react-router-dom";

export default function ProfileTabs({ activeTab, onTabChange }) {
    const navigate = useNavigate();
  const tabs = [
    "Overview", 
    "Posts", 
    "Comments", 
    "Saved", 
    "History", 
    "Hidden", 
    "Upvoted", 
    "Downvoted"
  ];

  return (
    <div className="profile-tabs-container">
      {tabs.map((tab) => (
        <button 
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`tab-item ${activeTab === tab ? 'active' : ''}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}