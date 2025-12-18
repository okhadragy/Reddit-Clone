import { Routes, Route } from 'react-router-dom';
/*==============================Components==============================*/
import AddTopics from './Components/AddTopics.jsx'
import CommunityNameDesc from './Components/CommunityNameDesc.jsx';
import CommunityVisibility from './Components/CommunityVisibility.jsx';
import CreatePost from './Components/CreatePost.jsx';
import CustomFeed from './Components/CustomFeed.jsx';

import ExplorePage from './Components/ExplorePage.jsx';
import FeedPost from "./Components/FeedPost.jsx"
import Home from './Components/Home.jsx';
import Login_Signup from "./Components/Login_Signup.jsx";
import ManageCommunties from './Components/ManageCommunities.jsx';
import Navbar from './Components/navbar.jsx';
import PostPage from './Components/PostPage.jsx';

import SettingItem from "./Components/SettingItem.jsx"
import SettingsLayout from './Components/SettingsLayout.jsx';
import SettingsNav from './Components/SettingsNav.jsx';
import Sidebar from './Components/sidebar.jsx';
import StyleCommunity from './Components/StyleCommunity.jsx';
import UserProfile from './Components/UserProfile.jsx';
import CreateCommunity from './Components/CreateCommunity.jsx';

/*==============================Components==============================*/

/*==============================Styles==============================*/
import './App.css';
import './Styles/AddTopics.css'
import './Styles/Login_Signup.css'
import './Styles/sidebar.css'
import './Styles/navbar.css'
import './Styles/FeedPost.css';
import './Styles/ExplorePage.css'
import './Styles/PostPage.css'
import './Styles/SettingsLayout.css'
import './Styles/CommunityVisibility.css';

import './Styles/CommunityNameDesc.css'
import './Styles/SettingsLayout.css';
import AuthRoute from './guards/AuthRoute.jsx';
import ProtectedRoute from './guards/ProtectedRoute.jsx';
import { useAuth } from "./Components/LoginContext";


/*==============================Styles==============================*/

function AppContent() {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return null;

    return (

        <div className='Homepage'>
            <Navbar isLoggedIn={isLoggedIn} />
            <Sidebar isLoggedIn={isLoggedIn} />

            <div className='FeedLayout'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<AuthRoute><Login_Signup /></AuthRoute>} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/post/:id" element={<PostPage />} />
                    <Route path="/custom-feed" element={<ProtectedRoute><CustomFeed /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>} />
                    <Route path="/user" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                    <Route path="/r/:communityName" element={<ProtectedRoute><CreateCommunity /></ProtectedRoute>} />
                </Routes>
            </div>

        </div>
    );
}

export default AppContent;
