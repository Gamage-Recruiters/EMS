import { useEffect, useRef } from "react";

export default function MessageList({ messages = [] }) {
  const endRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          No messages yet
        </div>
      ) : (
        messages
          .map((msg) => {
            // Safety check – skip truly broken messages
            if (!msg?._id || !msg?.userId?._id) {
              console.warn("Skipping broken message:", msg);
              return null;
            }

            const isMe = msg.userId._id === currentUser._id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm
                  ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none border"
                  }`}
                >
                  {!isMe && msg.userId && (
                    <div className="text-xs font-medium text-blue-700 mb-1">
                      {msg.userId.firstName} {msg.userId.lastName || ""}
                    </div>
                  )}

                  <div className="break-words">{msg.text || ""}</div>

                  {/* Optional: show edited status */}
                  {msg.isEdited && (
                    <div className="text-xs opacity-60 mt-1 italic">edited</div>
                  )}

                  {/* Timestamp */}
                  {msg.createdAt && (
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
          .filter(Boolean) // remove any null entries
      )}

      <div ref={endRef} />
    </div>
  );
}
