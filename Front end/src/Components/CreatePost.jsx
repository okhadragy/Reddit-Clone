  import React, { useState, useRef } from "react";
  import { Routes, Route, useNavigate } from "react-router-dom";
import '../Styles/CreatePost.css'
  
  const CreatePost = ({ onSubmitPost }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState("text"); // 'text', 'image', 'link'
    const [title, setTitle] = useState("");
    const [bodyText, setBodyText] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    // Handle Image Upload
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
      }
    };

    const handlePost = () => {
      if (!title) return;

      const newPost = {
     
        title: title,
        subreddit: "u/Working_Scheme_650",
        time: "Just now",
        upvotes: 1,
        comments: 0,
        content: activeTab === "text" ? bodyText : null,
        image: activeTab === "image" ? imagePreview : null,
        linkDomain: activeTab === "link" ? linkUrl : null,
        thumbnail: activeTab === "image" ? imagePreview : null,
      };

      if (onSubmitPost) {
    
        onSubmitPost(newPost);
      }
         console.log("post created successfully");
      console.log("New Post Data:", newPost);
      // navigate("/"); // Uncomment to navigate after post
    };

    return (
      <div className="create-post-wrapper">
       

        <div className="cp-main-container">
          {/* Header */}
          <div className="cp-header">
            <h2>Create a post</h2>
            <button className="drafts-btn">Drafts</button>
          </div>

          {/* Profile (Community Selector) */}
          <div className="profile-selector">
            <div className="profile-icon"></div>
            <span style={{display: 'flex', flexDirection: 'column', marginLeft: '8px'}}>
              <span className="profile-name">u/Working_Scheme_650</span>
            </span>
            
          </div>

          {/* Form Box */}
          <div className="cp-form-box">
            
            {/* Tabs */}
            <div className="cp-tabs">
              <button 
                className={`cp-tab ${activeTab === "text" ? "active" : ""}`}
                onClick={() => setActiveTab("text")}
              >
                 Text
              </button>
              <button 
                className={`cp-tab ${activeTab === "image" ? "active" : ""}`}
                onClick={() => setActiveTab("image")}
              >
                 Images & Video
              </button>
              <button 
                className={`cp-tab ${activeTab === "link" ? "active" : ""}`}
                onClick={() => setActiveTab("link")}
              >
                 Link
              </button>
            </div>

            {/* Inputs Body */}
            <div className="cp-body">
              
              <div className="title-group">
                <input 
                  type="text" 
                  className="title-input" 
                  placeholder="Title" 
                  maxLength={300}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="char-count">{title.length}/300</span>
              </div>

              {/* TEXT TAB */}
              {activeTab === "text" && (
                <div className="editor-box">
                  <div className="editor-toolbar">
                    <button className="toolbar-btn">B</button>
                    <button className="toolbar-btn">i</button>
                    <button className="toolbar-btn">🔗</button>
                    <button className="toolbar-btn"><s>S</s></button>
                    <button className="toolbar-btn"><code>&lt;c&gt;</code></button>
                    <button className="toolbar-btn">A^</button>
                    <div style={{flex: 1}}></div>
                    <button className="toolbar-btn markdown-mode">Markdown Mode</button>
                  </div>
                  <textarea 
                    className="editor-textarea" 
                    placeholder="Body text (optional)"
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                  ></textarea>
                </div>
              )}

              {/* IMAGE TAB - WITH TOOLBAR UNDER IMAGE (like Reddit) */}
{activeTab === "image" && (
  <div className="image-tab-container">
    {/* Upload Area / Preview */}
    <div className="upload-area">
      {!imagePreview ? (
        <>
          <p style={{ color: "#818384", marginBottom: "16px", fontSize: "16px" }}>
            Drag and drop or upload media
          </p>
          <button
            className="upload-btn-real"
            onClick={() => fileInputRef.current.click()}
            aria-label="Upload image or video"
          >
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M10.3 16H6c-2.757 0-5-2.243-5-5a5.006 5.006 0 014.827-4.997c1.226-2.516 3.634-4.067 6.348-4.001a6.991 6.991 0 016.823 6.823 6.65 6.65 0 01-.125 1.434l-1.714-1.714c-.229-2.617-2.366-4.678-5.028-4.744-2.161-.059-4.058 1.307-4.892 3.463l-.247.638S6.448 7.798 6 7.798a3.204 3.204 0 00-3.2 3.2c0 1.764 1.436 3.2 3.2 3.2h4.3V16zm6.616-5.152l-3.28-3.28a.901.901 0 00-1.273 0l-3.28 3.28a.898.898 0 000 1.272.898.898 0 001.272 0l1.744-1.743v7.117a.9.9 0 001.8 0v-7.117l1.744 1.743a.898.898 0 001.272 0 .898.898 0 00.001-1.272z"></path>
            </svg>
          </button>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={handleImageChange}
          />
        </>
      ) : (
        <div className="image-preview-container">
          <img
            src={imagePreview}
            alt="Uploaded media"
            className="preview-image"
          />
          <button
            className="remove-image-btn"
            onClick={() => setImagePreview(null)}
            aria-label="Remove media"
          >
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
              <path d="M15.75 4h-3.5l-.875-1.75h-3.75L6.75 4h-3.5v1.75h13V4ZM6.375 15.5V6.5h7.25v9c0 .962-.788 1.75-1.75 1.75h-3.75c-.962 0-1.75-.788-1.75-1.75Z"></path>
            </svg>
          </button>
        </div>
      )}
    </div>

    {/* Rich Text Editor BELOW the image (just like Reddit) */}
    <div className="editor-box" style={{ marginTop: "16px" }}>
      <div className="editor-toolbar">
        <button className="toolbar-btn">B</button>
        <button className="toolbar-btn">i</button>
        <button className="toolbar-btn">Link</button>
        <button className="toolbar-btn"><s>S</s></button>
        <button className="toolbar-btn"><code>&lt;&gt;</code></button>
        <button className="toolbar-btn">A^</button>
        <div style={{ flex: 1 }}></div>
        <button className="toolbar-btn markdown-mode">Markdown Mode</button>
      </div>
      <textarea
        className="editor-textarea"
        placeholder="Add a caption (optional)"
        value={bodyText}
        onChange={(e) => setBodyText(e.target.value)}
      />
    </div>
  </div>
)}

              {/* LINK TAB */}
             {/* LINK TAB — Clean & Minimal (matches your original design) */}
{activeTab === "link" && (
  <div className="link-tab-container">
    {/* URL Input — uses your original rounded style */}
    <div className="link-input-area">
      <textarea
        placeholder="Url"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        rows={1}
        className="link-textarea"
      />
    </div>

    {/* Rich Text Editor BELOW the URL (for caption/body) */}
    <div className="editor-box" style={{ marginTop: "16px" }}>
      <div className="editor-toolbar">
        <button className="toolbar-btn">B</button>
        <button className="toolbar-btn">i</button>
        <button className="toolbar-btn">Link</button>
        <button className="toolbar-btn"><s>S</s></button>
        <button className="toolbar-btn"><code>&lt;&gt;</code></button>
        <button className="toolbar-btn">A^</button>
        <div style={{ flex: 1 }}></div>
        <button className="toolbar-btn markdown-mode">Markdown Mode</button>
      </div>
      <textarea
        className="editor-textarea"
        placeholder="Add a caption (optional)"
        value={bodyText}
        onChange={(e) => setBodyText(e.target.value)}
      />
    </div>
  </div>
)}

              {/* Footer Buttons */}
              <div className="cp-footer">
                

                <div className="submit-group">
                  <button className="btn-cancel">Save Draft</button>
                  <button 
                    className="btn-post" 
                    disabled={!title}
                    onClick={handlePost}
                  >
                    Post
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };


  /* ========================================
    MAIN APP COMPONENT
    ========================================
  */
  export default function App() {
    return (
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CreatePost />} />
        </Routes>
      </div>
    );
  }