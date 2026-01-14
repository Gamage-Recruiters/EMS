import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function NoticeChatList({
  messages: initialMessages = [],
  socket,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const endRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const isCEO = currentUser.role === "CEO";

  // Sync initial messages when prop changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };

    const handleDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on("message:edited", handleEdited);
    socket.on("message:deleted", handleDeleted);

    return () => {
      socket.off("message:edited", handleEdited);
      socket.off("message:deleted", handleDeleted);
    };
  }, [socket]);

  const handleEdit = (msg) => {
    if (!isCEO) return alert("Only CEO can edit notices");

    const newText = prompt("Edit your message:", msg.text);
    if (!newText || newText.trim() === msg.text.trim()) return;
    if (!newText.trim()) return alert("Message cannot be empty");

    socket.emit(
      "message:edit",
      { messageId: msg._id, text: newText.trim() },
      (res) => {
        if (!res?.success) {
          alert(res?.error || "Failed to edit message");
        }
      }
    );
  };

  const handleDelete = (msg) => {
    if (!isCEO) return alert("Only CEO can delete notices");

    if (!confirm("Are you sure you want to delete this message?")) return;

    socket.emit("message:delete", { messageId: msg._id }, (res) => {
      if (!res?.success) {
        alert(res?.error || "Failed to delete message");
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-[#F7FAFC] space-y-5">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">No messages yet.</p>
      ) : (
        messages.map((msg) => {
          if (!msg?._id || !msg?.userId?._id) return null;

          const isFromCEO = msg.userId.role === "CEO";
          const senderName = `${msg.userId.firstName} ${
            msg.userId.lastName || ""
          }`;

          return (
            <div key={msg._id} className="group relative flex gap-4">
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  isFromCEO ? "bg-indigo-600" : "bg-gray-600"
                }`}
              >
                {senderName[0] || "?"}
              </div>

              {/* Message */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{senderName}</span>
                  {isFromCEO && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                      CEO
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                  {msg.text}
                </p>

                {msg.isEdited && (
                  <span className="text-xs text-gray-500 italic block mt-1">
                    edited
                  </span>
                )}

                {/* Edit/Delete buttons – only CEO sees them */}
                {isCEO && (
                  <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(msg)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(msg)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      <div ref={endRef} />
    </div>
  );
}
