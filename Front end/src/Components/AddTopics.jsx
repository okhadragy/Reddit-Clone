import React, { useState } from "react";

function AddTopics({ data, onNext, onClose,onBack }) {
  const [selectedTopics, setSelectedTopics] = useState(data.topics || []);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) return prev.filter((t) => t !== topic);
      if (prev.length < 3) return [...prev, topic];
      return prev;
    });
  };

  // Helper to render buttons with toggle functionality
  const renderButtons = (topics) =>
    topics.map((topic) => (
      <button
        key={topic}
        className={selectedTopics.includes(topic) ? "selected" : ""}
        type="button"
        onClick={() => toggleTopic(topic)}
      >
        {topic}
      </button>
    ));

  const handleNext = () => {
<<<<<<< Updated upstream
  onNext(selectedTopics); 
};

=======
    if (onNext) {
      // Pass as object to be consistent with other components
      onNext( selectedTopics );
    }
  };
>>>>>>> Stashed changes

  return (
    <div className="AddTopics">
      <h1>Add topics</h1>
      <h3>Add up to 3 topics to help interested redditors find your community.</h3>

      <div className="search-container">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ffffff"
          width="16"
          height="16"
          viewBox="0 0 20 20"
        >
          <path d="M18.736 17.464l-3.483-3.483A7.961 7.961 0 0016.999 9 8 8 0 109 17a7.961 7961 0 004.981-1.746l3.483 3.483a.9.9 0 101.272-1.273zM9 15.2A6.207 6.207 0 012.8 9c0-3.419 2.781-6.2 6.2-6.2s6.2 2.781 6.2 6.2-2.781 6.2-6.2 6.2z" />
        </svg>
        <input className="SearchBar" placeholder="Filter Topics" />
      </div>

      <h4>Topics {selectedTopics.length}/3</h4>

      <div className="Topics">
        <fieldset className="fieldsets">
          <legend>Sports</legend>
          {renderButtons([
            "Football",
            "Basketball",
            "Volleyball",
            "Handball",
            "Hockey",
            "Baseball",
            "Swimming",
            "Boxing",
            "Judo",
          ])}
        </fieldset>

        <fieldset className="fieldsets">
          <legend>Cars</legend>
          {renderButtons([
            "Porsche",
            "Bugatti",
            "BMW",
            "Mercedes",
            "Ferrari",
            "Lamborghini",
            "Pagani",
            "Koenigsegg",
            "Maserati",
            "Lotus",
            "Honda",
            "Nissan",
            "Toyota",
          ])}
        </fieldset>

        <fieldset className="fieldsets">
          <legend>Video Games</legend>
          {renderButtons([
            "Football Games",
            "Shooting Games",
            "Racing Games",
            "Role-Playing Games",
            "Strategy Games",
            "Mobile Games",
          ])}
        </fieldset>

        <fieldset className="fieldsets">
          <legend>Movies</legend>
          {renderButtons([
            "Sci-Fi",
            "Action",
            "Comedy",
            "Adventure",
            "Horror",
            "Animation",
            "Superhero",
          ])}
        </fieldset>

        <fieldset className="fieldsets">
          <legend>Food</legend>
          {renderButtons([
            "Recipes",
            "Fast Food",
            "Baking",
            "Street Food",
            "Snacks",
            "Healthy Food",
          ])}
        </fieldset>

        <fieldset className="fieldsets">
          <legend>Technology</legend>
          {renderButtons([
            "Software",
            "Hardware",
            "Cybersecurity",
            "AI",
            "Robotics",
            "Quantum Computing",
            "Cloud Computing",
          ])}
        </fieldset>

        <fieldset className="fieldsets">
          <legend>Animals</legend>
          {renderButtons(["Cats", "Dogs", "Birds", "Fish", "Reptiles", "Wild Life"])}
        </fieldset>
      </div>

      <div className="buttons">
        <button className="Back" onClick={onClose}>
          Cancel
        </button>
        <button className="Next" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default AddTopics;