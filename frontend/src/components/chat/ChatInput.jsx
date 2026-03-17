import { Send } from "lucide-react";
import { useState } from "react";

export default function ChatInput({
  sendMessage,
  disabled,
  placeholder = "Type a message...",
}) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    sendMessage(input.trim());
    setInput("");
  };

  if (disabled) {
    return (
      <div className="px-5 py-4 text-sm text-gray-500 border-t bg-gray-50">
        🔒 You cannot send messages in this channel
      </div>
    );
  }

  return (
    <div className="px-5 py-4 bg-white border-t border-gray-200">
      <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3">
        <input
          className="flex-1 bg-transparent outline-none text-sm"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
