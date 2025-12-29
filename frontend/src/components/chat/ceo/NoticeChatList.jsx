export default function NoticeChatList({ messages = [] }) {
  return (
    <div className="flex-1 overflow-y-auto p-5 bg-[#F7FAFC] space-y-4">
      {messages.length === 0 && (
        <p className="text-sm text-[#7A7A7A] text-center mt-10">
          No notices yet.
        </p>
      )}

      {messages.map((m) => (
        <div key={m.id} className="flex gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 bg-[#3676E0] text-white rounded-full flex items-center justify-center font-semibold">
            {m.sender?.[0] || "?"}
          </div>

          {/* Message */}
          <div>
            <p className="text-sm font-medium text-[#1F1F1F]">
              {m.sender}
              <span className="ml-2 text-xs text-[#7A7A7A]">{m.time}</span>
            </p>

            <p className="text-sm text-[#4D4D4D] leading-relaxed">{m.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
