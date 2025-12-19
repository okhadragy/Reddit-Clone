import React, { useState, useEffect } from 'react';
import FeedPost from './FeedPost.jsx';
import PostPage from './PostPage.jsx';
import '../Styles/FeedPost.css';
<<<<<<< Updated upstream

const initialPosts = [
  {
    id: 1,
    subreddit: 'r/Messi',
    time: '19 hr. ago',
    title: 'Messiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
    content: '', 
    image: 'https://www.fcbarcelona.com/fcbarcelona/photo/2022/08/02/ae5252d1-b79b-4950-9e34-6e67fac09bb0/LeoMessi20092010_pic_fcb-arsenal62.jpg', 
    upvotes: 99999,
    comments: 99999
  },
  {
    id: 2,
    subreddit: 'r/hacking',
    time: '3 hr. ago',
    title: 'Learning more about attacking AI bots and applications',
    content: 'Good day, everyone, I want to learn more about adversarial techniques targeting AI systems so I can better evaluate and defend the AI bots and applications. I’d appreciate recommendations learning materials focused on AI security. Specifically, I’m interested in areas such as prompt-injection attacks, training-data poisoning...',
    upvotes: 2,
    comments: 0
  },
  {
    id: 4,
    subreddit: 'r/Raphinha',
    time: '15 hr. ago',
    title: 'Raphinhaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    content: '', 
    image: 'https://www.aljazeera.com/wp-content/uploads/2025/01/2025-01-21T220448Z_1474946714_UP1EL1L1PBY5X_RTRMADP_3_SOCCER-CHAMPIONS-SLB-BAR-REPORT-1737497355.jpg?resize=1800%2C1800', 
    upvotes: 44,
    comments: 1
  },
  {
    id: 5,
    subreddit: 'r/barcelona',
    time: '10 hr. ago',
    title: 'barcelona 2015',
    content: '', 
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlWBBL-uj02hDO6i6nGpXrFNlcHfybvVlBGQ&s', 
    upvotes: 54,
    comments: 1
  }
];

function Home({ isLoggedIn }) {
  const [selectedPost, setSelectedPost] = useState(null);

  // If a post is selected, show PostPage
  if (selectedPost) {
    return <PostPage post={selectedPost} onBack={() => setSelectedPost(null)} isLoggedIn={isLoggedIn} />;
  }
=======
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Ensure you import your configured axios instance

function Home() {
  const navigate = useNavigate();
  
  // State for posts and UI
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSort, setActiveSort] = useState('Hot');

  // CONSTANT: Your server's image path
  const POST_IMAGE_URL = "http://localhost:5000/uploads/posts/";

  useEffect(() => {
    const fetchHomeFeed = async () => {
      setLoading(true);
      try {
        // 1. Get User from local storage to check if logged in
        const storedUser = localStorage.getItem("user");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;

        let endpoint = '/posts'; // Default to popular/all if not logged in

        // 2. DETERMINE ENDPOINT
        // If user is logged in, use type=home to get joined communities
        if (currentUser) {
            endpoint = '/posts?type=home';
        } else {
 
            endpoint = '/posts?type=popular'; 
        }

        // 3. FETCH DATA
        const response = await api.get(endpoint);
        const backendPosts = response.data.data.posts;

        // 4. MAP DATA (Database Format -> UI Format)
        const formattedPosts = backendPosts.map(post => ({
            id: post._id,
            // Handle Community Name (Safely check if community exists)
            subreddit: post.community ? `r/${post.community.name}` : 'r/Unknown',
            
            // Format Date
            time: new Date(post.createdAt).toLocaleDateString(),
            
            title: post.title,
            content: post.content,
            
            // Handle Image URL
            image: (post.media && post.media.length > 0) 
              ? `${POST_IMAGE_URL}${post.media[0]}` 
              : null,
            
            // Vote Math
            upvotes: (post.upvotesCount || 0) - (post.downvotesCount || 0),
            comments: post.comments ? post.comments.length : 0,
            
            // User Vote Status (for coloring arrows)
            userVoteStatus: post.userVote
        }));

        setPosts(formattedPosts);

      } catch (err) {
        console.error("Error loading home feed:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeFeed();
  }, []); // Run once on mount

  if (loading) return <div className="loading-spinner">Loading your feed...</div>;
  if (error) return <div className="error-message">{error}</div>;
>>>>>>> Stashed changes

  return (
    <div className="feed-grid">
      {/* POSTS CONTAINER */}
      <div className="posts-container">
<<<<<<< Updated upstream
        {initialPosts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            onClick={() => setSelectedPost(post)} 
          />
        ))}
=======
        
        {posts.length > 0 ? (
          posts.map((post) => (
            // FeedPost handles the click to go to details internally usually, 
            // or you can wrap this in a Link
            <div key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
               <FeedPost post={post} />
            </div>
          ))
        ) : (
          // Empty State for Home Feed
          <div className="empty-feed-message">
            <h3>Your feed is empty!</h3>
            <p>Join some communities to see posts here.</p>
            <button onClick={() => navigate('/r/popular')} className="btn-primary">
                Browse Popular Communities
            </button>
          </div>
        )}
        
>>>>>>> Stashed changes
      </div>
    </div>
  );
}

export default Home;