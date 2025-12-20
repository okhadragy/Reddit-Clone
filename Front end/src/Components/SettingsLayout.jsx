import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenderModal, EmailModal, LocationModal, AboutModal, DisplayNameModal, SocialLinksModal,  DeleteAccountModal} from "./Modal";
import { AccountTab, ProfileTab, EmailTab, PrivacyTab, PreferencesTab, NotificationsTab } from "./Tabs";
import '../Styles/SettingsLayout.css';
import api from '../api/api.js';
import { useAuth } from './LoginContext.jsx';

const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user"));
  const [settings, setSettings] = useState({
    //Account
    email: user.email,
    gender: 'Male',
    genderCategory: 'USER_DEFINED',
    location: 'Use approximate location (based on IP)',
    customLocation: '',
    googleConnected: true,
    appleConnected: false,
    twoFactorEnabled: false,

    //Profile
    displayName: "User",
    about: "Hitler",
    category: "Hitler",
    website: "Hitler.com",
    twitter: "Hitler.com",
    instagram: "Hitler.com",
    nsfw: false,
    followAllowed: true
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    // Social interactions
    allowFollow: true,
    whoCanChat: 'everyone', // or 'everyone'

    // Discoverability
    listOnOldReddit: true,
    showInSearchResults: true, // Renamed from allowExternalVisibility

    // Ads personalization
    personalizeAds: true,

    // Your original fields (not visible in this part of the screenshot but retained)
    showActive: true,
    nsfw: false,
    blurNSFW: true,
    allowPM: true,
  });

  // Prefrences
  const [prefs, setPrefs] = useState({
    // Language
    displayLanguage: 'English (US)',

    // Content
    showMatureContent: true,
    blurMatureMedia: true,
    showRecommendations: true,

    // Accessibility
    autoplayMedia: true,
    reduceMotion: false,
    syncMotionSettings: true,

    // Experience
    useCommunityThemes: true,
    openPostsInNewTab: true,
    defaultFeedView: 'Card',
    defaultToMarkdown: false,
    defaultToOldReddit: false,
  });


  // Account
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [tempGender, setTempGender] = useState('');
  const [genderCategory, setGenderCategory] = useState('USER_DEFINED');
  const [tempEmail, setTempEmail] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [locationOption, setLocationOption] = useState('auto');

  // Profile
  const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempAbout, setTempAbout] = useState('');
  const [tempLinks, setTempLinks] = useState({
    website: '',
    twitter: '',
    instagram: ''
  });

  const [emailError, setEmailError] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const updateUser = async () => {
    try {
      setEmailLoading(true);
      setEmailError('');

      const res = await api.patch(`/users/${user.name}`, {
        email: tempEmail
      });

      if (res.data.status === "success") {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, email: tempEmail })
        );
        return true;
      }

      setEmailError(res.data.message || "Failed to update email");
      return false;

    } catch (err) {
      setEmailError(
        err.response?.data?.message || "Invalid or already used email"
      );
      return false;
    } finally {
      setEmailLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      setDeleteLoading(true);
      const res = await api.delete(`/users/${user.name}`);
      if (res.data.status === "success") {
        logout();
        navigate('/Login');
      }
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  const handleGenderSave = () => {
    setSettings({
      ...settings,
      gender: tempGender,
      genderCategory: genderCategory
    });
    setShowGenderModal(false);
  };

  const handleEmailSave = async () => {
    if (!tempEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!isValidEmail(tempEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const success = await updateUser();

    if (success) {
      setSettings({
        ...settings,
        email: tempEmail
      });
      setShowEmailModal(false);
    }
  };


  const handleLocationSave = () => {
    setSettings({
      ...settings,
      location: locationOption === 'auto'
        ? 'Use approximate location (based on IP)'
        : tempLocation,
      customLocation: tempLocation
    });
    setShowLocationModal(false);
  };


  const handleDisplayNameSave = () => {
    setSettings({ ...settings, displayName: tempDisplayName });
    setShowDisplayNameModal(false);
  };

  const handleAboutSave = () => {
    setSettings({ ...settings, about: tempAbout });
    setShowAboutModal(false);
  };

  const handleSocialSave = () => {
    setSettings({
      ...settings,
      website: tempLinks.website,
      twitter: tempLinks.twitter,
      instagram: tempLinks.instagram
    });
    setShowSocialModal(false);
  };


  const tabs = ['Account', 'Profile', 'Privacy', 'Preferences', 'Notifications', 'Email'];

  return (
    <div className="settings-container">
      <header className="settings-header">
        <div className="settings-header-content">
          <h1 className="settingsLayout-title">Settings</h1>

          <div className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`settings-tab ${activeTab === tab ? 'settings-tab-active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="settings-main">
        {activeTab === 'Account' && (
          <AccountTab
            settings={settings}
            setSettings={setSettings}
            onOpenEmailModal={() => {
              setTempEmail(settings.email);
              setShowEmailModal(true);
            }}
            onOpenGenderModal={() => {
              setTempGender(settings.gender);
              setGenderCategory(settings.genderCategory);
              setShowGenderModal(true);
            }}
            onOpenLocationModal={() => {
              setTempLocation(settings.customLocation);
              setLocationOption(settings.location === 'Use approximate location (based on IP)' ? 'auto' : 'custom');
              setShowLocationModal(true);
            }}
            openDeleteModal={() => setShowDeleteModal(true)}
          />
        )}

        {activeTab === 'Profile' && (
          <ProfileTab
            settings={settings}
            setSettings={setSettings}

            openDisplayNameModal={() => {
              setTempDisplayName(settings.displayName);
              setShowDisplayNameModal(true);
            }}

            openAboutModal={() => {
              setTempAbout(settings.about);
              setShowAboutModal(true);
            }}

            openSocialModal={() => {
              setTempLinks({
                website: settings.website,
                twitter: settings.twitter,
                instagram: settings.instagram
              });
              setShowSocialModal(true);
            }}
          />
        )}



        {activeTab === 'Privacy' && (
          <PrivacyTab
            privacy={privacy}
            setPrivacy={setPrivacy}
          />
        )}

        {activeTab === 'Preferences' && (
          <PreferencesTab
            prefs={prefs}
            setPrefs={setPrefs}
          />
        )}

        {activeTab === 'Notifications' && <NotificationsTab />}
        {activeTab === 'Email' && <EmailTab />}
      </main>

      <EmailModal
        show={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setEmailError('');
        }}
        tempEmail={tempEmail}
        setTempEmail={(val) => {
          setTempEmail(val);
          setEmailError('');
        }}
        onSave={handleEmailSave}
        error={emailError}
        loading={emailLoading}
      />

      <GenderModal
        show={showGenderModal}
        onClose={() => setShowGenderModal(false)}
        tempGender={tempGender}
        setTempGender={setTempGender}
        genderCategory={genderCategory}
        setGenderCategory={setGenderCategory}
        onSave={handleGenderSave}
      />

      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        tempLocation={tempLocation}
        setTempLocation={setTempLocation}
        locationOption={locationOption}
        setLocationOption={setLocationOption}
        onSave={handleLocationSave}
      />

      <DisplayNameModal
        show={showDisplayNameModal}
        onClose={() => setShowDisplayNameModal(false)}
        tempDisplayName={tempDisplayName}
        setTempDisplayName={setTempDisplayName}
        onSave={handleDisplayNameSave}
      />

      <AboutModal
        show={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        tempAbout={tempAbout}
        setTempAbout={setTempAbout}
        onSave={handleAboutSave}
      />

      <SocialLinksModal
        show={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        tempLinks={tempLinks}
        setTempLinks={setTempLinks}
        onSave={handleSocialSave}
      />

      <DeleteAccountModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deleteUser();
          setShowDeleteModal(false);
        }}
        loading={deleteLoading}
      />

    </div>
  );
};

export default SettingsLayout;