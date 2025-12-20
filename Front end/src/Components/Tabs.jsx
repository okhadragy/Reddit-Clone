import React, { useState } from "react";
import { ChevronRight } from 'lucide-react';
import { AuthorizationItem } from "./SettingItem";
import SettingItem from "./SettingItem";

// Account Tab
export const AccountTab = ({ settings, setSettings, onOpenEmailModal, onOpenGenderModal, onOpenLocationModal, openDeleteModal }) => (
    <>
      <section className="settings-section">
        <h2 className="settings-section-title">General</h2>
        
        <SettingItem
          label="Email address"
          value={settings.email}
          onClick={onOpenEmailModal}
        />
  
        <SettingItem
          label="Gender"
          value={settings.gender}
          onClick={onOpenGenderModal}
        />
  
        <SettingItem
          label="Location customization"
          value={settings.location}
          onClick={onOpenLocationModal}
        />
      </section>
  
      <section className="settings-section">
        <h2 className="settings-section-title">Account authorization</h2>
        
        <div className="auth-items-container">
          <AuthorizationItem
            label="Google"
            description="Connect to log in to Reddit with your Google account"
            connected={settings.googleConnected}
            onToggle={() => setSettings({...settings, googleConnected: !settings.googleConnected})}
          />
          
          <AuthorizationItem
            label="Apple"
            description="Connect to log in to Reddit with your Apple account"
            connected={settings.appleConnected}
            onToggle={() => setSettings({...settings, appleConnected: !settings.appleConnected})}
          />
        </div>
  
        <div className="two-factor-container">
          <div className="two-factor-content">
            <div>
              <h3 className="two-factor-title">Two-factor authentication</h3>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => setSettings({...settings, twoFactorEnabled: e.target.checked})}
                className="toggle-input"
              />
              <div className="toggle-slider"></div>
            </label>
          </div>
        </div>
      </section>
  
      <section className="settings-section">
        <h2 className="settings-section-title">Reddit Premium</h2>
        
        <a 
          href="https://www.reddit.com/premium" 
          target="_blank" 
          rel="noopener noreferrer"
          className="premium-link"
        >
          <button className="premium-button">
            <span className="premium-text">Get premium</span>
            <ChevronRight className="chevron-icon" />
          </button>
        </a>
      </section>
  
      <section className="settings-section">
        <h2 className="settings-section-title">Advanced</h2>
        
        <button className="advanced-button" onClick={openDeleteModal}>
          <span className="advanced-text">Delete account</span>
          <ChevronRight className="chevron-icon" />
        </button>
      </section>
    </>
  );
  // Profile Tab
  export const ProfileTab = ({settings,setSettings,openDisplayNameModal,openAboutModal,openCategoryModal,openSocialModal}) => {
    return (
      <>
        {/* --- PROFILE INFORMATION --- */}
        <section className="settings-section">
          <h2 className="settings-section-title">Profile Information</h2>
  
          <SettingItem
            label="Display name"
            value={settings.displayName}
            onClick={openDisplayNameModal}
          />
  
          <SettingItem
            label="About"
            value={settings.about}
            onClick={openAboutModal}
          />
  
          <SettingItem
            label="Profile category"
            value={settings.category}
            onClick={openCategoryModal}
          />
        </section>
  
        {/* --- APPEARANCE (avatar & banner) --- */}
        <section className="settings-section">
          <h2 className="settings-section-title">Appearance</h2>
  
          <div className="profile-appearance-container">
            <div className="appearance-row">
              <span className="appearance-label">Avatar</span>
              <button className="appearance-button">
                Change avatar <ChevronRight className="chevron-icon" />
              </button>
            </div>
  
            <div className="appearance-row">
              <span className="appearance-label">Banner image</span>
              <button className="appearance-button">
                Change banner <ChevronRight className="chevron-icon" />
              </button>
            </div>
          </div>
        </section>
  
        {/* --- SOCIAL LINKS --- */}
        <section className="settings-section">
          <h2 className="settings-section-title">Social Links</h2>
  
          <SettingItem
            label="Website"
            value={settings.website}
            onClick={() => openSocialModal("website")}
          />
  
          <SettingItem
            label="Twitter"
            value={settings.twitter}
            onClick={() => openSocialModal("twitter")}
          />
  
          <SettingItem
            label="Instagram"
            value={settings.instagram}
            onClick={() => openSocialModal("instagram")}
          />
        </section>
  
        {/* --- CONTENT VISIBILITY --- */}
        <section className="settings-section">
          <h2 className="settings-section-title">Content Visibility</h2>
  
          <div className="two-factor-container">
            <div className="two-factor-content">
              <h3 className="two-factor-title">NSFW content</h3>
  
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.nsfw}
                  onChange={(e) =>
                    setSettings({ ...settings, nsfw: e.target.checked })
                  }
                  className="toggle-input"
                />
                <div className="toggle-slider"></div>
              </label>
            </div>
  
            <div className="two-factor-content">
              <h3 className="two-factor-title">Allow people to follow you</h3>
  
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.followAllowed}
                  onChange={(e) =>
                    setSettings({ ...settings, followAllowed: e.target.checked })
                  }
                  className="toggle-input"
                />
                <div className="toggle-slider"></div>
              </label>
            </div>
          </div>
        </section>
      </>
    );
  };
  // Privacy Tab
  export const PrivacyTab = ({ privacy, setPrivacy }) => {
    const toggle = (field) =>
      setPrivacy({ ...privacy, [field]: !privacy[field] });
  
    // For the sake of this example, we'll assume it toggles between 'Everyone' and 'Trusted'
    const toggleText = (field) => {
      const currentValue = privacy[field];
      const newValue = currentValue === 'everyone' ? 'trusted' : 'everyone';
      setPrivacy({ ...privacy, [field]: newValue });
    };
  
    return (
      <div className="tab-content">
        <h2 className="settings-section-title">Social interactions</h2>
  
        {/* --- Allow people to follow you --- */}
        <div className="two-factor-container">
          <div className="two-factor-content">
            <h3 className="two-factor-title">Allow people to follow you</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacy.allowFollow}
                onChange={() => toggle("allowFollow")}
                className="toggle-input"
              />
              <div className="toggle-slider"></div>
            </label>
          </div>
          <p className="setting-description">
            Let people follow you to see your profile posts in their home feed
          </p>
  
          {/* --- Who can send you chat requests (Dropdown/Text-link style) --- */}
          <div className="two-factor-content selectable-setting">
            <h3 className="two-factor-title">Who can send you chat requests</h3>
            <div 
              className="setting-value" 
              onClick={() => toggleText("whoCanChat")} 
            >
              {/* Capitalize first letter for display */}
              {privacy.whoCanChat.charAt(0).toUpperCase() + privacy.whoCanChat.slice(1)} 
              <span className="arrow-right"> &gt; </span>
            </div>
          </div>
  
          {/* --- Blocked accounts (Navigation link style) --- */}
          <div className="two-factor-content selectable-setting">
            <h3 className="two-factor-title">Blocked accounts</h3>
            <a href="#" className="setting-value">
              <span className="arrow-right"> &gt; </span>
            </a>
          </div>
        </div>
  
        <hr className="setting-separator" /> 
        
        {/* -------- DISCOVERABILITY -------- */}
        <h2 className="settings-section-title">Discoverability</h2>
  
        <div className="two-factor-container">
          {/* --- List your profile on old.reddit.com/users --- */}
          <div className="two-factor-content">
            <h3 className="two-factor-title">List your profile on old.reddit.com/users</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacy.listOnOldReddit}
                onChange={() => toggle("listOnOldReddit")}
                className="toggle-input"
              />
              <div className="toggle-slider"></div>
            </label>
          </div>
          <p className="setting-description">
            List your profile on old.reddit.com/users and allow posts to your profile to appear in r/all
          </p>
  
          {/* --- Show up in search results --- */}
          <div className="two-factor-content">
            <h3 className="two-factor-title">Show up in search results</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacy.showInSearchResults}
                onChange={() => toggle("showInSearchResults")}
                className="toggle-input"
              />
              <div className="toggle-slider"></div>
            </label>
          </div>
          <p className="setting-description">
            Allow search engines like Google to link to your profile in their search results
          </p>
        </div>
  
        <hr className="setting-separator" />
  
        {/* -------- ADS PERSONALIZATION -------- */}
        <h2 className="settings-section-title">Ads personalization</h2>
  
        <div className="two-factor-container">
          {/* --- Personalize ads on Reddit based on information and activity from our partners --- */}
          <div className="two-factor-content">
            <h3 className="two-factor-title">Personalize ads on Reddit based on information and activity from our partners</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacy.personalizeAds}
                onChange={() => toggle("personalizeAds")}
                className="toggle-input"
              />
              <div className="toggle-slider"></div>
            </label>
          </div>
          <p className="setting-description">
            Allow us to use information from our partners to show you better ads on Reddit
          </p>
        </div>
  
        <hr className="setting-separator" />
  
        {/* -------- ADVANCED -------- */}
        <h2 className="settings-section-title">Advanced</h2>
  

            <div className="two-factor-container">
                {/* --- Third-party app authorizations (Navigation link style) --- */}
                {/* The entire row is now the anchor tag (a) */}
                <a
                  href="https://www.reddit.com/prefs/https://www.reddit.com/prefs/apps?solution=f6b696d60dd2fc8af6b696d60dd2fc8a&js_challenge=1&token=98b9ac52742346eb4260fb24415992d80d39dba629927d979983112e2ca7dfad?solution=f6b696d60dd2fc8af6b696d60dd2fc8a&js_challenge=1&token=98b9ac52742346eb4260fb24415992d80d39dba629927d979983112e2ca7dfad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="two-factor-content selectable-setting" // Reuse the styling classes
                  style={{ textDecoration: 'none', color: 'inherit' }} // Important: prevents default link styling on text
                >
                    <h3 className="two-factor-title">Third-party app authorizations</h3>
                    
                    {/* The external link icon remains as the right-side indicator */}
                    <span className="setting-value external-link">
                        <span role="img" aria-label="external link"> ↗ </span>
                    </span>
                </a>

                {/* --- Clear history (Action button style) --- */}
                <div className="two-factor-content selectable-setting">
                    <h3 className="two-factor-title">Clear history</h3>
                    <button className="clear-button" onClick={() => console.log('Clearing history...')}>
                        Clear
                    </button>
                </div>
                <p className="setting-description">
                    Delete your post views history
                </p>
            </div>
      </div>
    );
  };
  // Preferences Tab
  export const PreferencesTab = ({ prefs, setPrefs }) => {
    const toggle = (field) =>
      setPrefs({ ...prefs, [field]: !prefs[field] });
  
    // Reusable component for navigation/text links
    const NavigationSetting = ({ title, value, onClick }) => (
      <div className="two-factor-content selectable-setting" onClick={onClick}>
        <h3 className="two-factor-title">{title}</h3>
        <div className="setting-value">
          {value}
          <span className="arrow-right"> &gt; </span>
        </div>
      </div>
    );
  
    // Reusable component for a toggle setting
    const ToggleSetting = ({ title, description, fieldName }) => (
      <>
        <div className="two-factor-content">
          <h3 className="two-factor-title">{title}</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={prefs[fieldName]}
              onChange={() => toggle(fieldName)}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>
        {description && <p className="setting-description">{description}</p>}
      </>
    );
  
    return (
      <div className="tab-content">
        <h2 className="settings-section-title">Preferences</h2>
  
        {/* -------------------- LANGUAGE -------------------- */}
        <h3 className="settings-section-sub">Language</h3>
        <div className="two-factor-container">
          
          {/* Display language */}
          <NavigationSetting 
            title="Display language" 
            value={prefs.displayLanguage} 
            onClick={() => console.log('Open Display Language Modal')} 
          />
          
          {/* Content languages */}
          <NavigationSetting 
            title="Content languages" 
            value="" 
            onClick={() => console.log('Open Content Languages Modal')} 
          />
        </div>
  
        <hr className="setting-separator" />
  
        {/* -------------------- CONTENT -------------------- */}
        <h3 className="settings-section-sub">Content</h3>
        <div className="two-factor-container">
  
          {/* Show mature content (I'm over 18) */}
          <ToggleSetting 
            title="Show mature content (I'm over 18)" 
            description="See Not Safe for Work mature and adult content in your feeds and search results"
            fieldName="showMatureContent"
          />
  
          {/* Blur mature (18+) images and media */}
          <ToggleSetting 
            title="Blur mature (18+) images and media" 
            description={null} /* No separate description text shown */
            fieldName="blurMatureMedia"
          />
  
          {/* Show recommendations in home feed */}
          <ToggleSetting 
            title="Show recommendations in home feed" 
            description={null}
            fieldName="showRecommendations"
          />
          
          {/* Muted communities */}
          <NavigationSetting 
            title="Muted communities" 
            value="" 
            onClick={() => console.log('Open Muted Communities Page')} 
          />
  
        </div>
        
        <hr className="setting-separator" />
  
        {/* -------------------- ACCESSIBILITY -------------------- */}
        <h3 className="settings-section-sub">Accessibility</h3>
        <div className="two-factor-container">
  
          {/* Autoplay media (Renamed) */}
          <ToggleSetting 
            title="Autoplay media" 
            description={null}
            fieldName="autoplayMedia"
          />
          
          {/* Reduce Motion */}
          <ToggleSetting 
            title="Reduce Motion" 
            description={null}
            fieldName="reduceMotion"
          />
  
          {/* Sync with computer's motion settings */}
          <ToggleSetting 
            title="Sync with computer's motion settings" 
            description={null}
            fieldName="syncMotionSettings"
          />
  
        </div>
  
        <hr className="setting-separator" />
  
        {/* -------------------- EXPERIENCE (Part 1 - Toggles) -------------------- */}
        <h3 className="settings-section-sub">Experience</h3>
        <div className="two-factor-container">
  
          {/* Use community themes */}
          <ToggleSetting 
            title="Use community themes" 
            description={null}
            fieldName="useCommunityThemes"
          />
  
          {/* Open posts in new tab */}
          <ToggleSetting 
            title="Open posts in new tab" 
            description={null}
            fieldName="openPostsInNewTab"
          />
        </div>
  
        {/* --- Second Screenshot Settings (Default view, editors, old reddit) --- */}
        <div className="two-factor-container">
  
          {/* Default feed view */}
          <NavigationSetting 
            title="Default feed view" 
            value={prefs.defaultFeedView} 
            onClick={() => console.log('Open Default Feed View Selector')} 
          />
          
          {/* Default to markdown editor */}
          <ToggleSetting 
            title="Default to markdown editor" 
            description={null}
            fieldName="defaultToMarkdown"
          />
  
          {/* Keyboard shortcuts */}
          <NavigationSetting 
            title="Keyboard shortcuts" 
            value="" 
            onClick={() => console.log('Open Keyboard Shortcuts Info')} 
          />
  
          {/* Default to Old Reddit */}
          <ToggleSetting 
            title="Default to Old Reddit" 
            description={null}
            fieldName="defaultToOldReddit"
          />
        </div>
  
        <hr className="setting-separator" />
  
        <h3 className="settings-section-sub">Sensitive advertising categories</h3>
        <div className="two-factor-container">
          <NavigationSetting 
            title="Limit ads in selected categories" 
            value="" 
            onClick={() => console.log('Open Sensitive Ads Category Selector')} 
          />
        </div>
  
      </div>
    );
  };
  // Notifications Tab
