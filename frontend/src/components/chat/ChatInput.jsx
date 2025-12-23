import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, sendMessage }) {
  return (
    <div className="px-5 py-4 bg-[#FFFFFF] border-t border-[#E0E0E0]">
      <div className="flex items-center gap-3 bg-[#F7FAFC] border border-[#E0E0E0] rounded-lg px-4 py-3">
        <input
          className="flex-1 bg-transparent outline-none text-sm text-[#1F1F1F] placeholder-[#7A7A7A]"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="text-[#3676E0] hover:text-[#1F1F1F] transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
