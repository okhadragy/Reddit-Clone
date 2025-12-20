import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";
import "../Styles/CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const { communityName, postId } = useParams(); // 👈 postId optional
  const isEditMode = Boolean(postId);

  const fileInputRef = useRef(null);

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("text");
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  

  /* ---------------- Fetch Community ---------------- */
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await api.get(`/community/${communityName}`);
        setCommunity(res.data.data.community);
      } catch (err) {
        navigate("/");
      }
    };

    fetchCommunity();
  }, [communityName, navigate]);

  /* ---------------- Fetch Post (EDIT MODE) ---------------- */
  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${postId}`);
        const post = res.data.data.post;

        setTitle(post.title || "");
        setBodyText(post.content || "");
        setActiveTab(post.mediaType || "text");

        if (post.mediaType === "link") {
          setLinkUrl(post.content);
        }

        if (post.mediaType === "image" && post.media) {
          setImagePreview(`http://localhost:5000/uploads/posts/${post.media[0]}`); // existing image
          setImageFile(null);              // reset file, only set if user uploads new
        }
      } catch (err) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [isEditMode, postId, navigate]);

  

  /* ---------------- Image Handling ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ---------------- Submit (Create / Update) ---------------- */
  const submitPost = async (isDraft) => {
    if (!title || !community?._id) return;

    setSubmitting(true);

    try {
      let response;

      const endpoint = isEditMode ? `/posts/${postId}` : "/posts";
      const method = isEditMode ? api.patch : api.post;

      // IMAGE
      if (activeTab === "image" && imageFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", bodyText);
        formData.append("mediaType", "image");
        formData.append("community", community._id);
        formData.append("isDraft", isDraft);
        formData.append("media", imageFile);
        formData.append("flair", "Announcement");
        formData.append("tags[]", "welcome");
        formData.append("tags[]", "announcement");

        response = await method(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      } else {
        // TEXT / LINK
        response = await method(endpoint, {
          title,
          content: activeTab === "link" ? linkUrl : bodyText,
          mediaType: activeTab,
          community: community._id,
          flair: "Announcement",
          tags: ["welcome", "announcement"],
          isDraft,
        });
      }

      const post = response.data.data.post;

      if (!isDraft) {
        navigate(`/posts/${post._id}`);
      } else {
        navigate(`/r/${community.name}`);
      }

    } catch (err) {
      alert("Failed to save post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !community) return null;

  return (
    <div className="create-post-wrapper">
      <div className="cp-main-container">

        <div className="cp-header">
          <h2>{isEditMode ? "Edit post" : "Create a post"}</h2>
          <button className="drafts-btn">Drafts</button>
        </div>

        <div className="profile-selector">
          <div className="profile-icon"></div>
          <span style={{ display: "flex", flexDirection: "column", marginLeft: "8px" }}>
            <span className="profile-name">r/{community.name}</span>
          </span>
        </div>

        <div className="cp-form-box">

          <div className="cp-tabs">
            {community.allowedPostTypes.map((type) => {
              if (type === "media") return null;
              return (
                <button
                  key={type}
                  className={`cp-tab ${activeTab === type ? "active" : ""}`}
                  onClick={() => setActiveTab(type)}
                >
                  {type === "text" ? "Text" : type === "image" ? "Images & Video" : "Link"}
                </button>
              );
            })}
          </div>

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

            {/* TEXT */}
            {activeTab === "text" && (
              <div className="editor-box">
                <div className="editor-toolbar">
                  <button className="toolbar-btn">B</button>
                  <button className="toolbar-btn">i</button>
                  <button className="toolbar-btn">🔗</button>
                  <button className="toolbar-btn"><s>S</s></button>
                  <button className="toolbar-btn"><code>&lt;c&gt;</code></button>
                  <button className="toolbar-btn">A^</button>
                  <div style={{ flex: 1 }} />
                  <button className="toolbar-btn markdown-mode">Markdown Mode</button>
                </div>

                <textarea
                  className="editor-textarea"
                  placeholder="Body text (optional)"
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                />
              </div>
            )}


            {/* IMAGE */}
            {activeTab === "image" && (
              <div className="image-tab-container">

                <div className="upload-area">
                  {!imagePreview ? (
                    <button
                      className="upload-btn-real"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Upload
                    </button>
                  ) : (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="preview" className="preview-image" />
                      <button
                        className="remove-image-btn"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Caption editor */}
                <div className="editor-box" style={{ marginTop: "16px" }}>
                  <div className="editor-toolbar">
                    <button className="toolbar-btn">B</button>
                    <button className="toolbar-btn">i</button>
                    <button className="toolbar-btn">🔗</button>
                    <button className="toolbar-btn"><s>S</s></button>
                    <button className="toolbar-btn"><code>&lt;&gt;</code></button>
                    <button className="toolbar-btn">A^</button>
                    <div style={{ flex: 1 }} />
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


            {/* LINK */}
            {activeTab === "link" && (
              <div className="link-tab-container">

                <div className="link-input-area">
                  <textarea
                    className="link-textarea"
                    placeholder="Url"
                    rows={1}
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>

                <div className="editor-box" style={{ marginTop: "16px" }}>
                  <div className="editor-toolbar">
                    <button className="toolbar-btn">B</button>
                    <button className="toolbar-btn">i</button>
                    <button className="toolbar-btn">🔗</button>
                    <button className="toolbar-btn"><s>S</s></button>
                    <button className="toolbar-btn"><code>&lt;&gt;</code></button>
                    <button className="toolbar-btn">A^</button>
                    <div style={{ flex: 1 }} />
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

            <div className="cp-footer">
              <div className="submit-group">
                <button
                  className="btn-cancel"
                  disabled={!title || submitting}
                  onClick={() => submitPost(true)}
                >
                  {!(isEditMode) ? "Save Draft" : "Update Draft"}
                </button>

                <button
                  className="btn-post"
                  disabled={!title || submitting}
                  onClick={() => submitPost(false)}
                >
                  {submitting ? "Saving..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
