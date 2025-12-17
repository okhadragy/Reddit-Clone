export default function SettingsNav({ activeTab, setActiveTab }) {
  const tabs = [
    "Account",
    "Profile",
    "Privacy",
    "Preferences",
    "Notifications",
    "Email",
  ];

  return (
    <div className="settings-nav">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`nav-item ${activeTab === tab ? "active" : ""}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
