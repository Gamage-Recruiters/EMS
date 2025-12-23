import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-4 bg-[#FFFFFF] border-t border-[#E0E0E0]">
      <div className="flex items-center gap-2 bg-[#F7FAFC] rounded-lg px-3 py-2 border border-[#E0E0E0]">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message #channel"
          className="flex-1 bg-transparent outline-none text-sm text-[#1F1F1F] placeholder-[#7A7A7A]"
        />
        <button onClick={send} className="text-[#3676E0] font-semibold">
          Send
        </button>
      </div>
    </div>
  );
}
