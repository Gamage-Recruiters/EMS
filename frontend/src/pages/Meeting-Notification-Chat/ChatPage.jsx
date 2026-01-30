import { useState, useEffect } from "react";
import { getSocket } from "../../components/chat/socket";
import api from "../../api/api";

import ChannelSidebar from "../../components/chat/ChannelSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages"; // ← updated component
import ChatInput from "../../components/chat/ChatInput";

export default function ChatPage() {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);

  const socket = getSocket();

  // Load channels
  useEffect(() => {
    const loadChannels = async () => {
      try {
        const res = await api.get("/chat/channels");
        const userChannels = res.data.channels || res.data || [];
        setChannels(userChannels);

        if (userChannels.length > 0) {
          setActiveChannel(userChannels[0]);
        }
      } catch (err) {
        console.error("Failed to load channels", err);
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
  }, []);

  // Load messages when channel changes
  useEffect(() => {
    if (!activeChannel?._id || !socket?.connected) return;

    socket.emit(
      "messages:get",
      { channelId: activeChannel._id, limit: 50, skip: 0 },
      (res) => {
        if (res?.success) {
          setMessages((prev) => ({
            ...prev,
            [activeChannel._id]: res.messages || [],
          }));
        }
      },
    );
  }, [activeChannel?._id, socket?.connected]);

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      setMessages((prev) => ({
        ...prev,
        [newMsg.channelId]: [...(prev[newMsg.channelId] || []), newMsg],
      }));
    };

    const handleChannelNew = (newChannel) => {
      setChannels((prev) => {
        if (prev.some((ch) => ch._id === newChannel._id)) return prev;
        return [...prev, newChannel];
      });
      if (!activeChannel) setActiveChannel(newChannel);
    };

    socket.on("message:new", handleNewMessage);
    socket.on("channel:new", handleChannelNew);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("channel:new", handleChannelNew);
    };
  }, [socket, activeChannel]);

  const sendMessage = (text) => {
    if (!activeChannel?._id || !text.trim() || !socket?.connected) return;

    socket.emit("message:send", {
      channelId: activeChannel._id,
      text: text.trim(),
    });
  };

  const isNoticeChannel = activeChannel?.type === "notice";
  const canSend = !isNoticeChannel;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your channels...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex justify-center px-6">
      <div className="h-[90vh] w-full max-w-7xl bg-white rounded-xl border flex overflow-hidden">
        <ChannelSidebar
          rooms={channels}
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
        />

        <div className="flex-1 flex flex-col">
          {activeChannel ? (
            <>
              <ChatHeader channel={activeChannel} />
              <ChatMessages
                messages={messages[activeChannel._id] || []}
                socket={socket} // ← pass socket
              />
              <ChatInput
                sendMessage={sendMessage}
                disabled={!canSend}
                placeholder={
                  !canSend
                    ? "You cannot send messages in notice channels"
                    : "Type a message..."
                }
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a channel to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
