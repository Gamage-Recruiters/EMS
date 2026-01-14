import { useState, useEffect } from "react";
import { getSocket } from "../../../components/chat/socket";
import api from "../../../services/api";
import CEOTabs from "../../../components/chat/ceo/CEOTabs";
import NoticeChatComposer from "../../../components/chat/ceo/NoticeChatComposer";
import NoticeChatList from "../../../components/chat/ceo/NoticeChatList";
import EmployeeSearch from "../../../components/chat/ceo/EmployeeSearch";

export default function CEOChatUI() {
  const [tab, setTab] = useState("Send Notice");
  const [noticeChannels, setNoticeChannels] = useState([]);
  const [privateChannels, setPrivateChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = getSocket();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load all channels (for notice type)
        const channelsRes = await api.get("/chat/channels");
        const allChannels = channelsRes.data.channels || channelsRes.data || [];
        setNoticeChannels(allChannels.filter((ch) => ch.type === "notice"));

        // 2. Load CEO's private channels
        const privateRes = await api.get("/chat/private/channels");
        setPrivateChannels(privateRes.data.channels || []);

        // 3. Load employees list (for search)
        const empRes = await api.get("/chat/employees");
        setEmployees(empRes.data.employees || []);

        // Set default active channel
        if (tab === "Send Notice" && noticeChannels.length > 0) {
          setActiveChannel(noticeChannels[0]);
        } else if (tab === "Private Messages" && privateChannels.length > 0) {
          setActiveChannel(privateChannels[0]);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tab]);

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
      }
    );
  }, [activeChannel?._id, socket?.connected]);

  // Real-time new notice
  useEffect(() => {
    if (!socket) return;

    socket.on("notice:new", (newMsg) => {
      setMessages((prev) => ({
        ...prev,
        [newMsg.channelId]: [...(prev[newMsg.channelId] || []), newMsg],
      }));
    });

    return () => socket.off("notice:new");
  }, [socket]);

  // Real-time new private channel created
  useEffect(() => {
    if (!socket) return;

    socket.on("channel:new", (newChannel) => {
      if (newChannel.type === "private") {
        setPrivateChannels((prev) => {
          if (prev.some((ch) => ch._id === newChannel._id)) return prev;
          return [...prev, newChannel];
        });

        // Auto-select the new channel if none active
        if (!activeChannel) setActiveChannel(newChannel);
      }
    });

    return () => socket.off("channel:new");
  }, [socket, activeChannel]);

  // Filter notice channels by search (only in Send Notice tab)
  const filteredNoticeChannels = noticeChannels.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  );

  // Start private chat with employee
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

      // Add to list if not already present
      setPrivateChannels((prev) => {
        if (prev.some((ch) => ch._id === newChannel._id)) return prev;
        return [...prev, newChannel];
      });

      // Switch to it
      setActiveChannel(newChannel);
      setTab("Private Messages");
      setSearch(""); // clear search
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

  return (
    <div className="h-[90vh] max-w-7xl mx-auto bg-white border rounded-xl flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <CEOTabs tab={tab} setTab={setTab} />

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            {tab === "Send Notice" && (
              <div className="flex flex-1 p-5 gap-5 overflow-hidden">
                {/* Notice Channels Sidebar */}
                <div className="w-72 bg-gray-50 border rounded-lg p-4 flex flex-col">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Notice Channels
                  </h4>
                  <EmployeeSearch value={search} onChange={setSearch} />
                  <div className="mt-3 space-y-1 overflow-y-auto flex-1">
                    {filteredNoticeChannels.map((ch) => (
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
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">
                      {activeChannel?.name || "Select a channel"}
                    </h3>
                  </div>
                  <NoticeChatList
                    messages={messages[activeChannel?._id] || []}
                    socket={socket} // ← ADD THIS
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
                {/* Private Chats Sidebar */}
                <div className="w-72 bg-gray-50 border rounded-lg p-4 flex flex-col">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Private Chats
                  </h4>
                  <EmployeeSearch value={search} onChange={setSearch} />

                  <div className="mt-3 space-y-1 overflow-y-auto flex-1">
                    {employees
                      .filter((emp) =>
                        `${emp.firstName} ${emp.lastName}`
                          .toLowerCase()
                          .includes(search.toLowerCase())
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
                </div>

                {/* Private Chat Area */}
                <div className="flex-1 flex flex-col bg-white border rounded-lg overflow-hidden">
                  {activeChannel ? (
                    <>
                      <div className="p-4 border-b">
                        <h3 className="font-semibold">
                          {activeChannel.name || "Private Chat"}
                        </h3>
                      </div>
                      <NoticeChatList
                        messages={messages[activeChannel?._id] || []}
                        socket={socket} // ← ADD THIS
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
                      Select or start a private chat
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
