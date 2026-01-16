import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

export default function ChatMessages({
  messages: initialMessages = [],
  socket,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingId, setSavingId] = useState(null);
  const endRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Sync incoming messages
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time edit/delete listeners
  useEffect(() => {
    if (!socket) return;

    const onEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
      if (editingId === updatedMsg._id) {
        setEditingId(null);
        setEditText("");
        setSavingId(null);
      }
    };

    const onDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      if (editingId === messageId) {
        setEditingId(null);
        setSavingId(null);
      }
    };

    socket.on("message:edited", onEdited);
    socket.on("message:deleted", onDeleted);

    return () => {
      socket.off("message:edited", onEdited);
      socket.off("message:deleted", onDeleted);
    };
  }, [socket, editingId]);

  // Permissions (only sender can edit/delete)
  const canEditOrDelete = (msg) => msg.userId._id === currentUser._id;

  // Start editing
  const startEditing = (msg) => {
    if (!canEditOrDelete(msg)) return;
    setEditingId(msg._id);
    setEditText(msg.text);
    setSavingId(null);
  };

  // Cancel
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
    setSavingId(null);
  };

  // Save edit (optimistic)
  const saveEdit = (msg) => {
    if (!editText.trim() || editText.trim() === msg.text.trim()) {
      cancelEditing();
      return;
    }

    setSavingId(msg._id);

    // Optimistic update
    const optimistic = { ...msg, text: editText.trim(), isEdited: true };
    setMessages((prev) =>
      prev.map((m) => (m._id === msg._id ? optimistic : m))
    );

    socket.emit(
      "message:edit",
      { messageId: msg._id, text: editText.trim() },
      (res) => {
        setSavingId(null);
        if (!res?.success) {
          alert(res?.error || "Failed to edit");
          setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
        } else {
          cancelEditing();
        }
      }
    );
  };

  // Delete
  const handleDelete = (msg) => {
    if (!canEditOrDelete(msg)) return;

    if (!confirm("Delete this message? This cannot be undone.")) return;

    socket.emit("message:delete", { messageId: msg._id }, (res) => {
      if (!res?.success) {
        alert(res?.error || "Failed to delete");
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/60 space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm mt-2">Be the first to say something</p>
        </div>
      ) : (
        messages.map((msg) => {
          if (!msg?._id || !msg?.userId?._id) return null;

          const isMe = msg.userId._id === currentUser._id;
          const canAction = canEditOrDelete(msg);
          const isEditing = editingId === msg._id;
          const isSaving = savingId === msg._id;

          const senderInitial = msg.userId.firstName?.[0] || "?";
          const senderName = `${msg.userId.firstName} ${
            msg.userId.lastName || ""
          }`;

          return (
            <div
              key={msg._id}
              className={`group flex animate-fade-in ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Message */}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm relative
                  ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none"
                  }`}
              >
                {/* Sender name (for others) */}
                {!isMe && (
                  <div className="text-xs font-medium text-blue-600 mb-1.5">
                    {senderName}
                  </div>
                )}

                {/* Editable content */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm resize-none min-h-[60px] focus:outline-none focus:ring-2
                        ${
                          isMe
                            ? "border-blue-400 focus:ring-blue-500 bg-blue-700/10 text-white"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          saveEdit(msg);
                        }
                        if (e.key === "Escape") cancelEditing();
                      }}
                    />

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEditing}
                        className="p-1.5 rounded hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => saveEdit(msg)}
                        disabled={isSaving || !editText.trim()}
                        className="p-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex items-center gap-1"
                      >
                        {isSaving ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="break-words leading-relaxed">{msg.text}</p>

                    <div className="flex items-center justify-end gap-2 mt-1.5 text-xs opacity-80">
                      {msg.isEdited && <span className="italic">edited</span>}
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </>
                )}

                {/* Edit/Delete controls – only sender */}
                {!isEditing && canAction && (
                  <div
                    className={`absolute -top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity
                      ${isMe ? "-mr-2" : "-mr-10"}`}
                  >
                    <button
                      onClick={() => startEditing(msg)}
                      className="p-1.5 rounded-full bg-white/90 shadow hover:bg-white text-gray-700 hover:text-blue-600"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(msg)}
                      className="p-1.5 rounded-full bg-white/90 shadow hover:bg-white text-gray-700 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={14} />
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
