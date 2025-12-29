import { useEffect, useRef } from "react";

export default function MessageList({ messages, users }) {
  const endRef = useRef(null);
  const currentUserId = 1; // logged-in user (dummy)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getUser = (id) => users.find((u) => u.id === id);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {messages.map((msg) => {
        const user = getUser(msg.userId);
        const isMe = msg.userId === currentUserId;

        return (
          <div
            key={msg.id}
            className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[60%] px-3 py-2 rounded-lg text-sm
                ${
                  isMe
                    ? "bg-[#3676E0] text-white"
                    : "bg-[#FFFFFF] border border-[#E0E0E0] text-[#1F1F1F]"
                }`}
            >
              {!isMe && (
                <div className="text-xs font-semibold text-[#3676E0] mb-1">
                  {user.name}
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
