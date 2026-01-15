import { useEffect, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function MessageList({ messages = [], socket }) {
  const endRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message:edited", (updatedMsg) => {
      console.log("Message edited in real-time:", updatedMsg);
      // Optional: update local messages state here for instant UI
    });

    socket.on("message:deleted", ({ messageId }) => {
      console.log("Message deleted in real-time:", messageId);
      // Optional: remove from local state or trigger re-fetch
    });

    return () => {
      socket.off("message:edited");
      socket.off("message:deleted");
    };
  }, [socket]);

  const handleEdit = (msg) => {
    const newText = prompt("Edit your message:", msg.text);
    if (newText === null || newText.trim() === msg.text.trim()) return;
    if (!newText.trim()) {
      alert("Message cannot be empty");
      return;
    }

    socket.emit(
      "message:edit",
      { messageId: msg._id, text: newText.trim() },
      (res) => {
        if (!res?.success) alert(res?.error || "Failed to edit");
      }
    );
  };

  const handleDelete = (msg) => {
    if (!window.confirm("Delete this message?")) return;

    socket.emit("message:delete", { messageId: msg._id }, (res) => {
      if (!res?.success) alert(res?.error || "Failed to delete");
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          No messages yet
        </div>
      ) : (
        messages
          .map((msg) => {
            if (!msg?._id || !msg?.userId?._id) {
              console.warn("Skipping invalid message:", msg);
              return null;
            }

            const isMe = msg.userId._id === currentUser._id;
            const canEdit = isMe;
            const canDelete =
              isMe || ["CEO", "TL", "PM"].includes(currentUser.role);

            return (
              <div
                key={msg._id}
                className={`group relative flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow
                  ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none border"
                  }`}
                >
                  {!isMe && msg.userId && (
                    <div className="text-xs font-medium text-blue-700 mb-1">
                      {msg.userId.firstName} {msg.userId.lastName || ""}
                    </div>
                  )}

                  <div className="break-words leading-relaxed">
                    {msg.text || ""}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-1">
                    {msg.isEdited && (
                      <span className="text-xs opacity-70 italic">edited</span>
                    )}
                    {msg.createdAt && (
                      <span className="text-xs opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  {(canEdit || canDelete) && (
                    <div
                      className={`
                      flex gap-1 mt-1
                      ${
                        isMe || canDelete
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                      transition-opacity
                    `}
                    >
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(msg)}
                          className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
                          title="Edit message"
                        >
                          <Pencil size={16} />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(msg)}
                          className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-red-300"
                          title="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
          .filter(Boolean)
      )}

      <div ref={endRef} />
    </div>
  );
}
