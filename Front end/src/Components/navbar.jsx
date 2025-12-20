import { useAuth } from "./LoginContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef  } from 'react';
import api from "../api/api";

import {
  LogOut,
  Moon,
  Settings,
  Shield,
  Shirt,
  FileText,
  Trophy,
  DollarSign,
  Megaphone,
  Zap,
} from "lucide-react";

function Navbar({ isLoggedIn }) {
  const { logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const navigate = useNavigate();

  // --- SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debounceRef = useRef(null); // Ref for debouncing

  const communities = [
    "r/reactjs",
    "r/webdev",
    "r/javascript",
    "r/programming",
    "r/Football",
    "r/Messi",
    "r/Barcelona",
    "r/Tottenham",
  ];

  const fetchUsers = async (query) => {
    try {
      const res = await api.get(
        `/users?search=${query}&limit=5`
      );

      if (res.data.status === "success") {
        return res.data.data.map((u) => `u/${u.name}`);
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };



  // --- HANDLE SEARCH (With Debounce) ---
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const matchedCommunities = communities.filter((c) =>
        c.toLowerCase().includes(query)
      );

      // users from backend
      const matchedUsers = await fetchUsers(query);

      setSearchResults([...matchedCommunities, ...matchedUsers]);
    }, 300); // debounce delay
  };


  // --- DARK MODE EFFECT (INSERTED HERE CORRECTLY) ---
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="Navbar">
      <div className="redditname_logo" onClick={() => {navigate("/"); setSearchQuery(""); setSearchResults([]); setIsUserMenuOpen(false);}}>
        <img className="redditlogo" src="\Reddit-symbol.png" alt="Reddit Logo" />
        <h1>reddit</h1>
      </div>

      {/* SEARCH BAR */}
      <div className="search-container">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ffffff"
          width="16"
          height="16"
          viewBox="0 0 20 20"
        >
          <path d="M18.736 17.464l-3.483-3.483A7.961 7.961 0 0016.999 9 8 8 0 109 17a7.961 7.961 0 004.981-1.746l3.483 3.483a.9.9 0 101.272-1.273zM9 15.2A6.207 6.207 0 012.8 9c0-3.419 2.781-6.2 6.2-6.2s6.2 2.781 6.2 6.2-2.781 6.2-6.2 6.2z" />
        </svg>

        <input
          className="SearchBar"
          placeholder="Search Reddit"
          value={searchQuery}
          onChange={handleSearch}
        />

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((item, index) => (
              <div key={index} className="search-item" onClick={() => {navigate(`/${item}`); setSearchQuery(""); setSearchResults([]); setIsUserMenuOpen(false);}}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navbar-right">
        {!isLoggedIn ? (
          <>
            <button onClick={() => navigate("/login?mode=login")} className="LoginButton">Log In</button>
            <button className="threedots">...</button>
          </>
        ) : (
          <>
            <button className="ADS">
              <svg rpl="" fill="currentColor" height="20" icon-name="ad-group" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.972 5.028C16.831 3.338 15.426 2 13.7 2H3.3C1.481 2 0 3.48 0 5.3v6.4c0 1.726 1.337 3.131 3.028 3.272C3.169 16.662 4.574 18 6.3 18h10.4c1.819 0 3.3-1.48 3.3-3.3V8.3c0-1.726-1.337-3.131-3.028-3.272zM3 8.3v4.87a1.5 1.5 0 01-1.199-1.47V5.3c0-.827.672-1.5 1.499-1.5h10.4c.724 0 1.33.516 1.469 1.2H6.3C4.481 5 3 6.48 3 8.3zm15.199 6.4c0 .827-.672 1.5-1.499 1.5H6.3a1.501 1.501 0 01-1.499-1.5V8.3c0-.827.672-1.5 1.499-1.5h10.4c.827 0 1.499.673 1.499 1.5v6.4zM9.545 8.741H8.281L6 14.259h1.709l.389-1.009h1.635l.389 1.009h1.707L9.545 8.741zm.067 3.344H8.22l.681-1.793h.027l.684 1.793zm5.937-3.053a3.162 3.162 0 00-1.339-.291h-1.965v5.517h2.053c.458 0 .898-.108 1.307-.32a2.532 2.532 0 001.008-.958c.256-.422.386-.932.386-1.516 0-.596-.137-1.107-.405-1.519a2.48 2.48 0 00-1.046-.914l.001.001zm-.147 2.441c0 .304-.058.557-.171.753a1.097 1.097 0 01-.414.424 1.01 1.01 0 01-.487.136h-.488v-2.569h.488c.163 0 .329.042.496.125.161.081.295.21.407.397.112.184.169.431.169.735v-.001z"></path>
              </svg>
            </button>

            <button className="messages">
              <svg rpl="" fill="currentColor" height="20" icon-name="chat" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1a9 9 0 00-9 9c0 1.947.79 3.58 1.935 4.957L.231 17.661A.784.784 0 00.785 19H10a9 9 0 009-9 9 9 0 00-9-9zm0 16.2H6.162c-.994.004-1.907.053-3.045.144l-.076-.188a36.981 36.981 0 002.328-2.087l-1.05-1.263C3.297 12.576 2.8 11.331 2.8 10c0-3.97 3.23-7.2 7.2-7.2s7.2 3.23 7.2 7.2-3.23 7.2-7.2 7.2zm5.2-7.2a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zm-4 0a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zm-4 0a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"></path>
              </svg>
            </button>



            <button className="notifications">
              <svg rpl="" fill="currentColor" height="20" icon-name="notifications" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.176 14.218l-.925-1.929a2.577 2.577 0 01-.25-1.105V8c0-3.86-3.142-7-7-7-3.86 0-7 3.14-7 7v3.184c0 .38-.088.762-.252 1.105l-.927 1.932A1.103 1.103 0 002.82 15.8h3.26A4.007 4.007 0 0010 19a4.008 4.008 0 003.918-3.2h3.26a1.1 1.1 0 00.934-.514 1.1 1.1 0 00.062-1.068h.002zM10 17.2c-.93 0-1.722-.583-2.043-1.4h4.087a2.197 2.197 0 01-2.043 1.4zM3.925 14l.447-.933c.28-.584.43-1.235.43-1.883V8c0-2.867 2.331-5.2 5.198-5.2A5.205 5.205 0 0115.2 8v3.184c0 .648.147 1.299.428 1.883l.447.933H3.925z"></path>
              </svg>
            </button>

            {/* AVATAR MENU */}
            <div className="avatar-container">
              <button className="avatar" onClick={toggleMenu}>
                <div className="avatar-status-dot"></div>
                <img
                  src={user?.photo ? `http://localhost:5000/uploads/profiles/${user.photo}` : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"}
                  alt="User Avatar"
                />
              </button>

              {isUserMenuOpen && (
                <div className="user-menu-dropdown">

                  {/* PROFILE */}
                  <div className="menu-section profile" onClick={() => {navigate(`/u/${user?.name}`); setIsUserMenuOpen(false);}}>
                    <img
                      src={user?.photo ? `http://localhost:5000/uploads/profiles/${user.photo}` : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"}
                      className="menu-avatar-img"
                      alt="User"
                    />
                    <div className="profile-text-block">
                      <span className="menu-main-text">View Profile</span>
                      <span className="menu-sub-text">u/{user?.name}</span>
                    </div>
                  </div>

                  {/* MAIN MENU ITEMS */}
                  <div className="menu-section">
                    <MenuItem icon={<Shirt size={18} />} label="Edit Avatar" />
                    <MenuItem icon={<FileText size={18} />} label="Drafts" onClick={()=> {navigate('/drafts'); setIsUserMenuOpen(false);}}/>
                    <MenuItem icon={<Trophy size={18} />} label="Achievements" subLabel="2 unlocked" />
                    <MenuItem icon={<DollarSign size={18} />} label="Earn" subLabel="Earn cash on Reddit" />
                    <MenuItem icon={<Shield size={18} />} label="Premium" />
                  </div>

                  {/* DARK MODE */}
                  <div className="menu-section">
                    <div className="menu-item" onClick={toggleDarkMode}>
                      <div className="menu-left">
                        <Moon size={18} />
                        <span className="menu-main-text">Dark Mode</span>
                      </div>

                      <div className={`toggle-switch ${isDarkMode ? "active" : ""}`}>
                        <div className="toggle-knob"></div>
                      </div>
                    </div>
                  </div>

                  {/* OTHER OPTIONS */}
                  <div className="menu-section">
                    <MenuItem icon={<Megaphone size={18} />} label="Advertise on Reddit" />
                    <MenuItem icon={<Zap size={18} />} label="Try Reddit Pro" badge="BETA" />
                    <MenuItem icon={<Settings size={18} />} label="Settings" onClick={() => {navigate("/settings"); setIsUserMenuOpen(false);}} />
                  </div>

                  {/* LOGOUT */}
                  <div className="menu-section no-border">
                    <MenuItem icon={<LogOut size={18} />} label="Log Out" onClick={() => { logout(); navigate("/"); setIsUserMenuOpen(false); }} />
                  </div>

                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

const MenuItem = ({ icon, label, subLabel, badge, onClick }) => (
  <button className="menu-item" onClick={onClick}>
    <div className="menu-left">
      <div className="menu-icon-wrapper">{icon}</div>
      <div>
        <span className="menu-main-text">{label}</span>
        {subLabel && <span className="menu-sub-text">{subLabel}</span>}
      </div>
    </div>
    {badge && <span className="menu-badge">{badge}</span>}
  </button>
);

export default Navbar;