import { useEffect, useState } from "react";
import api from "../../../api/api";
import { getSocket } from "../socket"; // ← use getSocket if you have it
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatRoom({ channel }) {
  const [messages, setMessages] = useState([]);
  const socket = getSocket(); // or your socket import

  useEffect(() => {
    if (!channel?._id) return;

    // Load initial messages
    api
      .get(`/chat/channels/${channel._id}/messages`)
      .then((res) => {
        setMessages(res.data.messages || []);
      })
      .catch((err) => console.error("Failed to load messages:", err));

    // Join channel room
    socket?.emit("channel:join", channel._id);

    // Listen for new messages
    socket?.on("message:new", (msg) => {
      if (msg.channelId === channel._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Listen for edited messages
    socket?.on("message:edited", (updatedMsg) => {
      if (updatedMsg.channelId === channel._id) {
        setMessages((prev) =>
          prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
        );
      }
    });

    // Listen for deleted messages
    socket?.on("message:deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    return () => {
      socket?.emit("channel:leave", channel._id);
      socket?.off("message:new");
      socket?.off("message:edited");
      socket?.off("message:deleted");
    };
  }, [channel?._id, socket]);

  if (!channel) return null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader room={channel} />
      <MessageList messages={messages} socket={socket} />
      <MessageInput channel={channel} socket={socket} />
    </div>
  );
}
