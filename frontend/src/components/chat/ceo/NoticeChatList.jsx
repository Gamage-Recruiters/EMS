import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

export default function NoticeChatList({
  messages: initialMessages = [],
  socket,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const endRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const isCEO = currentUser.role === "CEO";

  // Sync messages from parent
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
      );
      // Clear editing state if this was the edited message
      if (editingMessageId === updatedMsg._id) {
        setEditingMessageId(null);
        setEditText("");
        setIsSaving(false);
      }
    };

    const handleDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      if (editingMessageId === messageId) {
        setEditingMessageId(null);
        setIsSaving(false);
      }
    };

    socket.on("message:edited", handleEdited);
    socket.on("message:deleted", handleDeleted);

    return () => {
      socket.off("message:edited", handleEdited);
      socket.off("message:deleted", handleDeleted);
    };
  }, [socket, editingMessageId]);

  // Start editing
  const startEdit = (msg) => {
    if (!isCEO) return;
    setEditingMessageId(msg._id);
    setEditText(msg.text);
    setIsSaving(false);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
    setIsSaving(false);
  };

  // Save edited message
  const saveEdit = (msg) => {
    if (!editText.trim() || editText.trim() === msg.text.trim()) {
      cancelEdit();
      return;
    }

    setIsSaving(true);

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msg._id ? { ...m, text: editText.trim(), isEdited: true } : m,
      ),
    );

    socket.emit(
      "message:edit",
      { messageId: msg._id, text: editText.trim() },
      (res) => {
        setIsSaving(false);
        if (!res?.success) {
          alert(res?.error || "Failed to edit message");
          // Revert optimistic update on failure
          setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
        } else {
          // Success: backend already broadcasts update
          cancelEdit();
        }
      },
    );
  };

  // Delete
  const handleDelete = (msg) => {
    if (!isCEO) return alert("Only CEO can delete notices");

    if (!confirm("Delete this message permanently?")) return;

    socket.emit("message:delete", { messageId: msg._id }, (res) => {
      if (!res?.success) {
        alert(res?.error || "Failed to delete message");
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm mt-2">Send a notice to get started</p>
        </div>
      ) : (
        messages.map((msg) => {
          if (!msg?._id || !msg?.userId?._id) return null;

          const isFromCEO = msg.userId.role === "CEO";
          const senderName = `${msg.userId.firstName} ${
            msg.userId.lastName || ""
          }`;
          const isEditing = editingMessageId === msg._id;

          return (
            <div
              key={msg._id}
              className="group relative flex items-start gap-4 animate-fade-in"
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-sm flex-shrink-0 ${
                  isFromCEO ? "bg-indigo-600" : "bg-gray-600"
                }`}
              >
                {senderName[0] || "?"}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-gray-900">
                    {senderName}
                  </span>
                  {isFromCEO && (
                    <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                      CEO
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Editable or normal text */}
                {isEditing ? (
                  <div className="mt-1">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm min-h-[60px]"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          saveEdit(msg);
                        }
                        if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit(msg)}
                        disabled={isSaving || !editText.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 transition"
                      >
                        {isSaving ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition"
                      >
                        <X size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 text-gray-800 whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>

                    {msg.isEdited && (
                      <span className="text-xs text-gray-500 italic block mt-1">
                        edited
                      </span>
                    )}
                  </>
                )}

                {/* Edit / Delete controls – only CEO */}
                {!isEditing && isCEO && (
                  <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(msg)}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 transition"
                      title="Edit message"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(msg)}
                      className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1 transition"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                      Delete
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
