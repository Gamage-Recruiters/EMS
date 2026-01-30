import { useEffect, useState } from "react";
import api from "../../../api/api";
import { getSocket } from "../../../components/chat/socket";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages"; // or MessageList if not renamed
import MessageInput from "./MessageInput";

export default function ChatRoom({ channel }) {
  const [messages, setMessages] = useState([]);
  const socket = getSocket();

  useEffect(() => {
    if (!channel?._id) return;

    // Load initial messages
    api
      .get(`/chat/channels/${channel._id}/messages`)
      .then((res) => {
        setMessages(res.data.messages || res.data || []);
      })
      .catch((err) => console.error("Failed to load messages:", err));

    // Join channel room (adjust event name if your backend uses something different)
    socket?.emit("join-channel", channel._id); // or "join" or your backend event

    // Real-time listeners
    const handleNewMessage = (msg) => {
      if (msg.channelId === channel._id) {
        setMessages((prev) => {
          // Remove any optimistic temp message with the same text
          const withoutTemp = prev.filter(
            (m) => !(m._id?.startsWith("temp-") && m.text === msg.text),
          );
          return [...withoutTemp, msg];
        });
      }
    };

    const handleEdited = (updatedMsg) => {
      if (updatedMsg.channelId === channel._id) {
        setMessages((prev) =>
          prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
        );
      }
    };

    const handleDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket?.on("message:new", handleNewMessage);
    socket?.on("message:edited", handleEdited);
    socket?.on("message:deleted", handleDeleted);

    return () => {
      socket?.emit("leave-channel", channel._id);
      socket?.off("message:new", handleNewMessage);
      socket?.off("message:edited", handleEdited);
      socket?.off("message:deleted", handleDeleted);
    };
  }, [channel?._id, socket]);

  // Handle send from MessageInput – add optimistic message here
  const handleSendMessage = (text) => {
    if (!text.trim() || !socket?.connected) return;

    // Create optimistic message (appears immediately)
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      channelId: channel._id,
      userId: JSON.parse(localStorage.getItem("user") || "{}"),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      isEdited: false,
      isOptimistic: true, // optional flag for styling if you want
    };

    // Append to state instantly
    setMessages((prev) => [...prev, optimisticMsg]);

    // Send to server
    socket.emit("message:send", {
      channelId: channel._id,
      text: text.trim(),
    });
  };

  if (!channel) return null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader room={channel} />
      <ChatMessages messages={messages} socket={socket} />
      <MessageInput channel={channel} onSend={handleSendMessage} />
    </div>
  );
}
