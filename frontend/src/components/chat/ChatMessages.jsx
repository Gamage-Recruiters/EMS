import React from "react";
import { CheckCheck } from "lucide-react";

export default function ChatMessages({ messages, chatEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${
            m.from === "me" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs px-3 py-2 rounded-xl shadow text-sm 
              ${
                m.from === "me"
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-white rounded-bl-sm"
              }`}
          >
            <p>{m.text}</p>
            <div className="text-[10px] opacity-70 flex items-center gap-1 mt-1">
              {m.time} {m.from === "me" && <CheckCheck size={14} />}
            </div>
          </div>
        </div>
      ))}

      <div ref={chatEndRef} />
    </div>
  );
}
