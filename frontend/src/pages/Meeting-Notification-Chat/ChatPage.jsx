import { useState, useMemo } from "react";

import ChannelSidebar from "../../components/chat/ChannelSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";

import { rooms } from "../../data/rooms";
import { messagesByRoom } from "../../data/messages";
import { currentUser } from "../../data/currentUser";

export default function ChatPage() {
  // Filter rooms Sarith can see
  const visibleRooms = useMemo(
    () => rooms.filter((r) => r.members.includes(currentUser.id)),
    []
  );

  const [activeChannel, setActiveChannel] = useState(visibleRooms[0]);
  const [messages, setMessages] = useState(
    messagesByRoom[visibleRooms[0].id] || []
  );
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      userId: currentUser.id,
      user: currentUser.name,
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const handleChannelChange = (channel) => {
    setActiveChannel(channel);
    setMessages(messagesByRoom[channel.id] || []);
  };

  const isReadOnly = activeChannel.type === "notice";

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex justify-center px-6">
      <div className="h-[90vh] w-full max-w-7xl bg-white rounded-xl border flex">
        <ChannelSidebar
          rooms={visibleRooms}
          activeChannel={activeChannel}
          setActiveChannel={handleChannelChange}
        />

        <div className="flex-1 flex flex-col">
          <ChatHeader channel={activeChannel} />
          <ChatMessages messages={messages} />
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
}
