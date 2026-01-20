import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Check, X, Loader2, Clock } from "lucide-react";

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

  // Sync messages from parent
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time listeners
  useEffect(() => {
    if (!socket) return;

    const onEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
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

  const startEditing = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.text);
    setSavingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
    setSavingId(null);
  };

  const saveEdit = (msg) => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === msg.text.trim()) {
      cancelEditing();
      return;
    }

    setSavingId(msg._id);

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msg._id ? { ...m, text: trimmed, isEdited: true } : m,
      ),
    );

    socket.emit(
      "message:edit",
      { messageId: msg._id, text: trimmed },
      (res) => {
        setSavingId(null);
        if (!res?.success) {
          alert(res?.error || "Failed to edit message");
          setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
        } else {
          cancelEditing();
        }
      },
    );
  };

  const handleDelete = (msg) => {
    if (!confirm("Delete this message?")) return;

    socket.emit("message:delete", { messageId: msg._id }, (res) => {
      if (!res?.success) {
        alert(res?.error || "Failed to delete");
      }
    });
  };

  // Permission helpers
  const canEdit = (msg) => msg.userId._id === currentUser._id;
  const canDelete = (msg) =>
    msg.userId._id === currentUser._id ||
    ["CEO", "TL", "PM"].includes(currentUser.role);

  // Role badge color mapping
  const getRoleBadge = (role) => {
    if (!role) return null;
    const colors = {
      CEO: "bg-indigo-100 text-indigo-700",
      TL: "bg-teal-100 text-teal-700",
      PM: "bg-purple-100 text-purple-700",
      ATL: "bg-cyan-100 text-cyan-700",
      Developer: "bg-amber-100 text-amber-700",
    };
    return (
      <span
        className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${
          colors[role] || "bg-gray-100 text-gray-700"
        }`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 bg-gradient-to-b from-gray-50 to-white space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-xl font-medium text-gray-700">No messages yet</p>
          <p className="text-sm mt-2 text-gray-500">
            Be the first to send a message!
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          if (!msg?._id || !msg?.userId?._id) return null;

          const isMe = msg.userId._id === currentUser._id;
          const isEditing = editingId === msg._id;
          const isSaving = savingId === msg._id;
          const senderName = `${msg.userId.firstName} ${msg.userId.lastName || ""}`;
          const senderInitial = msg.userId.firstName?.[0] || "?";

          return (
            <div
              key={msg._id}
              className={`group flex animate-fade-in-up ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Left avatar (for others) */}
              {!isMe && (
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 mr-3"
                  title={senderName}
                >
                  {senderInitial}
                </div>
              )}

              {/* Message container */}
              <div
                className={`max-w-[78%] px-5 py-3.5 rounded-2xl text-base shadow-md relative transition-all duration-200
                  ${
                    isMe
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200/80 rounded-bl-none shadow-sm"
                  } ${isEditing ? "ring-2 ring-blue-400 ring-opacity-50" : ""}`}
              >
                {/* Sender info */}
                {!isMe && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-gray-900 text-[15px]">
                      {senderName}
                    </span>
                    {getRoleBadge(msg.userId.role)}
                  </div>
                )}

                {/* Content */}
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl text-base resize-none min-h-[90px] focus:outline-none focus:ring-2 transition-all duration-200
                        ${
                          isMe
                            ? "bg-blue-700/10 border-blue-300 text-white placeholder-blue-200"
                            : "bg-white border-blue-300 text-gray-900 placeholder-gray-400"
                        }`}
                      autoFocus
                      placeholder="Edit your message..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          saveEdit(msg);
                        }
                        if (e.key === "Escape") cancelEditing();
                      }}
                    />

                    {/* Edit controls */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={cancelEditing}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>

                      <button
                        onClick={() => saveEdit(msg)}
                        disabled={isSaving || !editText.trim()}
                        className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition flex items-center gap-2 shadow-sm"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="leading-relaxed break-words text-[15px]">
                      {msg.text}
                    </p>

                    {/* Footer with timestamp & edited tag */}
                    <div className="flex items-center justify-end gap-3 text-xs mt-2 opacity-80">
                      {msg.isEdited && (
                        <span className="italic text-blue-200/90">edited</span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="opacity-70" />
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </>
                )}

                {/* Hover actions */}
                {!isEditing && (canEdit(msg) || canDelete(msg)) && (
                  <div
                    className={`absolute -top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200
                      ${isMe ? "right-2" : "-right-2"}`}
                  >
                    {canEdit(msg) && (
                      <button
                        onClick={() => startEditing(msg)}
                        className="p-2.5 rounded-full bg-white/95 shadow-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all transform hover:scale-110"
                        title="Edit message"
                      >
                        <Pencil size={16} />
                      </button>
                    )}

                    {canDelete(msg) && (
                      <button
                        onClick={() => handleDelete(msg)}
                        className="p-2.5 rounded-full bg-white/95 shadow-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-all transform hover:scale-110"
                        title="Delete message"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* My avatar (right side) */}
              {isMe && (
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 ml-3"
                  title="You"
                >
                  {currentUser.firstName?.[0] || "?"}
                </div>
              )}
            </div>
          );
        })
      )}

      <div ref={endRef} />
    </div>
  );
}
