import { useRef, useEffect } from "react";

export default function ChatMessages({ messages = [] }) {
  const endRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#F7FAFC] space-y-5">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">No messages yet.</p>
      ) : (
        messages.map((msg) => {
          if (!msg?._id || !msg?.userId?._id) return null;

          const isMe = msg.userId._id === currentUser._id;
          const senderName = `${msg.userId.firstName} ${
            msg.userId.lastName || ""
          }`;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm
                  ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none"
                  }`}
              >
                {!isMe && (
                  <div className="text-xs font-medium text-blue-600 mb-1">
                    {senderName}
                    {msg.userId.role && (
                      <span className="ml-2 text-gray-500">
                        ({msg.userId.role})
                      </span>
                    )}
                  </div>
                )}

                <p className="break-words">{msg.text}</p>

                <div className="flex items-center justify-end gap-2 mt-1">
                  {msg.isEdited && (
                    <span className="text-xs opacity-70 italic">edited</span>
                  )}
                  <span className="text-xs opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}

      <div ref={endRef} />
    </div>
  );
}
