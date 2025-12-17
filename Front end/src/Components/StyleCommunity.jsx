import React, { useState, useRef, useEffect } from "react";
import "../Styles/StyleCommunity.css";

export default function StyleCommunity({ data, onUpdate, onNext, onBack, onClose }) {
  const [bannerFile, setBannerFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const name = typeof data.name === "string" ? data.name : "";
  const description = typeof data.description === "string" ? data.description : "";

  const bannerInputRef = useRef(null);
  const iconInputRef = useRef(null);

  // Create preview URLs when files are selected
  useEffect(() => {
    if (bannerFile) {
      const url = URL.createObjectURL(bannerFile);
      setBannerPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBannerPreview(null);
    }
  }, [bannerFile]);

  useEffect(() => {
    if (iconFile) {
      const url = URL.createObjectURL(iconFile);
      setIconPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setIconPreview(null);
    }
  }, [iconFile]);

  // Update the parent state when banner or icon changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        banner: bannerFile,
        icon: iconFile
      });
    }
  }, [bannerFile, iconFile, onUpdate]);

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
  };

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
  };

  const deleteBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const deleteIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    if (iconInputRef.current) iconInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      // Clean up any remaining object URLs
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      if (iconPreview) URL.revokeObjectURL(iconPreview);
    };
  }, [bannerPreview, iconPreview]);

  const TrashIcon = () => (
    <svg fill="currentColor" height="16" width="16" viewBox="0 0 20 20">
      <path d="M15.2 15.7c0 .83-.67 1.5-1.5 1.5H6.3c-.83 0-1.5-.67-1.5-1.5V7.6H3v8.1C3 17.52 4.48 19 6.3 19h7.4c1.82 0 3.3-1.48 3.3-3.3V7.6h-1.8v8.1zM17.5 5.8c.5 0 .9-.4.9-.9S18 4 17.5 4h-3.63c-.15-1.68-1.55-3-3.27-3H9.4C7.68 1 6.28 2.32 6.13 4H2.5c-.5 0-.9.4-.9.9s.4.9.9.9h15zM7.93 4c.14-.68.75-1.2 1.47-1.2h1.2c.72 0 1.33.52 1.47 1.2H7.93z"></path>
    </svg>
  );

  const ImageIcon = () => (
    <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20">
      <path d="M14.6 2H5.4A3.4 3.4 0 002 5.4v9.2A3.4 3.4 0 005.4 18h9.2a3.4 3.4 0 003.4-3.4V5.4A3.4 3.4 0 0014.6 2zM5.4 3.8h9.2c.882 0 1.6.718 1.6 1.6v9.2c0 .484-.22.913-.561 1.207l-5.675-5.675a3.39 3.39 0 00-2.404-.996c-.87 0-1.74.332-2.404.996L3.8 11.488V5.4c0-.882.718-1.6 1.6-1.6zM3.8 14.6v-.567l2.629-2.628a1.59 1.59 0 011.131-.469c.427 0 .829.166 1.131.469l4.795 4.795H5.4c-.882 0-1.6-.718-1.6-1.6zm6.95-7.1a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0z"></path>
    </svg>
  );

  // Handle create community button click
  const handleCreateCommunity = () => {
    // Prepare ALL final data
    const finalData = {
      name: data.name,
      description: data.description,
      visibility: data.visibility,
      topics: data.topics || [],
      bannerFile: bannerFile,
      iconFile: iconFile
    };

    // Call onNext to pass data to parent
    if (onNext) {
      onNext(finalData);
    }
  };

  return (
    <div className="style-community-container">
      <div className="style-community-modal">
        <div className="modal-header-content">
          <header className="style-header">
            <h1>Style your community</h1>
            <p className="subtitle">
              Adding visual flair will catch new members' attention and help establish
              your community's culture! You can update this at any time.
            </p>
          </header>

          <div className="style-grid">
            {/* LEFT SIDE */}
            <aside className="left-settings">

              {/* Banner */}
              <div className="upload-section">
                <div className="label-row">
                  <span className="label-title">Banner</span>
                  <button
                    className="change-btn"
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <ImageIcon />
                    <span>{bannerFile ? "Change" : "Add"}</span>
                  </button>
                </div>

                {bannerFile && (
                  <div className="file-row">
                    <div className="file-left">
                      <ImageIcon />
                      <span className="file-name">{bannerFile.name}</span>
                    </div>
                    <button className="delete-btn" onClick={deleteBanner}>
                      <TrashIcon />
                    </button>
                  </div>
                )}

                <input
                  ref={bannerInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleBannerUpload}
                />
              </div>

              {/* Icon */}
              <div className="upload-section">
                <div className="label-row">
                  <span className="label-title">Icon</span>
                  <button
                    className="change-btn"
                    type="button"
                    onClick={() => iconInputRef.current?.click()}
                  >
                    <ImageIcon />
                    <span>{iconFile ? "Change" : "Add"}</span>
                  </button>
                </div>

                {iconFile && (
                  <div className="file-row">
                    <div className="file-left">
                      <ImageIcon />
                      <span className="file-name">{iconFile.name}</span>
                    </div>
                    <button className="delete-btn" onClick={deleteIcon}>
                      <TrashIcon />
                    </button>
                  </div>
                )}

                <input
                  ref={iconInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleIconUpload}
                />
              </div>

            </aside>

            {/* RIGHT SIDE PREVIEW */}
            <main className="preview-card">
              <div className="preview-banner">
                {bannerPreview ? (
                  <img src={bannerPreview} className="banner-img" alt="banner preview" />
                ) : (
                  <div className="banner-placeholder" />
                )}
              </div>

              <div className="preview-body">
                <div className="preview-header">
                  <div className="preview-icon">
                    {iconPreview ? (
                      <img src={iconPreview} className="icon-img" alt="icon preview" />
                    ) : (
                      <div className="icon-placeholder" />
                    )}
                  </div>

                  <div className="title-block">
                    <h2 className="preview-title">r/{name}</h2>
                    <p className="sub-info">1 weekly visitor · 1 weekly contributor</p>
                  </div>
                </div>

                <p className="preview-description">{description}</p>
              </div>
            </main>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="modal-footer">
          <button className="back-btn" type="button" onClick={onBack}>
            Back
          </button>

          <button
            className="create-btn"
            type="button"
            onClick={handleCreateCommunity}
          >
            Create Community
          </button>
        </footer>
      </div>
    </div>
  );
}