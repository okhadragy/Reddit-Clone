import React, { useState } from 'react';
import '../Styles/ExplorePage.css';

// --- DATA (Same as before) ---
const categoriesList = [
  { name: 'All', icon: null }, // removed 'active' property, we handle it with state now
  { name: 'Games', icon: '🎮' },
  { name: 'Sports', icon: '🏀' },
  { name: 'Crypto', icon: '💰' },
  { name: 'Technology', icon: '💻' },
  { name: 'Movies & TV', icon: '🎬' },
];

const recommendedData = [
  { name: 'PUBATTLEGROUNDS', visitors: '127K', desc: 'Dive into the world of PUBG.', color: '#000' },
  { name: 'StarWars', visitors: '1.2M', desc: 'News, theories, and discussions.', color: '#000' },
  { name: 'marvelstudiosxmen', visitors: '541', desc: 'X-Men fans awaiting the MCU.', color: '#d4af37' },
];

const gamingData = [
  { name: 'EldenRing', visitors: '3.4M', desc: 'News, fan art, and discussion.', color: '#c2a05e' },
  { name: 'LeagueOfLegends', visitors: '5.1M', desc: 'League of Legends community.', color: '#0acbe6' },
  { name: 'Minecraft', visitors: '7.2M', desc: 'Keep it respectful and have fun building!', color: '#2e8b57' },
];

const cryptoData = [
  { name: 'Bitcoin', visitors: '4.8M', desc: 'The currency of the Internet.', color: '#f7931a' },
  { name: 'CryptoCurrency', visitors: '6.1M', desc: 'News, discussion, and analysis.', color: '#3c3c3d' },
];

const sportsData = [
  { name: 'nba', visitors: '8.4M', desc: 'All things NBA.', color: '#005eb8' },
  { name: 'soccer', visitors: '5.5M', desc: 'The football subreddit.', color: '#1ec71e' },
];

// --- COMPONENT 1: The Interactive Card ---
const CommunityCard = ({ name, visitors, desc, color }) => {
  // STATE: Tracks if this specific card is joined or not
  const [isJoined, setIsJoined] = useState(false);

  const handleClick = () => {
    setIsJoined(!isJoined); // Toggles between true and false
  };

  return (
    <div className="community-card">
      <div className="card-header">
        <div className="icon-wrapper" style={{ backgroundColor: color || '#ccc' }}>
          <span className="icon-placeholder">{name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="card-header-text">
          <h3 className="community-name">r/{name}</h3>
          <span className="community-visitors">{visitors} weekly visitors</span>
        </div>
        
        {/* LOGIC: Change class and text based on state */}
        <button 
          className={`join-btn ${isJoined ? 'joined' : ''}`} 
          onClick={handleClick}
        >
          {isJoined ? 'Joined' : 'Join'}
        </button>

      </div>
      <p className="community-desc">{desc}</p>
    </div>
  );
};

// --- COMPONENT 2: The Main Page ---
function ExplorePage() {
  // STATE: Tracks which filter is currently active
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="explore-wrapper">
      <h1 className="main-title">Explore Communities</h1>

      {/* Filter Bar */}
      <div className="filter-bar-container">
        <div className="filter-bar">
          {categoriesList.map((cat, index) => (
            <button 
              key={index} 
              // LOGIC: Add 'active' class if this button matches the state
              className={`filter-pill ${activeFilter === cat.name ? 'active' : ''}`}
              // LOGIC: Update state when clicked
              onClick={() => setActiveFilter(cat.name)}
            >
              {cat.icon && <span className="pill-icon">{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* LOGIC: Conditional Rendering
         We check: Is the filter 'All'? OR Is the filter specifically this category? 
      */}

      {/* Recommended always shows on All, or we can hide it. Let's keep it on 'All' only */}
      {activeFilter === 'All' && (
        <section className="explore-section">
          <h2 className="section-title">Recommended for you</h2>
          <div className="cards-grid">
            {recommendedData.map((item, i) => <CommunityCard key={i} {...item} />)}
          </div>
        </section>
      )}

      {(activeFilter === 'All' || activeFilter === 'Games') && (
        <section className="explore-section">
          <h2 className="section-title">Trending in Games</h2>
          <div className="cards-grid">
            {gamingData.map((item, i) => <CommunityCard key={i} {...item} />)}
          </div>
        </section>
      )}

      {(activeFilter === 'All' || activeFilter === 'Crypto') && (
        <section className="explore-section">
          <h2 className="section-title">Crypto & Finance</h2>
          <div className="cards-grid">
            {cryptoData.map((item, i) => <CommunityCard key={i} {...item} />)}
          </div>
        </section>
      )}

      {(activeFilter === 'All' || activeFilter === 'Sports') && (
        <section className="explore-section">
          <h2 className="section-title">Sports League</h2>
          <div className="cards-grid">
            {sportsData.map((item, i) => <CommunityCard key={i} {...item} />)}
          </div>
        </section>
      )}

      {/* Fallback if a user clicks a category with no data (like Movies) */}
      {(activeFilter !== 'All' && activeFilter !== 'Games' && activeFilter !== 'Crypto' && activeFilter !== 'Sports') && (
        <div style={{textAlign: 'center', padding: '50px', color: '#777'}}>
          <h3>No communities found for {activeFilter} yet...</h3>
        </div>
      )}

    </div>
  );
}

export default ExplorePage;