import React from 'react';
import { useNavigate } from "react-router-dom";
import { Share2, Image as ImageIcon, ShieldCheck, User, Eye, Shirt, Shield, Plus, Award } from 'lucide-react';

// --- Sub-Components ---

const UserInfoCard = ({ username, karma, redditAge }) => (
  <div className="right-panel-card">
    {/* Blue Gradient Background */}
    <div className="user-card-gradient"></div>
    
    <div className="user-card-content">
        <button className="user-card-camera-btn">
            <ImageIcon size={16} />
        </button>

      <h2 className="user-card-name">{username}</h2>
      
      <div style={{ marginBottom: '16px' }}>
        <button  >
            <Share2 size={16} />
            Share
        </button>
       
    
      </div>

      <div className="user-stats-grid">
        <div>
           <div className="stat-value">{karma}</div>
           <div className="stat-label">Karma</div>
        </div>
        <div>
           <div className="stat-value">0</div>
           <div className="stat-label">Contributions</div>
        </div>
        <div>
           <div className="stat-value">{redditAge}</div>
           <div className="stat-label">Reddit Age</div>
        </div>
        <div>
           <div className="stat-value">0</div>
           <div className="stat-label">Active in &gt;</div>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
             <div className="stat-value">0</div>
             <div className="stat-label">Gold earned</div>
        </div>
      </div>
    </div>
  </div>
);

const AchievementsCard = () => (
    
    <div className="right-panel-card" style={{ padding: '12px' }}>
        <h3 className="card-header">ACHIEVEMENTS</h3>
        
        <div className="achievements-row">
             <div className="achievement-icon-stack">
                 <div className="achievement-icon">
                    <span style={{ fontSize: '18px' }}>🍰</span>
                 </div>
                 <div className="achievement-icon overlap">
                    <ShieldCheck size={16} className="text-green-500" color="#46D160"/>
                 </div>
             </div>
             <span className="achievement-text">Joined Reddit, Secured Account</span>
        </div>
        
        <div className="card-footer">
            <span className="footer-text">2 unlocked</span>
            <button className="small-action-btn">View All</button>
        </div>
    </div>
);

const SettingsItem = ({ icon, title, desc }) => (
    // Added style={{ width: '100%' }} to ensure it stretches full width
    <div className="settings-item" style={{ width: '100%' }}> 
        <div className="settings-left">
            <div className="settings-icon">{icon}</div>
            <div className="settings-text-col">
                <span className="settings-title">{title}</span>
                <span className="settings-desc">{desc}</span>
            </div>
        </div>
        {/* The button is now a direct child of the flex container */}
        <button className="small-action-btn">Update</button>
    </div>
);  

const SettingsCard = () => {
    const navigate = useNavigate();  

    return (
        <div className="right-panel-card" style={{ padding: '12px' }}>
            <h3 className="card-header">SETTINGS</h3>

            {/* Profile */}
            <div 
                className="settings-item clickable" 
                onClick={() => navigate('/settings')}
            >
                <SettingsItem 
                    icon={<User size={20}/>} 
                    title="Profile" 
                    desc="Customize your profile" 
                />
            </div>

            {/* Curate */}
            <div 
                className="settings-item clickable" 
                onClick={() => navigate('/settings')}
            >
                <SettingsItem 
                    icon={<Eye size={20}/>} 
                    title="Curate your profile" 
                    desc="Manage what people see" 
                />
            </div>

            {/* Avatar */}
            <div 
                className="settings-item clickable" 
                onClick={() => navigate('/')} //              waiting for avatar page
            >
                <SettingsItem 
                    icon={<Shirt size={20}/>} 
                    title="Avatar" 
                    desc="Style your avatar" 
                />
            </div>

            {/* Mod Tools */}
            <div 
                className="settings-item clickable" 
                onClick={() => navigate('https://www.reddit.com/user/Working_Scheme_650/about/edit/moderation/')}
            >
                <SettingsItem 
                    icon={<Shield size={20}/>} 
                    title="Mod Tools" 
                    desc="Moderate your profile" 
                />
            </div>
        </div>
    );
};


const SocialLinksCard = () => {
    const navigate = useNavigate();
    return (

    <div className="right-panel-card" style={{ padding: '12px' }}>
        <h3 className="card-header">SOCIAL LINKS</h3>
        <button onClick={() => navigate('/settings')} className="social-add-btn">
            <Plus size={16} />
            Add Social Link
        </button>
    </div>
    );
};

const TrophyCaseCard = () => (
    <div className="right-panel-card" style={{ padding: '12px' }}>
        <h3 className="card-header">TROPHY CASE</h3>
        <div className="trophy-row">
            <div className="trophy-icon-box">
                <Award size={24} />
            </div>
            <span className="settings-title">One-Year Club</span>
        </div>
    </div>
);

const Footer = () => (
    <div className="right-panel-footer">
        <div className="footer-links">
             {/* Replaced <a> with <button> to fix ESLint warnings */}
             <button className="footer-link" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}>Content Policy</button>
             <button className="footer-link" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}>Privacy Policy</button>
             <button className="footer-link" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}>User Agreement</button>
        </div>
        <div>© 2025 reddit inc. All rights reserved.</div>
    </div>
)

// --- Main Export ---
export default function RightPanel({ username, karma, redditAge }) {  

  return (
    <div className="right-panel-container">
        <UserInfoCard username={username} karma={karma} redditAge={redditAge} />
        <AchievementsCard />
        <SettingsCard />
        <SocialLinksCard />
        <TrophyCaseCard />
        <Footer />
    </div>
  );
}