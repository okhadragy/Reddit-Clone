import React, { useState } from "react";
import "../Styles/CommunityNameDesc.css";

export default function CommunityNameDesc({ data, onNext, onBack, onClose }) {
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");

  const handleNext = () => {
    if (onNext) {
      onNext({ name, description });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack({ name, description });
    }
  };

  return (
    <div className="name_desc">
      <div className="left_section">
        <h1>Tell us about your community</h1>
        <h4>
          A name and description help people understand what your community is all about.
        </h4>

        {/* Community Name Input */}
        <div className="input-container">
          <label htmlFor="community-name">Name</label>
          <input
            id="community-name"
            type="text"
            placeholder="Community name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            required
          />
          <span className="char-count">{name.length}/30</span>
        </div>

        {/* Description Input */}
        <div className="textarea-container">
          <label htmlFor="community-description">Description (Optional)</label>
          <textarea
            id="community-description"
            placeholder="Describe your community"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
          />
          <span className="char-count">{description.length}/500</span>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
          <button 
            className="next-btn" 
            onClick={handleNext}
            disabled={!name.trim()}
          >
            Next
          </button>
        </div>
      </div>

      {/* Right preview card */}
      <div className="name_and_description_card_right">
        <h2>r/{name || "communityname"}</h2>
        <p className="sub-info">1 weekly visitor · 1 weekly contributor</p>
        <p className="preview-description">
          {description || "Your community description"}
        </p>
      </div>
    </div>
  );
}
