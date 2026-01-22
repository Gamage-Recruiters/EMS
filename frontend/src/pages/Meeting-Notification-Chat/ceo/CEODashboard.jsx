import { useState, useEffect } from "react";
import { getSocket } from "../../../components/chat/socket";
import api from "../../../api/api";
import CEOTabs from "../../../components/chat/ceo/CEOTabs";
import NoticeChatComposer from "../../../components/chat/ceo/NoticeChatComposer";
import NoticeChatList from "../../../components/chat/ceo/NoticeChatList";
import EmployeeSearch from "../../../components/chat/ceo/EmployeeSearch";

export default function CEOChatUI() {
  const [tab, setTab] = useState("Send Notice");
  const [allChannels, setAllChannels] = useState([]); // all accessible channels
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = getSocket();

  // Load all channels & employees once
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. All channels CEO can see
        const channelsRes = await api.get("/chat/channels");
        const channels = channelsRes.data.channels || channelsRes.data || [];
        setAllChannels(channels);

        // Set default active channel based on tab
        if (channels.length > 0) {
          setActiveChannel(channels[0]);
        }

        // 2. Employees for starting private chats
        const empRes = await api.get("/chat/employees");
        setEmployees(empRes.data.employees || []);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load messages when active channel changes
  useEffect(() => {
    if (!activeChannel?._id || !socket?.connected) return;

    socket.emit(
      "messages:get",
      { channelId: activeChannel._id, limit: 50, skip: 0 },
      (res) => {
        if (res?.success) {
          setMessages((prev) => ({
            ...prev,
            [activeChannel._id]: res.messages || [],
          }));
        }
      },
    );
  }, [activeChannel?._id, socket?.connected]);

  // Real-time: new notice message (broadcast)
  useEffect(() => {
    if (!socket) return;

    socket.on("notice:new", (newMsg) => {
      setMessages((prev) => ({
        ...prev,
        [newMsg.channelId]: [...(prev[newMsg.channelId] || []), newMsg],
      }));
    });

    // Real-time: new channel created (team or private)
    socket.on("channel:new", (newChannel) => {
      setAllChannels((prev) => {
        if (prev.some((ch) => ch._id === newChannel._id)) return prev;
        return [...prev, newChannel];
      });

      // Auto-select if no active channel
      if (!activeChannel) setActiveChannel(newChannel);
    });

    return () => {
      socket.off("notice:new");
      socket.off("channel:new");
    };
  }, [socket, activeChannel]);

  // Filter channels by search (applies to all types)
  const filteredChannels = allChannels.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Group channels for sidebar display
  const noticeChannels = filteredChannels.filter((ch) => ch.type === "notice");
  const teamChannels = filteredChannels.filter((ch) => ch.type === "regular");
  const privateChannels = filteredChannels.filter(
    (ch) => ch.type === "private",
  );

  // Start private chat
  const startPrivateChat = (employee) => {
    if (!socket?.connected) {
      alert("Chat connection not ready. Please refresh.");
      return;
    }

    socket.emit("private:create", { recipientId: employee._id }, (res) => {
      if (!res?.success) {
        alert(res?.error || "Failed to start private chat");
        return;
      }

      const newChannel = res.channel;

      // Add to list
      setAllChannels((prev) => {
        if (prev.some((ch) => ch._id === newChannel._id)) return prev;
        return [...prev, newChannel];
      });

      setActiveChannel(newChannel);
      setTab("Private Messages");
      setSearch("");
    });
  };

  // Send notice
  const sendNoticeMessage = (text) => {
    if (!activeChannel?._id || !text.trim()) return;
    socket.emit("notice:send", {
      channelId: activeChannel._id,
      text: text.trim(),
    });
  };

  // Send regular/private message
  const sendRegularMessage = (text) => {
    if (!activeChannel?._id || !text.trim() || !socket?.connected) return;
    socket.emit("message:send", {
      channelId: activeChannel._id,
      text: text.trim(),
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading channels...
      </div>
    );
  }

  return (
    <div className="h-[90vh] max-w-7xl mx-auto bg-white border rounded-xl flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <CEOTabs tab={tab} setTab={setTab} />

        {tab === "Send Notice" && (
          <div className="flex flex-1 p-5 gap-5 overflow-hidden">
            {/* Sidebar - Notice Channels */}
            <div className="w-72 bg-gray-50 border rounded-lg p-4 flex flex-col">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Notice Channels
              </h4>
              <EmployeeSearch value={search} onChange={setSearch} />
              <div className="mt-3 space-y-1 overflow-y-auto flex-1">
                {noticeChannels.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No notice channels
                  </p>
                ) : (
                  noticeChannels.map((ch) => (
                    <div
                      key={ch._id}
                      onClick={() => setActiveChannel(ch)}
                      className={`px-3 py-2 rounded cursor-pointer text-sm transition ${
                        activeChannel?._id === ch._id
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {ch.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">
                  {activeChannel?.name || "Select a notice channel"}
                </h3>
              </div>
              <NoticeChatList
                messages={messages[activeChannel?._id] || []}
                socket={socket}
              />
              {activeChannel && (
                <NoticeChatComposer
                  activeRoom={activeChannel}
                  onSend={sendNoticeMessage}
                />
              )}
            </div>
          </div>
        )}

        {tab === "Private Messages" && (
          <div className="flex flex-1 p-5 gap-5 overflow-hidden">
            {/* Sidebar - All Channels + Employee Search */}
            <div className="w-80 bg-gray-50 border rounded-lg p-4 flex flex-col">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Messages & Team
              </h4>
              <EmployeeSearch value={search} onChange={setSearch} />

              <div className="mt-4 space-y-4 overflow-y-auto flex-1">
                {/* Team Channels */}
                {teamChannels.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-2">
                      Team Channels
                    </div>
                    {teamChannels.map((ch) => (
                      <div
                        key={ch._id}
                        onClick={() => setActiveChannel(ch)}
                        className={`px-3 py-2 rounded cursor-pointer text-sm transition ${
                          activeChannel?._id === ch._id
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {ch.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Private Channels */}
                {privateChannels.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-2">
                      Private Chats
                    </div>
                    {privateChannels.map((ch) => (
                      <div
                        key={ch._id}
                        onClick={() => setActiveChannel(ch)}
                        className={`px-3 py-2 rounded cursor-pointer text-sm transition ${
                          activeChannel?._id === ch._id
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {ch.name || "Private Chat"}
                      </div>
                    ))}
                  </div>
                )}

                {/* Start new private chat */}
                <div className="mt-4">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    Start Private Chat
                  </div>
                  {employees
                    .filter((emp) =>
                      `${emp.firstName} ${emp.lastName}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((emp) => (
                      <div
                        key={emp._id}
                        onClick={() => startPrivateChat(emp)}
                        className="px-3 py-2 rounded cursor-pointer text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                          {emp.firstName?.[0]}
                        </div>
                        <span>
                          {emp.firstName} {emp.lastName}
                          <span className="text-xs text-gray-500 block">
                            {emp.role}
                          </span>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white border rounded-lg overflow-hidden">
              {activeChannel ? (
                <>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">
                      {activeChannel.name || "Chat"}
                    </h3>
                  </div>
                  <NoticeChatList
                    messages={messages[activeChannel._id] || []}
                    socket={socket}
                  />
                  <NoticeChatComposer
                    activeRoom={activeChannel}
                    onSend={(text) => {
                      if (!socket) return;
                      socket.emit("message:send", {
                        channelId: activeChannel._id,
                        text: text.trim(),
                      });
                    }}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a channel or start a private chat
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
