import { useState, useEffect } from "react";
import { useAuth } from "./LoginContext";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Import your API helper
import StartACommunityModal from "./StartACommunityModal";

export default function Sidebar({ isLoggedIn }) {
  const [sidebarIsOpened, setSidebarIsOpened] = useState(true);
  
  // Section States
  const [resourcesIsOpened, setResourcesIsOpened] = useState(true);
  const [GamesonRedditIsOpened, SetGamesonRedditIsOpened] = useState(false);
  const [CustomFeedIsOpened, SetCustomFeedIsOpened] = useState(false);
  const [RecentIsOpened, SetRecentIsOpened] = useState(false);
  const [CommunitiesIsOpened, SetCommunitiesIsOpened] = useState(false); 

  const [toastMessage, setToastMessage] = useState("");
  const [isCommunityModalOpen, setCommunityModalOpen] = useState(false);
  
  // NEW STATE: Store the list of joined communities
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  const navigate = useNavigate();

  // --- NEW: FETCH JOINED COMMUNITIES ---
  useEffect(() => {
    if (isLoggedIn) {
      const fetchMyCommunities = async () => {
        try {
          // Calls the new endpoint we made: router.get('/joined'...)
          const response = await api.get('/community/joined'); 
          setJoinedCommunities(response.data.data.communities);
        } catch (error) {
          console.error("Failed to load sidebar communities", error);
        }
      };
      fetchMyCommunities();
    }
  }, [isLoggedIn]);

  function showToast(text) {
    setToastMessage(text);
    setTimeout(() => setToastMessage(""), 3000);
  }

  return (
    <aside className={"sidebar " + (sidebarIsOpened ? "opened" : "closed")}>
      <button
        className="sidebartogglebutton"
        onClick={() => setSidebarIsOpened(!sidebarIsOpened)}
      >
        ☰
      </button>

      {!isLoggedIn ? (
        // --- LOGGED OUT VIEW (Unchanged) ---
        <>
          {sidebarIsOpened && (
            <div className="sidebar-content">
              {/* FIRST SECTION */}
              <ul className="part1beforeline">
                <div className="allbuttonscss">
                  <li><button onClick={() => navigate("/")}>Home</button></li>
                  <li><button >Popular</button></li>
                  <li><button>Answers (Beta)</button></li>
                  <li><button onClick={() => navigate("/explore")}>Explore</button></li>
                </div>
              </ul>

              <hr />

              {/* RESOURCES */}
              <div className="resourcesSection">
                <div
                  className="resourcesHeader"
                  onClick={() => setResourcesIsOpened(!resourcesIsOpened)}
                >
                  <span className="Resources">RESOURCES</span>
                  <span className="arrow">{resourcesIsOpened ? <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg> : <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg>}</span>
                </div>

                {resourcesIsOpened && (
                  <div className="resourcescontainer">
                    <ul className="resourcesList">
                      <li><button>About Reddit</button></li>
                      <li><button>Advertise</button></li>
                      <li><button>Developer Platform</button></li>
                      <li><button>Reddit Pro (Beta)</button></li>
                      <li><button>Help</button></li>
                      <li><button>Blog</button></li>
                      <li><button>Careers</button></li>
                      <li><button>Press</button></li>
                    </ul>
                    <hr />
                    <ul className="resourcesList">
                      <li><button>Communities</button></li>
                      <li><button>Best of Reddit</button></li>
                      <li><button>Best of Reddit in English</button></li>
                      <li><button>Best of Reddit in Arabic</button></li>
                    </ul>
                    <hr />
                    <ul className="resourcesList">
                      <li><button>Reddit Rules</button></li>
                      <li><button>Privacy Policy</button></li>
                      <li><button>User Agreement</button></li>
                      <li><button>Accessibility</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        // --- LOGGED IN VIEW ---
        <>
          {sidebarIsOpened && (
            <div className="sidebar-content">
        
              <ul className="part1beforeline">
                 <div className="allbuttonscss">
                <li><button onClick={() => navigate("/")}>Home</button></li>
                <li><button>Popular</button></li>
                <li><button onClick={() => navigate("/explore")}>Explore</button></li>
                <li><button>All</button></li>
                <li>
                 <button onClick={() => setCommunityModalOpen(true)}>
                   <span className="Plus">+</span> Start a community
                 </button>
                 </li>
              </div>  
              </ul>
              {isCommunityModalOpen && (
                <StartACommunityModal onClose={() => setCommunityModalOpen(false)} />
              )}
              <hr />

              <div className="GamesSection">
                <div
                    className="GameSectionHeader"
                    onClick={() => {
                      const newState = !GamesonRedditIsOpened;
                      SetGamesonRedditIsOpened(newState);
                      showToast(
                        newState
                          ? "Games section badges turned on"
                          : "Games section badges turned off"
                      );
                    }}
                  >
                    <span className="Games">GAMES ON REDDIT </span>
                    <span className="arrow">{GamesonRedditIsOpened ? <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg> : <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg>}</span>
                  </div>

                {GamesonRedditIsOpened && (
                  <div className="Gamecontainer">
                    <ul className="GamesList">
                      <li><button>Hot and Cold</button></li>
                      <li><button>Farm Merge Valley</button></li>
                      <li><button>Ninigrams</button></li>
                      <li><button>Discover More Games</button></li>
                    </ul>
                  </div>
                )}
                <hr />
              </div>

              {/* CUSTOM FEED SECTION (Unchanged) */}
              <div className="CustomFeedSection">
                <div
                  className="CustomFeedHeader"
                  onClick={() => SetCustomFeedIsOpened(!CustomFeedIsOpened)}
                >
                  <span className="CustomFeed">CUSTOM FEEDS </span>
                  <span className="arrow">{CustomFeedIsOpened ? <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg> : <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg>}</span>
                </div>

                {CustomFeedIsOpened && (
                  <div className="CustomFeedcontainer">
                    <ul className="CustomFeedList">
                      <li><button><span className="Plus">+</span> Create Custom Feed </button></li>
                    </ul>
                  </div>
                )}
              </div>
              <hr/>

   
              <div className="RecentSection">
                <div
                  className="RecentHeader"
                  onClick={() => SetRecentIsOpened(!RecentIsOpened)}
                >
                  <span className="Recent">RECENT </span>
                  <span className="arrow">{RecentIsOpened ? <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg> : <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg>}</span>
                </div>
                {RecentIsOpened && (
                  <div className="Recentcontainer">
                    <ul className="RecentList">
                    </ul>
                  </div>
                )}
              </div>
              <hr/>

              {/* --- COMMUNITIES SECTION (UPDATED) --- */}
              <div className="CommunitiesSection">
                <div
                  className="CommunitiesHeader"
                  onClick={() => SetCommunitiesIsOpened(!CommunitiesIsOpened)}
                >
                  <span className="Communities">COMMUNITIES </span>
                  <span className="arrow">{CommunitiesIsOpened ? <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg> : <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg>}</span>
                </div>

                {CommunitiesIsOpened && (
                  <div className="Communitiescontainer">
                    <ul className="CommunitiesList">
                      
                      {/* 1. Mapped Communities */}
                      {joinedCommunities.map((community) => (
                        <li key={community._id}>
                          <button 
                            onClick={() => navigate(`/r/${community.name}`)}
                            className="community-link-btn"
                            style={{ textAlign: "left", paddingLeft: "15px", width: "100%", border: "none", background: "none", cursor: "pointer" }}
                          >
                             r/{community.name}
                          </button>
                        </li>
                      ))}

                      {/* 2. Original Buttons */}
                      <li><button onClick={() => setCommunityModalOpen(true)}><span className="Plus">+</span> Create Community </button></li>
                      <li><button><svg className="gear" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.145 18.995h-2.29a1.56 1.56 0 01-1.501-1.134l-.051-.18a2.161 2.161 0 00-2.604-1.504l-.185.046a1.561 1.561 0 01-1.731-.734l-1.146-1.985a1.561 1.561 0 01.229-1.864l.132-.137a2.163 2.163 0 000-3.007l-.13-.135a1.561 1.561 0 01-.23-1.866L2.783 4.51a1.56 1.56 0 011.73-.734l.186.046a2.161 2.161 0 002.603-1.504l.05-.18a1.562 1.562 0 011.503-1.134h2.29c.697 0 1.31.463 1.5 1.133l.053.183a2.157 2.157 0 002.599 1.502l.189-.047a1.561 1.561 0 011.73.734l1.147 1.985a1.561 1.561 0 01-.23 1.864l-.133.14a2.162 2.162 0 000 3.004l.132.137c.485.5.578 1.262.23 1.866l-1.145 1.984a1.56 1.56 0 01-1.731.734l-.187-.047a2.16 2.16 0 00-2.601 1.503l-.052.182a1.562 1.562 0 01-1.502 1.134zm-2.11-1.8l1.933-.01a3.947 3.947 0 014.77-2.754l.01.002.967-1.672-.008-.007a3.943 3.943 0 010-5.508l.007-.007-.966-1.672-.01.002a3.945 3.945 0 01-4.771-2.754l-.003-.01-1.933.009A3.946 3.946 0 014.26 5.569l-.01-.002-.966 1.672.008.007a3.943 3.943 0 010 5.508l-.007.007.966 1.672.01-.002a3.947 3.947 0 014.77 2.754l.004.01zM10 13c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm0-4.2c-.661 0-1.2.539-1.2 1.2 0 .66.539 1.2 1.2 1.2.66 0 1.199-.54 1.199-1.2 0-.661-.538-1.2-1.2-1.2z"></path>
                  </svg>Manage Communities</button></li>
                    </ul>
                  </div>
                )}
              </div>
              <hr/>
              
              {/* RESOURCES (Unchanged) */}
              <div className="resourcesSection">
                <div
                  className="resourcesHeader"
                  onClick={() => setResourcesIsOpened(!resourcesIsOpened)}
                >
                  <span className="Resources">RESOURCES</span>
                  <span className="arrow">{resourcesIsOpened ?<svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg> : <svg className="text-secondary-weak undefined" fill="currentColor" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.7a.897.897 0 01-.636-.264l-4.6-4.6a.9.9 0 111.272-1.273L10 11.526l3.964-3.963a.9.9 0 011.272 1.273l-4.6 4.6A.897.897 0 0110 13.7z"></path>
    </svg>}</span>
                </div>

                {resourcesIsOpened && (
                  <div className="resourcescontainer">
                    <ul className="resourcesList">
                      <li><button>About Reddit</button></li>
                      <li><button>Advertise</button></li>
                      <li><button>Developer Platform</button></li>
                      <li><button>Reddit Pro (Beta)</button></li>
                      <li><button>Help</button></li>
                      <li><button>Blog</button></li>
                      <li><button>Careers</button></li>
                      <li><button>Press</button></li>
                    </ul>
                    <hr />
                    <ul className="resourcesList">
                      <li><button>Communities</button></li>
                      <li><button>Best of Reddit</button></li>
                      <li><button>Best of Reddit in English</button></li>
                      <li><button>Best of Reddit in Arabic</button></li>
                    </ul>
                    <hr />
                    <ul className="resourcesList">
                      <li><button>Reddit Rules</button></li>
                      <li><button>Privacy Policy</button></li>
                      <li><button>User Agreement</button></li>
                      <li><button>Accessibility</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}