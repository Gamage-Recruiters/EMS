import { useEffect, useRef } from "react";

export default function MessageList({ messages }) {
  const endRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {messages.map((msg) => {
        const isMe = msg.sender._id === currentUser._id;

        return (
          <div
            key={msg._id}
            className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[60%] px-3 py-2 rounded-lg text-sm
                ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-800"
                }`}
            >
              {!isMe && (
                <div className="text-xs font-semibold text-blue-600 mb-1">
                  {msg.sender.name}
                </div>
              )}
              {msg.text}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
