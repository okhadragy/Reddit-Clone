import React, { useState, useCallback, useMemo } from 'react';
import LeftPanel from './LeftPanel';
import ChatPanel from './ChatPanel';
import '../Styles/ChatPage.css';


const MOCK_USER_ID = 'currentUser';

const INITIAL_CHATS = [
    { 
        id: 'chat_1', 
        name: 'Alice_Riddit', 
        partnerId: 'user_A',
        lastMessage: 'Sure, I can help with that.',
        messages: [
            { senderId: 'user_A', text: 'Hey, are you free for a call?', timestamp: Date.now() - 3600000 },
            { senderId: MOCK_USER_ID, text: 'I am. What time?', timestamp: Date.now() - 3500000 },
            { senderId: 'user_A', text: 'In 5 minutes works.', timestamp: Date.now() - 3400000 },
        ]
    },
    { 
        id: 'chat_2', 
        name: 'Bob_Dev', 
        partnerId: 'user_B',
        lastMessage: 'Don\'t forget the meeting on Monday.',
        messages: [
            { senderId: 'user_B', text: 'Project status update is done.', timestamp: Date.now() - 86400000 },
            { senderId: MOCK_USER_ID, text: 'Got it, thanks.', timestamp: Date.now() - 85400000 },
        ]
    },
];



const ChatsPage = () => {
  const [chats, setChats] = useState(INITIAL_CHATS);
  // activeView: THREADS, NEW_CHAT, CONVERSATION
  const [activeView, setActiveView] = useState('THREADS'); 
  const [activeChatId, setActiveChatId] = useState(INITIAL_CHATS.length > 0 ? INITIAL_CHATS[0].id : null);

  // --- Handlers ---

  const handleNavigate = useCallback((view) => {
    setActiveView(view);
    // When navigating to THREADS or NEW_CHAT, we often deselect the conversation
    if (view !== 'CONVERSATION') {
        setActiveChatId(null);
    }
  }, []);
  
  const handleChatSelect = useCallback((chatId) => {
    setActiveChatId(chatId);
    setActiveView('CONVERSATION');
  }, []);

  const handleSendMessage = useCallback((chatId, text) => {
    const newMessage = {
      senderId: MOCK_USER_ID,
      text: text,
      timestamp: Date.now(),
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, newMessage], 
              lastMessage: text 
            }
          : chat
      ).sort((a, b) => {
        // Sort by the last message timestamp (mock data doesn't have it, so we sort by last message creation time)
        const aTime = a.messages.length > 0 ? a.messages[a.messages.length - 1].timestamp : 0;
        const bTime = b.messages.length > 0 ? b.messages[b.messages.length - 1].timestamp : 0;
        return bTime - aTime;
      })
    );
  }, []);

  const handleStartNewChat = useCallback((foundUser) => {
    const existingChat = chats.find(c => c.partnerId === foundUser.id);

    if (existingChat) {
        handleChatSelect(existingChat.id);
        return;
    }
    
    // Create new chat
    const newChat = {
        id: `chat_${Date.now()}`,
        name: foundUser.name,
        partnerId: foundUser.id,
        lastMessage: 'Chat started.',
        messages: [{ 
            senderId: MOCK_USER_ID, 
            text: `You started a chat with ${foundUser.name}.`,
            timestamp: Date.now(),
        }],
    };

    setChats(prevChats => [newChat, ...prevChats]);
    handleChatSelect(newChat.id); // Navigate to the new conversation
  }, [chats, handleChatSelect]);
  
  // Memoized value for the currently active chat object
  const activeChat = useMemo(() => 
      chats.find(c => c.id === activeChatId), 
  [chats, activeChatId]);

  return (
    <div className="chats-page-container">
      <LeftPanel 
        chats={chats}
        activeChatId={activeChatId}
        onNavigate={handleNavigate}
        onChatSelect={handleChatSelect}
      />
      <ChatPanel 
        activeView={activeView} 
        activeChat={activeChat}
        onStartNewChat={handleStartNewChat}
        onSendMessage={handleSendMessage}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default ChatsPage;