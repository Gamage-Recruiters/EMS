import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function MessageInput({ channel, onSend }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const canSend =
    channel.type !== "notice" || ["CEO", "TL", "PM"].includes(user.role);

  const handleSend = () => {
    if (!text.trim() || sending) return;

    setSending(true);

    // Call parent's handler (which does optimistic + emit)
    onSend(text.trim());

    setText("");
    setSending(false);
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
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSend())
          }
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          {sending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Send
        </button>
      </div>
    </div>
  );
}
