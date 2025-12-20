import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { useNavigate } from "react-router-dom";
import '../Styles/ChatPage.css';


const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- Message Sub-Component ---
const Message = ({ message, user }) => {
  const isMine = message.sender._id === user.id;
  return (
    <div className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
      <div className="message-bubble">
        {message.text}
        <span className="message-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

// --- View: Conversation ---
const ConversationView = ({ activeChat, onSendMessage, user, onNavigate }) => {
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
          <button className="control-btn" title="Close" onClick={() => onNavigate("HOME")}>X</button>
        </div>
      </div>

      <div className="message-list">
        {activeChat.messages.map((msg, index) => (
          <Message key={index} message={msg} user={user} />
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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  /* ---------------- SEARCH USERS ---------------- */
  const searchUsers = async (text) => {
    try {
      setLoading(true);
      const res = await api.get(`/users?search=${text}&limit=5`);

      if (res.data.status === "success") {
        setResults(res.data.data); // expect array of users
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchUsers(value.trim());
    }, 300);
  };

  return (
    <div className="chat-panel new-chat-content">
      <div className="new-chat-page-header">
        <h2>New Chat</h2>
        <div className="threads-controls">
          <button className="control-btn">⤢</button>
          <button className="control-btn">_</button>
          <button className="control-btn" onClick={() => onNavigate("HOME")}>X</button>
        </div>
      </div>

      <div className="new-chat-form-area">
        <div className="username-input-container">
          <input
            type="text"
            placeholder="Search username..."
            className="username-input"
            value={query}
            onChange={handleChange}
          />

          <p className="search-info">
            Search for people by username to chat with them.
          </p>

          {/* ---------------- RESULTS ---------------- */}
          {query.trim() && (
            <div className="search-results-list">
              {loading && <div className="user-not-found">Searching...</div>}

              {!loading && results.length === 0 && (
                <div className="user-not-found">
                  No users found for "{query}"
                </div>
              )}

              {results.map((user) => (
                <div
                  key={user._id}
                  className="user-found-item"
                  onClick={() => onStartNewChat(user)}
                >
                  <span className="found-name">{user.name}</span>
                  <span className="user-status">Start chat</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="new-chat-footer">
          <button
            className="cancel-button"
            onClick={() => onNavigate("THREADS")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- View: Threads (Empty State) ---
const ThreadsView = ({ onNavigate }) => {
  return (
  <div className="chat-panel threads-content">
    <div className="threads-page-header">
      <h2>Threads</h2>
      <div className="threads-controls">
        <button className="control-btn" title="Expand">⤢</button>
        <button className="control-btn" title="Minimize">_</button>
        <button className="control-btn" title="Close" onClick={() => onNavigate("HOME")}>X</button>
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
)};


// --- Main ChatPanel Component ---
const ChatPanel = ({ activeView, activeChat, onStartNewChat, onSendMessage, onNavigate, user }) => {
  let ContentComponent;
  

  switch (activeView) {
    case 'NEW_CHAT':
      ContentComponent = <NewChatView onStartNewChat={onStartNewChat} onNavigate={onNavigate} />;
      break;
    case 'CONVERSATION':
      if (activeChat) {
        ContentComponent = <ConversationView activeChat={activeChat} onSendMessage={onSendMessage} user={user} onNavigate={onNavigate} />;
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