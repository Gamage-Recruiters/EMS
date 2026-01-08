import { useState } from "react";
import { Send } from "lucide-react";

export default function NoticeChatComposer({ activeRoom, onSend }) {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim() || !activeRoom) return;

    onSend(activeRoom.id, {
      id: Date.now(),
      sender: "CEO",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setInput("");
  };

  return (
    <div className="border-t border-[#E0E0E0] bg-[#FFFFFF] p-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder={`Message ${activeRoom?.name || ""}`}
          className="
            flex-1
            bg-[#F7FAFC]
            border border-[#E0E0E0]
            rounded-lg
            px-4 py-2
            text-sm
            text-[#1F1F1F]
            placeholder-[#7A7A7A]
            focus:outline-none
            focus:ring-2
            focus:ring-[#3676E0]
          "
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="
            bg-[#3676E0]
            hover:bg-[#2b5abf]
            text-white
            p-2
            rounded-lg
            transition
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
