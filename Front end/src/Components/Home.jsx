import React, { useState, useEffect } from 'react';
import FeedPost from './FeedPost.jsx';
import PostPage from './PostPage.jsx';
import '../Styles/FeedPost.css';


import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Ensure you import your configured axios instance

function Home({ currentUser }) {
  const navigate = useNavigate();


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // CONSTANT: Your server's image path
  const POST_IMAGE_URL = `${process.env.REACT_APP_STATIC_URL}/posts/`;

  useEffect(() => {
    const fetchHomeFeed = async () => {
      setLoading(true);
      try {

        let endpoint = '/posts';

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
          subreddit: post.community ? `r/${post.community.name}` : 'r/Unknown',
          communityName: post.community ? post.community.name : null,
          time: new Date(post.createdAt).toLocaleDateString(),
          title: post.title,
          content: post.content,
          image: (post.media && post.media.length > 0)
            ? `${POST_IMAGE_URL}${post.media[0]}`
            : null,
          votesCount: post.upvotesCount - post.downvotesCount,
          commentsCount: post.commentsCount,
          voteStatus: post.userVote,
          isJoined: post.isJoined || false,
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


  return (
    <div className="feed-grid">
      {/* POSTS CONTAINER */}
      <div className="posts-container">

        {posts.length > 0 ? (
          posts.map((post) => (
            <FeedPost key={post.id} post={post} currentUser={currentUser} />
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

      </div>
    </div>
  );
}

export default Home;