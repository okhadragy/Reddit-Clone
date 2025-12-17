import React from 'react';
import { ChevronRight } from 'lucide-react';

const SettingItem = ({ label, value, onClick }) => (
    <button onClick={onClick} className="setting-item">
      <span className="setting-label">{label}</span>
      <div className="setting-value-container">
        <span className="setting-value">{value}</span>
        <ChevronRight className="chevron-icon-small" />
      </div>
    </button>
);


export const AuthorizationItem = ({ label, description, connected, onToggle }) => (
  <div className="auth-item">
    <div>
      <h3 className="auth-label">{label}</h3>
      <p className="auth-description">{description}</p>
    </div>
    <button onClick={onToggle} className={`auth-button ${connected ? 'auth-button-connected' : 'auth-button-disconnected'}`}>
      {connected ? 'Disconnect' : 'Connect'}
    </button>
  </div>
);




export default SettingItem;



