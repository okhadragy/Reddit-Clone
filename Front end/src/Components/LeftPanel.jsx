import React from 'react';
import '../Styles/ChatPage.css';

const ChatListItem = ({ chat, isActive, onSelect }) => (
  <div 
    className={`chat-list-item ${isActive ? 'active' : ''}`} 
    onClick={() => onSelect(chat.id)}
  >
    <div className="chat-avatar">{chat.name[0]}</div>
    <div className="chat-info">
      <div className="chat-name">{chat.name}</div>
      <div className="chat-last-message">{chat.lastMessage}</div>
    </div>
  </div>
);

const LeftPanel = ({ chats, activeChatId, onNavigate, onChatSelect }) => {
  return (
    <div className="left-panel">
      
      {/* Top Header/Controls */}
      <div className="left-panel-header">
        <div className="header-title-controls">
          <div className="reddit-logo">R</div> 
          <h2 className="chat-title">Chats</h2>
        </div>
        
        {/* Navigation Buttons */}
        <div className="chat-control-buttons">
          <button className="control-btn" title="Mark Read">✓</button>
          <button 
            className="control-btn new-chat-btn" 
            title="Start New Chat"
            onClick={() => onNavigate('NEW_CHAT')}
          >+</button>
          <button className="control-btn" title="Link Share">🔗</button>
          <button className="control-btn" title="Options">⌄</button>
        </div>
      </div>

      {/* Threads Navigation Button (always visible in this view) */}
      <div className="threads-link-container" onClick={() => onNavigate('THREADS')}>
        <span className="threads-back-arrow">←</span>
        <span>Threads</span>
        <span className="arrow">›</span> 
      </div>

      {/* Conversation List area */}
      <div className="conversation-list">
        {chats.length === 0 ? (
          <div className="empty-list-message">No active chats. Start a new one!</div>
        ) : (
          chats.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onSelect={onChatSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LeftPanel;