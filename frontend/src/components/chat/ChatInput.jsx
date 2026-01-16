import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, sendMessage, disabled }) {
  if (disabled) {
    return (
      <div className="px-5 py-4 text-sm text-[#7A7A7A] border-t">
        🔒 You cannot send messages in this channel
      </div>
    );
  }

  return (
    <div className="px-5 py-4 bg-[#FFFFFF] border-t border-[#E0E0E0]">
      <div className="flex items-center gap-3 bg-[#F7FAFC] border rounded-lg px-4 py-3">
        <input
          className="flex-1 bg-transparent outline-none text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
