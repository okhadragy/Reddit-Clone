import React, { useState } from 'react';
import FeedPost from './FeedPost.jsx';
import PostPage from './PostPage.jsx';
import '../Styles/FeedPost.css';

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

  return (
    <div className="feed-grid">
      {/* POSTS CONTAINER */}
      <div className="posts-container">
        {initialPosts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            onClick={() => setSelectedPost(post)} 
          />
        ))}
      </div>
    </div>
  );
}

export default Home;