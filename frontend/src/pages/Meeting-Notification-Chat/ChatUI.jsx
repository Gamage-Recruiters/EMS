import { useState, useEffect, useRef } from "react";

import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";

import { dummyChats } from "../../data/dummyChats";
import { dummyMessages } from "../../data/dummyMessages";

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(dummyChats[0]);
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const myMsg = {
      id: Date.now(),
      from: "me",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: true,
    };

    setMessages((prev) => [...prev, myMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: activeChat.name,
          text: "Okay, noted 👍",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: true,
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  // Update message list when activeChat changes (optional)
  useEffect(() => {
    // You can load chat-specific messages here. For now we keep same messages.
  }, [activeChat]);

  return (
    <div className="h-[85vh] max-w-6xl mx-auto bg-white shadow-xl border rounded-xl flex overflow-hidden">
      <ChatSidebar
        chats={dummyChats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader activeChat={activeChat} typing={typing} />
        <ChatMessages messages={messages} chatEndRef={chatEndRef} />
        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
