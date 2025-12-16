import React from 'react';

const Modal = ({ title, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-inner">
          <h2 className="modal-title">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

/* ==========================
   ACCOUNT MODALS
========================== */

// Email Modal
export const EmailModal = ({ show, onClose, tempEmail, setTempEmail, onSave }) => {
  if (!show) return null;

  return (
    <Modal title="Change email address">
      <div className="modal-field">
        <label className="modal-label">Email address</label>
        <input
          type="email"
          value={tempEmail}
          onChange={(e) => setTempEmail(e.target.value)}
          placeholder="Enter your email"
          className="modal-input"
        />
      </div>

      <div className="modal-actions">
        <button className="modal-button modal-button-cancel" onClick={onClose}>Cancel</button>
        <button className="modal-button modal-button-save" onClick={onSave}>Save</button>
      </div>
    </Modal>
  );
};

// Gender Modal
export const GenderModal = ({ show, onClose, tempGender, setTempGender, genderCategory, setGenderCategory, onSave }) => {
  if (!show) return null;

  return (
    <Modal title="Gender">
      <div className="modal-options">

        <label className="modal-radio-option">
          <input
            type="radio"
            name="genderCategory"
            value="WOMAN"
            checked={genderCategory === 'WOMAN'}
            onChange={(e) => {
              setGenderCategory(e.target.value);
              setTempGender('Woman');
            }}
            className="modal-radio"
          />
          <span className="modal-radio-label">Woman</span>
        </label>

        <label className="modal-radio-option">
          <input
            type="radio"
            name="genderCategory"
            value="MAN"
            checked={genderCategory === 'MAN'}
            onChange={(e) => {
              setGenderCategory(e.target.value);
              setTempGender('Man');
            }}
            className="modal-radio"
          />
          <span className="modal-radio-label">Man</span>
        </label>

        <label className="modal-radio-option">
          <input
            type="radio"
            name="genderCategory"
            value="NON_BINARY"
            checked={genderCategory === 'NON_BINARY'}
            onChange={(e) => {
              setGenderCategory(e.target.value);
              setTempGender('Non-binary');
            }}
            className="modal-radio"
          />
          <span className="modal-radio-label">Non-binary</span>
        </label>

        <label className="modal-radio-option">
          <input
            type="radio"
            name="genderCategory"
            value="USER_DEFINED"
            checked={genderCategory === 'USER_DEFINED'}
            onChange={(e) => setGenderCategory(e.target.value)}
            className="modal-radio"
          />
          <span className="modal-radio-label">I use a different term</span>
        </label>

        {genderCategory === 'USER_DEFINED' && (
          <input
            type="text"
            value={tempGender}
            onChange={(e) => setTempGender(e.target.value)}
            placeholder="Enter your gender"
            className="modal-input modal-input-custom"
          />
        )}

        <label className="modal-radio-option">
          <input
            type="radio"
            name="genderCategory"
            value="PREFER_NOT_TO_SAY"
            checked={genderCategory === 'PREFER_NOT_TO_SAY'}
            onChange={(e) => {
              setGenderCategory(e.target.value);
              setTempGender('Prefer not to say');
            }}
            className="modal-radio"
          />
          <span className="modal-radio-label">I prefer not to say</span>
        </label>
      </div>

      <div className="modal-actions">
        <button className="modal-button modal-button-cancel" onClick={onClose}>Cancel</button>
        <button className="modal-button modal-button-save" onClick={onSave}>Save</button>
      </div>
    </Modal>
  );
};

// Location Modal
export const LocationModal = ({ show, onClose, tempLocation, setTempLocation, locationOption, setLocationOption, onSave }) => {
  if (!show) return null;

  return (
    <Modal title="Location customization">
      <div className="modal-options">

        <label className="modal-radio-option">
          <input
            type="radio"
            name="locationOption"
            value="auto"
            checked={locationOption === 'auto'}
            onChange={(e) => setLocationOption(e.target.value)}
            className="modal-radio"
          />
          <span className="modal-radio-label">Use approximate location (based on IP)</span>
        </label>

        <label className="modal-radio-option">
          <input
            type="radio"
            name="locationOption"
            value="custom"
            checked={locationOption === 'custom'}
            onChange={(e) => setLocationOption(e.target.value)}
            className="modal-radio"
          />
          <span className="modal-radio-label">Custom location</span>
        </label>

        {locationOption === 'custom' && (
          <input
            type="text"
            value={tempLocation}
            onChange={(e) => setTempLocation(e.target.value)}
            placeholder="Enter your location"
            className="modal-input modal-input-custom"
          />
        )}
      </div>

      <div className="modal-actions">
        <button className="modal-button modal-button-cancel" onClick={onClose}>Cancel</button>
        <button className="modal-button modal-button-save" onClick={onSave}>Save</button>
      </div>
    </Modal>
  );
};



/* ==========================
   PROFILE MODALS (FIXED)
========================== */

export const DisplayNameModal = ({ show, onClose, tempDisplayName, setTempDisplayName, onSave }) => {
  if (!show) return null;

  return (
    <Modal title="Edit display name">
      <input
        type="text"
        className="modal-input"
        value={tempDisplayName}
        onChange={(e) => setTempDisplayName(e.target.value)}
        placeholder="Enter display name"
      />

      <div className="modal-actions">
        <button className="modal-button modal-button-cancel" onClick={onClose}>Cancel</button>
        <button className="modal-button modal-button-save" onClick={onSave}>Save</button>
      </div>
    </Modal>
  );
};

export const AboutModal = ({ show, onClose, tempAbout, setTempAbout, onSave }) => {
  if (!show) return null;

  return (
    <Modal title="Edit bio">
      <textarea
        className="about-textarea"
        value={tempAbout}
        onChange={(e) => setTempAbout(e.target.value)}
        placeholder="Write something about yourself..."
      />

      <div className="modal-actions">
        <button className="modal-button modal-button-cancel" onClick={onClose}>Cancel</button>
        <button className="modal-button modal-button-save" onClick={onSave}>Save</button>
      </div>
    </Modal>
  );
};

export const SocialLinksModal = ({ show, onClose, tempLinks, setTempLinks, onSave }) => {
  if (!show) return null;

  return (
    <Modal title="Edit social links">
      <label className="modal-label">Website</label>
      <input
        type="text"
        className="modal-input"
        value={tempLinks.website}
        onChange={(e) => setTempLinks({ ...tempLinks, website: e.target.value })}
      />

      <label className="modal-label">Twitter</label>
      <input
        type="text"
        className="modal-input"
        value={tempLinks.twitter}
        onChange={(e) => setTempLinks({ ...tempLinks, twitter: e.target.value })}
      />

      <label className="modal-label">Instagram</label>
      <input
        type="text"
        className="modal-input"
        value={tempLinks.instagram}
        onChange={(e) => setTempLinks({ ...tempLinks, instagram: e.target.value })}
      />

      <div className="modal-actions">
        <button className="modal-button modal-button-cancel" onClick={onClose}>Cancel</button>
        <button className="modal-button modal-button-save" onClick={onSave}>Save</button>
      </div>
    </Modal>
  );
};
