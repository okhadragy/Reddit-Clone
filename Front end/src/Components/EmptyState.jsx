import React from 'react';
import { useNavigate } from "react-router-dom";
export default function EmptyState({ 
  label = "You don't have any posts yet", 
  description = "Once you post to a community, it'll show up here. If you'd rather hide your posts, update your settings.", 
  showButton = true 
}) {

  const navigate = useNavigate();
  return (
    <div className="empty-state-container">
      {/* Separator Line */}
      <hr className="empty-state-line" />
      
      <div className="empty-state-content">
        {/* Snoo Image */}
        <div className="empty-snoo-wrapper">
            <img 
              src="https://www.redditstatic.com/shreddit/assets/snoomojis/Snoo_Expression_NoMouth.png" 
              alt="Empty State" 
              className="empty-snoo"
            />
        </div>

        {/* Text Content */}
        <h2 className="empty-title">{label}</h2>
        <p className="empty-desc">{description}</p>

        {showButton && (
          <button onClick={() => navigate('/settings')} className="empty-button">Update Settings</button>
        )}
      </div>
    </div>
  );
}