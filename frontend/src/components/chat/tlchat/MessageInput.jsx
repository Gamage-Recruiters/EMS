import { useState } from "react";
import socket from "../socket";

export default function MessageInput({ channel }) {
  const [text, setText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const canSend =
    channel.type !== "notice" || ["CEO", "TL", "PM"].includes(user.role);

  const send = () => {
    if (!text.trim()) return;

    socket.emit("message:send", { channelId: channel._id, text }, (res) => {
      if (res.success) setText("");
      else alert(res.error);
    });
  };

  if (!canSend) {
    return (
      <div className="p-4 text-center text-sm text-gray-400 border-t">
        You cannot send messages in this channel
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
