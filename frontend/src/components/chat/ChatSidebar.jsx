import React from "react";
import { Search, UserCircle } from "lucide-react";

export default function ChatSidebar({ chats, activeChat, setActiveChat }) {
  return (
    <div className="w-1/3 border-r bg-gray-50 flex flex-col">
      <div className="p-3">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow">
          <Search size={18} />
          <input
            placeholder="Search employee..."
            className="flex-1 outline-none"
          />
        </div>
      </div>

      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-gray-200 transition 
              ${activeChat?.id === chat.id ? "bg-gray-200" : "bg-gray-50"}`}
          >
            <UserCircle size={42} className="text-gray-600" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-semibold">{chat.name}</p>
                {chat.unread > 0 && (
                  <span className="text-xs bg-green-600 text-white px-2 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
