export default function ChatMessages({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#F7FAFC] space-y-5">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-[#3676E0] text-white flex items-center justify-center font-semibold">
            {msg.user[0]}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#1F1F1F]">{msg.user}</span>
              <span className="text-xs text-[#7A7A7A]">{msg.time}</span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg px-4 py-2 mt-1">
              <p className="text-sm text-[#1F1F1F]">{msg.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
