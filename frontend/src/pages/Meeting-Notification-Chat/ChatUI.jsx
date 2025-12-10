import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const chatEnd = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input) return;

    setMessages([...messages, { id: Date.now(), from: "me", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: "Got it 👍" },
      ]);
    }, 800);
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 max-w-lg mx-auto flex flex-col h-[80vh]">
      <h2 className="font-bold text-lg mb-3">💬 Chat</h2>

      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded max-w-xs ${
              m.from === "me" ? "ml-auto bg-blue-200" : "bg-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={chatEnd}></div>
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 p-2 rounded"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
