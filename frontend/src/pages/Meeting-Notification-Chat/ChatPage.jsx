import { useState } from "react";

import ChannelSidebar from "../../components/chat/ChannelSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";

import { channels } from "../../data/channels";
import { channelMessages } from "../../data/channelMessages";

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [messages, setMessages] = useState(channelMessages[channels[0].id]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      user: "You",
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
    setMessages(channelMessages[channel.id]);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-6">
      <div className="h-[90vh] w-full max-w-7xl bg-[#FFFFFF] rounded-xl overflow-hidden border border-[#E0E0E0] shadow-sm flex">
        {/* Channel Sidebar */}
        <ChannelSidebar
          channels={channels}
          activeChannel={activeChannel}
          setActiveChannel={handleChannelChange}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatHeader channel={activeChannel} />
          <ChatMessages messages={messages} />
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
