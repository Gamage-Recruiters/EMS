import { useState } from "react";
import { Send } from "lucide-react";

export default function NoticeChatComposer({ activeRoom, onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || !activeRoom) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder={`Type a notice to ${activeRoom?.name || "everyone"}...`}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSend())
          }
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
