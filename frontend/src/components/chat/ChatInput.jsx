import React from "react";
import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, sendMessage }) {
  return (
    <div className="p-3 border-t bg-gray-50 flex items-center gap-2">
      <input
        className="flex-1 border rounded-full px-4 py-2 bg-white shadow"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
