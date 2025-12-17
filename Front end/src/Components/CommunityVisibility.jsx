import React, { useState, useEffect } from "react";

function CommunityVisibility({ data, onNext, onBack, onClose }) {
  const [selected, setSelected] = useState(data.visibility || "public");

  const options = [
    {
      id: "public",
      title: "Public",
      description: "Anyone can view, post, and comment to this community."
    },
    {
      id: "private",
      title: "Private",
      description: "Only approved members can view and post to this community."
    },
    {
      id: "restricted",
      title: "Restricted",
      description: "Anyone can view this community, but only approved members can post."
    }
  ];

  const handleNext = () => {
    if (onNext) {
      onNext({ visibility: selected }); // Pass as object
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack({ visibility: selected }); // Pass as object
    }
  };

  return (
    <div className="radio-group">
      <h1>What kind of community is this?</h1>
      <h4>
        Decide who can view and contribute in your community. Only public communities show up in search. 
        Important: Once set, you will need to submit a request to change your community type.
      </h4>

      {options.map((option) => (
        <label
          key={option.id}
          className={`radio-option ${selected === option.id ? "selected" : ""}`}
        >
          <div className="radio-content">
            <span className="radio-title">{option.title}</span>
            <span className="radio-description">{option.description}</span>
          </div>
          <input
            type="radio"
            name="community-type"
            value={option.id}
            checked={selected === option.id}
            onChange={() => setSelected(option.id)}
          />
        </label>
      ))}

      <div className="buttons">
        <button className="Back" onClick={handleBack}>
          Back
        </button>
        <button className="Next" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default CommunityVisibility;