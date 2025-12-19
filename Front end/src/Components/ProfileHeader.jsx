import { Image as ImageIcon } from 'lucide-react';

export default function ProfileHeader({ profile_img, username }) {
  return (
    <div className="profile-header">
      {/* Avatar Section with Relative positioning for the icon */}
      <div className="profile-avatar-wrapper">
        <img 
          src={profile_img}
          alt="Profile" 
          className="profile-avatar"
        />
        <button className="profile-edit-icon">
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