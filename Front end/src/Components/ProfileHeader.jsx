import React, { useRef } from 'react'; // Added useRef
import { Image as ImageIcon } from 'lucide-react';

export default function ProfileHeader({ username, avatarUrl, onAvatarChange }) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // PASS THE FILE OBJECT DIRECTLY
      onAvatarChange(file); 
    }
  };
  return (
    <div className="profile-header">
      {/* Avatar Section with Relative positioning for the icon */}
      <div className="profile-avatar-wrapper">
        <img 
          src={avatarUrl}
          alt="Profile" 
          className="profile-avatar"
        />
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} 
          accept="image/*"
        />
        <button className="profile-edit-icon" onClick={handleImageClick}>
           <ImageIcon size={16} />
        </button>
      </div>

      {/* Text Info Section */}
      <div className="profile-info">
        <h1 className="profile-username">{username}</h1>
        <p className="profile-handle">u/{username}</p>
      </div>
    </div>
  );
}