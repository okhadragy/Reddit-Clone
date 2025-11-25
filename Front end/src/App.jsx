import { AppProvider } from './Components/LoginContext.jsx';
import './App.css';
import Login_Signup from "./Components/Login_Signup.jsx";    
import './Styles/Login_Signup.css'
import Sidebar from './Components/sidebar.jsx';
import './Styles/sidebar.css'
import Navbar from './Components/navbar.jsx';
import './Styles/navbar.css'
import './Styles/FeedPost.css';
import FeedPost from "./Components/FeedPost.jsx"
import CustomFeed from './Components/CustomFeed.jsx';
import Home from './Components/Home.jsx';
import ExplorePage from './Components/ExplorePage.jsx';
import './Styles/ExplorePage.css'
import PostPage from './Components/PostPage.jsx';
import './Styles/PostPage.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className='Homepage'>
          <Navbar />
          <Sidebar />
          
          <div className='FeedLayout'>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login_Signup />} />
              <Route path="/explore" element={<ExplorePage/>} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/custom-feed" element={<CustomFeed />} />
            </Routes>
          </div>

        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
