import { useEffect, useState } from "react";
import api from "../../../services/api";
import socket from "../socket";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatRoom({ channel }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!channel) return;

    api
      .get(`/chat/channels/${channel._id}/messages`)
      .then((res) => setMessages(res.data.messages));

    socket.emit("channel:join", channel._id);

    socket.on("message:new", (msg) => {
      if (msg.channel === channel._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.emit("channel:leave", channel._id);
      socket.off("message:new");
    };
  }, [channel]);

  if (!channel) return null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader room={channel} />
      <MessageList messages={messages} />
      <MessageInput channel={channel} />
    </div>
  );
}
