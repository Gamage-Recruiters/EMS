import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

export default function NoticeChatList({
  messages: initialMessages = [],
  socket,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // ← NEW: track deleting state
  const endRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const isCEO = currentUser.role === "CEO";

  // Sync messages
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time listeners
  useEffect(() => {
    if (!socket) return;

    const handleEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
      );
      if (editingId === updatedMsg._id) {
        setEditingId(null);
        setEditText("");
        setSavingId(null);
      }
    };

    const handleDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      if (deletingId === messageId) {
        setDeletingId(null);
      }
    };

    socket.on("message:edited", handleEdited);
    socket.on("message:deleted", handleDeleted);

    return () => {
      socket.off("message:edited", handleEdited);
      socket.off("message:deleted", handleDeleted);
    };
  }, [socket, editingId, deletingId]);

  // Start editing (unchanged)
  const startEdit = (msg) => {
    if (!isCEO) return;
    setEditingId(msg._id);
    setEditText(msg.text);
    setSavingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setSavingId(null);
  };

  const saveEdit = (msg) => {
    if (!editText.trim() || editText.trim() === msg.text.trim()) {
      cancelEdit();
      return;
    }

    setSavingId(msg._id);

    const optimisticMsg = { ...msg, text: editText.trim(), isEdited: true };
    setMessages((prev) =>
      prev.map((m) => (m._id === msg._id ? optimisticMsg : m)),
    );

    socket.emit(
      "message:edit",
      { messageId: msg._id, text: editText.trim() },
      (res) => {
        setSavingId(null);
        if (!res?.success) {
          alert(res?.error || "Failed to edit message");
          setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
        } else {
          cancelEdit();
        }
      },
    );
  };

  // FIXED DELETE FUNCTION – now safe & user-friendly
  const handleDelete = (msg) => {
    if (!isCEO) {
      alert("Only CEO can delete notices");
      return;
    }

    // Prevent deleting temporary/optimistic messages (they don't exist on server yet)
    if (typeof msg._id === "string" && msg._id.startsWith("temp-")) {
      alert("This message is still sending — wait until it appears fully.");
      return;
    }

    if (!confirm("Delete this message permanently?")) return;

    setDeletingId(msg._id); // Show deleting state

    // Optimistic delete: remove from UI immediately
    setMessages((prev) => prev.filter((m) => m._id !== msg._id));

    socket.emit("message:delete", { messageId: msg._id }, (res) => {
      setDeletingId(null);
      if (!res?.success) {
        alert(res?.error || "Failed to delete message");
        // Restore message on failure
        setMessages((prev) => [...prev, msg]);
      }
      // On success: backend already broadcasts delete → UI stays updated
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
          const senderName = `${msg.userId.firstName} ${msg.userId.lastName || ""}`;
          const isEditing = editingId === msg._id;
          const isSaving = savingId === msg._id;
          const isDeleting = deletingId === msg._id;

          return (
            <div
              key={msg._id}
              className={`group relative flex items-start gap-4 animate-fade-in ${
                isDeleting ? "opacity-50" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-sm flex-shrink-0
                  ${isFromCEO ? "bg-indigo-600" : "bg-gray-600"}`}
              >
                {senderName[0] || "?"}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {senderName}
                  </p>
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
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(msg)}
                        disabled={isSaving || !editText.trim()}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-1"
                      >
                        {isSaving ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 text-gray-800 whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>

                    {msg.isEdited && (
                      <span className="text-xs text-gray-500 italic mt-1 block">
                        edited
                      </span>
                    )}
                  </>
                )}

                {/* Edit & Delete buttons – only CEO */}
                {!isEditing && isCEO && (
                  <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(msg)}
                      disabled={isSaving || isDeleting}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 transition"
                      title="Edit notice"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(msg)}
                      disabled={isDeleting || isSaving}
                      className={`text-red-600 hover:text-red-800 text-xs flex items-center gap-1 transition ${
                        isDeleting ? "opacity-50 cursor-wait" : ""
                      }`}
                      title="Delete notice"
                    >
                      {isDeleting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      {isDeleting ? "Deleting..." : "Delete"}
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