export const NotificationsTab = () => {
  const sections = {
    General: [
      "COmmunity Notifications",
      "Web Push Notifications",
    ],
    Messages: [
      "Chat Messages",
      "Chat Requests",
      "Mark All As Read",
    ],
    Activity: [
      "Mentions of u/username",
      "Comments on your posts",
      "Upvotes on your posts",
      "Upvotes on your comments",
      "Replies to your comments",
      "Activity on your comments",
      "New Followers",
      "Awards You Receive",
      "Posts You Follow",
      "Comments You Follow",
      "Keyword Alerts",
    ],
    Recommendations: [
      "Trending Posts",
      "ReReddit",
      "Featured Content",
      "Breaking News",
    ],
    Updates: [
      "Reddit aAnnouncements",
      "Cake DAy",
      "Admin Notifications",
    ],
    Moderation: ["Mod Notifications"],
  };

  const initial = Object.fromEntries(
    Object.values(sections).flat().map((label) => [label, "all"])
  );

  const [state, setState] = useState(initial);
  const [modalFor, setModalFor] = useState(null);

  const cycleStatus = (label) => {
    setState((p) => {
      const next =
        p[label] === "all"
          ? "inbox"
          : p[label] === "inbox"
          ? "off"
          : "all";
      return { ...p, [label]: next };
    });
  };

  const pickStatus = (label, value) => {
    setState((p) => ({ ...p, [label]: value }));
    setModalFor(null);
  };

  const enableAll = () =>
    setState(Object.fromEntries(Object.keys(state).map((k) => [k, "all"])));

  const disableAll = () =>
    setState(Object.fromEntries(Object.keys(state).map((k) => [k, "off"])));

  const labelFor = (val) =>
    val === "all"
      ? "All on"
      : val === "inbox"
      ? "Inbox"
      : "All off";

  return (
    <div className="notifications-tab">
      <h1 className="settings-section-title">Notifications</h1>

      <div className="notif-top-controls">
        <button className="notif-top-btn" onClick={enableAll}>
          Enable All
        </button>
        <button className="notif-top-btn ghost" onClick={disableAll}>
          Disable All
        </button>
      </div>

      <div className="notif-sections">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className="notif-section">
            <h3 className="notif-section-title">{section}</h3>

            <div className="notif-section-container">
              <div className="notif-rows">

                {items.map((label) => {
                  
                  // --------------------------
                  // WEB PUSH → TOGGLE
                  // --------------------------
                  if (label === "Web Push Notifications") {
                    return (
                      <div key={label} className="notif-row">
                        <div className="notif-left">
                          <span className="notif-label">{label}</span>
                        </div>

                        <div className="notif-right">
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={state[label] === "all"}
                              onChange={() =>
                                pickStatus(
                                  label,
                                  state[label] === "all" ? "off" : "all"
                                )
                              }
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    );
                  }

                  // --------------------------
                  // MARK ALL AS READ → BUTTON + ALERT
                  // --------------------------
                  if (label === "Mark All As Read") {
                    return (
                      <div key={label} className="notif-row">
                        <div className="notif-left">
                          <span className="notif-label">{label}</span>
                        </div>

                        <div className="notif-right">
                          <button
                            className="notif-button"
                            onClick={() =>
                              alert("All notifications marked as read!")
                            }
                          >
                            Mark as Read
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // --------------------------
                  // DEFAULT REDDIT ROW
                  // --------------------------
                  return (
                    <div key={label} className="notif-row">
                      <div className="notif-left">
                        <span className="notif-label">{label}</span>
                      </div>

                      <div className="notif-right">
                        <button
                          className="notif-status-text"
                          onClick={() => cycleStatus(label)}
                        >
                          {labelFor(state[label])}
                        </button>

                        <button
                          className="notif-chevron"
                          onClick={() => setModalFor(label)}
                        >
                          <span className="chev-symbol">›</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        ))}
      </div>

      {modalFor && (
        <div
          className="notif-modal-overlay"
          onClick={() => setModalFor(null)}
        >
          <div
            className="notif-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notif-modal-header">
              <h4>Notifications for</h4>
              <div className="notif-modal-title">{modalFor}</div>
              <button
                className="notif-modal-close"
                onClick={() => setModalFor(null)}
              >
                ✕
              </button>
            </div>

            <div className="notif-modal-body">
              <button
                className={`notif-modal-option ${
                  state[modalFor] === "all" ? "selected" : ""
                }`}
                onClick={() => pickStatus(modalFor, "all")}
              >
                <div className="opt-left">All on</div>
                <div className="opt-sub">
                  Get notifications to your device and Reddit inbox
                </div>
                <div className="opt-check">
                  {state[modalFor] === "all" ? "✓" : ""}
                </div>
              </button>

              <button
                className={`notif-modal-option ${
                  state[modalFor] === "inbox" ? "selected" : ""
                }`}
                onClick={() => pickStatus(modalFor, "inbox")}
              >
                <div className="opt-left">Inbox</div>
                <div className="opt-sub">
                  Only get notifications to your Reddit inbox
                </div>
                <div className="opt-check">
                  {state[modalFor] === "inbox" ? "✓" : ""}
                </div>
              </button>

              <button
                className={`notif-modal-option ${
                  state[modalFor] === "off" ? "selected" : ""
                }`}
                onClick={() => pickStatus(modalFor, "off")}
              >
                <div className="opt-left">All off</div>
                <div className="opt-sub">
                  Don't receive any notifications about this
                </div>
                <div className="opt-check">
                  {state[modalFor] === "off" ? "✓" : ""}
                </div>
              </button>
            </div>

            <div className="notif-modal-actions">
              <button
                className="notif-modal-cancel"
                onClick={() => setModalFor(null)}
              >
                Cancel
              </button>
              <button
                className="notif-modal-save"
                onClick={() => setModalFor(null)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
/*   prev = the previous state object
  ...prev = copy everything inside it */

 // E-Mail Tabb
 export const EmailTab = () => {
  const [emailSettings, setEmailSettings] = useState({
    // Messages
    adminNotifications: true,
    chatRequests: true,

    // Activity
    newUserWelcome: true,
    commentsOnPosts: true,
    repliesToComments: true,
    upvotesOnPosts: true,
    upvotesOnComments: true,
    usernameMentions: true,
    newFollowers: true,

    // Newsletters
    dailyDigest: true,
    weeklyRecap: true,
    weeklyTopic: true,

    // Advanced
    unsubscribeAll: false,
  });

  const toggle = (field) => {
    setEmailSettings({ ...emailSettings, [field]: !emailSettings[field] });
  };

  return (
    <div className="tab-content">
      <h2 className="settings-section-title">Email Settings</h2>

      {/* ---------------- MESSAGES ---------------- */}
      <h3 className="settings-section-sub">Messages</h3>

      <div className="two-factor-container">
        <div className="two-factor-content">
          <h3 className="two-factor-title">Admin notifications</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.adminNotifications}
              onChange={() => toggle("adminNotifications")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">Chat requests</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.chatRequests}
              onChange={() => toggle("chatRequests")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>
      </div>

      {/* ---------------- ACTIVITY ---------------- */}
      <h3 className="settings-section-sub">Activity</h3>

      <div className="two-factor-container">
        <div className="two-factor-content">
          <h3 className="two-factor-title">New user welcome</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.newUserWelcome}
              onChange={() => toggle("newUserWelcome")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">Comments on your posts</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.commentsOnPosts}
              onChange={() => toggle("commentsOnPosts")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">Replies to your comments</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.repliesToComments}
              onChange={() => toggle("repliesToComments")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">Upvotes on your posts</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.upvotesOnPosts}
              onChange={() => toggle("upvotesOnPosts")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">Upvotes on your comments</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.upvotesOnComments}
              onChange={() => toggle("upvotesOnComments")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">Username mentions</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.usernameMentions}
              onChange={() => toggle("usernameMentions")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">New followers</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.newFollowers}
              onChange={() => toggle("newFollowers")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>
      </div>

      {/* ---------------- NEWSLETTERS ---------------- */}
      <h3 className="settings-section-sub">Newsletters</h3>

      <div className="two-factor-container">
        <div className="two-factor-content">
          <h3 className="two-factor-title">Daily Digest</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.dailyDigest}
              onChange={() => toggle("dailyDigest")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">Weekly Recap</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.weeklyRecap}
              onChange={() => toggle("weeklyRecap")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>

        <div className="two-factor-content">
          <h3 className="two-factor-title">Weekly Topic</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.weeklyTopic}
              onChange={() => toggle("weeklyTopic")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>
      </div>

      {/* ---------------- ADVANCED ---------------- */}
      <h3 className="settings-section-sub">Advanced</h3>

      <div className="two-factor-container">
        <div className="two-factor-content">
          <h3 className="two-factor-title">Unsubscribe from all emails</h3>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailSettings.unsubscribeAll}
              onChange={() => toggle("unsubscribeAll")}
              className="toggle-input"
            />
            <div className="toggle-slider"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
