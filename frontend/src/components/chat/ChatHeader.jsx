import React from "react";
import { UserCircle, EllipsisVertical } from "lucide-react";

export default function ChatHeader({ activeChat, typing }) {
  return (
    <div className="p-3 border-b bg-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UserCircle size={40} className="text-gray-600" />
        <div>
          <p className="font-semibold">{activeChat?.name ?? "Select a chat"}</p>
          <p className="text-xs text-green-600">
            {typing ? "Typing..." : activeChat?.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <EllipsisVertical />
    </div>
  );
}
