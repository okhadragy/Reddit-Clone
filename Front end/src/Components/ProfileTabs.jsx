
export default function ProfileTabs({ tabs, activeTab, onTabChange }) {
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