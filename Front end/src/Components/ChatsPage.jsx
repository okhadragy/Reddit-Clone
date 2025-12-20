import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftPanel from "./LeftPanel";
import ChatPanel from "./ChatPanel";
import api from "../api/api";
import { socket } from "../hooks/userSocket";
import "../Styles/ChatPage.css";

const ChatsPage = ({ user }) => {
  const [chats, setChats] = useState([]);
  const [activeView, setActiveView] = useState("THREADS");
  const [activeChatId, setActiveChatId] = useState(null);
  const navigate = useNavigate();

  /* ---------------- LOAD USER CHATS ---------------- */
  useEffect(() => {
    if (!user?.id) return;

    api.get("/chats").then(res => {
      const formatted = res.data.data.map(chat => {
        const partner = chat.participants.find(
          p => p._id !== user.id
        );

        return {
          id: chat._id,
          partnerId: partner._id,
          name: partner.name,
          lastMessage: chat.lastMessage?.text || "",
          messages: [],
        };
      });

      setChats(formatted);
    });
  }, [user]);

  /* ---------------- JOIN CHAT & LOAD MESSAGES ---------------- */
  useEffect(() => {
    if (!activeChatId) return;

    socket.emit("join_chat", activeChatId);

    api.get(`/chats/${activeChatId}/messages`).then(res => {
      setChats(prev =>
        prev.map(c =>
          c.id === activeChatId
            ? { ...c, messages: res.data.data }
            : c
        )
      );
    });

    return () => {
      socket.emit("leave_chat", activeChatId);
    };
  }, [activeChatId]);

  /* ---------------- SOCKET LISTENERS ---------------- */
  useEffect(() => {
    socket.on("new_message", msg => {
      setChats(prev => {
        const existingChat = prev.find(c => c.id === msg.chat);
        console.log("Received message for chat:", msg.chat, "Existing chat:", existingChat);
        if (existingChat) {
          return prev.map(c =>
            c.id === msg.chat
              ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text }
              : c
          );
        } else {
          const partner = msg.sender._id === user.id ? msg.receiver : msg.sender;
          const newChat = {
            id: msg.chat,
            partnerId: partner._id,
            name: partner.name,
            lastMessage: msg.text,
            messages: [msg],
          };
          return [newChat, ...prev];
        }
      });
    });

    return () => socket.off("new_message");
  }, [user]);


  /* ---------------- NAVIGATION ---------------- */
  const handleNavigate = useCallback(view => {
    if (view === "HOME") {
      navigate('/');
      return;
    }

    setActiveView(view);
    if (view !== "CONVERSATION") setActiveChatId(null);
  }, []);

  const handleChatSelect = useCallback(chatId => {
    setActiveChatId(chatId);
    setActiveView("CONVERSATION");
  }, []);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = (chatId, text) => {
    socket.emit("send_message", {
      chatId,
      text,
    });
  };

  /* ---------------- START NEW CHAT ---------------- */
  const handleStartNewChat = async foundUser => {

    const existing = chats.find(c => c.partnerId === foundUser._id);
    if (existing) {
      handleChatSelect(existing.id);
      return;
    }

    const res = await api.post("/chats", {
      userId: foundUser._id,
    });

    const chat = res.data.data;
    const partner = chat.participants.find(p => p._id !== user.id);

    const newChat = {
      id: chat._id,
      partnerId: partner._id,
      name: partner.name,
      lastMessage: "",
      messages: [],
    };

    setChats(prev => [newChat, ...prev]);
    handleChatSelect(newChat.id);
  };

  /* ---------------- ACTIVE CHAT ---------------- */
  const activeChat = useMemo(
    () => chats.find(c => c.id === activeChatId),
    [chats, activeChatId]
  );

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
        user={user}
      />
    </div>
  );
};

export default ChatsPage;
