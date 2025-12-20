import React, { useState, useEffect, useRef } from 'react';
import '../Styles/ChatPage.css';

const MOCK_USER_ID = 'currentUser';

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MOCK_AVAILABLE_USERS = [
  { id: 'user_A', name: 'Alice_Riddit' },
  { id: 'user_B', name: 'Bob_Dev' },
  { id: 'user_C', name: 'Charlie_Coder' },
  { id: 'user_D', name: 'Messi' },
  { id: 'user_E', name: 'Ayham' },
  { id: 'user_F', name: 'Zeyad_Gowaily' },
];

const findUserByUsername = (username) => {
  return MOCK_AVAILABLE_USERS.find(user => user.name.toLowerCase() === username.toLowerCase());
};

// --- Message Sub-Component ---
const Message = ({ message }) => {
  const isMine = message.senderId === MOCK_USER_ID;
  return (
    <div className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
      <div className="message-bubble">
        {message.text}
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

// --- View: Conversation ---
const ConversationView = ({ activeChat, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(activeChat.id, inputText);
      setInputText('');
    }
  };

  return (
    <div className="chat-panel conversation-view">
      <div className="chat-panel-header">
        <h3>{activeChat.name}</h3>
        <div className="threads-controls">
          <button className="control-btn" title="Expand">⤢</button>
          <button className="control-btn" title="Minimize">_</button>
          <button className="control-btn" title="Close">X</button>
        </div>
      </div>

      <div className="message-list">
        {activeChat.messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message..."
        />
        <button type="submit" disabled={!inputText.trim()} className="send-button">Send</button>
      </form>
    </div>
  );
};

// --- View: New Chat ---
const NewChatView = ({ onStartNewChat, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [isUserFound, setIsUserFound] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  useEffect(() => {
    if (username.trim()) {
      const user = findUserByUsername(username);
      setFoundUser(user);
      setIsUserFound(!!user);
    } else {
      setIsUserFound(false);
      setFoundUser(null);
    }
  }, [username]);

  const handleStartChat = () => {
    if (foundUser) {
      onStartNewChat(foundUser);
    }
  };

  return (
    <div className="chat-panel new-chat-content">
      <div className="new-chat-page-header">
        <h2>New Chat</h2>
        <div className="threads-controls">
          <button className="control-btn" title="Expand">⤢</button>
          <button className="control-btn" title="Minimize">_</button>
          <button className="control-btn" title="Close">X</button>
        </div>
      </div>
      <div className="new-chat-form-area">
        <div className="username-input-container">
          <input
            type="text"
            placeholder="Type username(s) *"
            className="username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="search-info">Search for people by username to chat with them.</p>

          {username.trim() && (
            <div className="search-results-list">
              {isUserFound ? (
                <div className="user-found-item" onClick={() => setUsername(foundUser.name)}>
                  <span className="found-name">{foundUser.name}</span>
                  <span className="user-status">Click to Select</span>
                </div>
              ) : (
                <div className="user-not-found">No user found matching "{username}"</div>
              )}
            </div>
          )}
        </div>

        <div className="new-chat-footer">
          <button className="cancel-button" onClick={() => onNavigate('THREADS')}>Cancel</button>
          <button
            className="start-chat-button"
            onClick={handleStartChat}
            disabled={!isUserFound}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};

// --- View: Threads (Empty State) ---
const ThreadsView = ({ onNavigate }) => (
  <div className="chat-panel threads-content">
    <div className="threads-page-header">
      <h2>Threads</h2>
      <div className="threads-controls">
        <button className="control-btn" title="Expand">⤢</button>
        <button className="control-btn" title="Minimize">_</button>
        <button className="control-btn" title="Close">X</button>
      </div>
    </div>
    <div className="threads-empty-state">
      <h3>You don't have any threads yet</h3>
      <p>When you do, they'll show up here.</p>
      <button className="go-to-messages-button" onClick={() => onNavigate('NEW_CHAT')}>
        Go to messages
      </button>
    </div>
  </div>
);


// --- Main ChatPanel Component ---
const ChatPanel = ({ activeView, activeChat, onStartNewChat, onSendMessage, onNavigate }) => {
  let ContentComponent;

  switch (activeView) {
    case 'NEW_CHAT':
      ContentComponent = <NewChatView onStartNewChat={onStartNewChat} onNavigate={onNavigate} />;
      break;
    case 'CONVERSATION':
      if (activeChat) {
        ContentComponent = <ConversationView activeChat={activeChat} onSendMessage={onSendMessage} />;
      } else {
        ContentComponent = <ThreadsView onNavigate={onNavigate} />;
      }
      break;
    case 'THREADS':
    default:
      ContentComponent = <ThreadsView onNavigate={onNavigate} />;
  }

  return (
    <div className="chat-panel-wrapper">
      {ContentComponent}
    </div>
  );
};

export default ChatPanel;