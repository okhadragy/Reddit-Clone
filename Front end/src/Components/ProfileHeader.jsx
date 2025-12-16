import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
export default function ProfileHeader() {
  return (
    <div className="profile-header">
      {/* Avatar Section with Relative positioning for the icon */}
      <div className="profile-avatar-wrapper">
        <img 
          src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png" 
          alt="Profile" 
          className="profile-avatar"
        />
        <button className="profile-edit-icon">
           <ImageIcon size={16} />
        </button>
      </div>

      {/* Text Info Section */}
      <div className="profile-info">
        <h1 className="profile-username">Working_Scheme_650</h1>
        <p className="profile-handle">u/Working_Scheme_650</p>
      </div>
    </div>
  );
}