import { useState, useEffect, useRef } from "react";
import { getSocket, initializeSocket } from "../../../components/chat/socket"; // assume initializeSocket is exported
import api from "../../../api/api";
import CEOTabs from "../../../components/chat/ceo/CEOTabs";
import NoticeChatComposer from "../../../components/chat/ceo/NoticeChatComposer";
import NoticeChatList from "../../../components/chat/ceo/NoticeChatList";
import EmployeeSearch from "../../../components/chat/ceo/EmployeeSearch";
import { Loader2 } from "lucide-react";

export default function CEOChatUI() {
  const [tab, setTab] = useState("Send Notice");
  const [allChannels, setAllChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channelLoading, setChannelLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  const socketRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Force socket re-initialization on mount / token change
  useEffect(() => {
    // Get or create socket with current token
    const socket = getSocket(); // this should now use latest token
    socketRef.current = socket;

    // Wait for socket to be connected/authenticated
    const onConnect = () => {
      console.log("Socket connected & authenticated");
      setSocketReady(true);
    };

    const onConnectError = (err) => {
      console.error("Socket connection error:", err.message);
      setSocketReady(false);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);

    // Force connect if not already
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
    };
  }, [currentUser?.token]); // re-run if token changes (after login)

  // Load initial data only when socket is ready
  useEffect(() => {
    if (!socketReady) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // Channels
        const channelsRes = await api.get("/chat/channels");
        const channels = channelsRes.data.channels || [];
        setAllChannels(channels);

        // Employees
        const empRes = await api.get("/chat/employees");
        setEmployees(empRes.data.employees || []);

        if (channels.length > 0 && !activeChannel) {
          setActiveChannel(channels[0]);
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [socketReady, activeChannel]);

  // Load messages when active channel changes
  useEffect(() => {
    if (!activeChannel?._id || !socketReady || !socketRef.current?.connected)
      return;

    setChannelLoading(true);

    socketRef.current.emit(
      "messages:get",
      { channelId: activeChannel._id, limit: 50, skip: 0 },
      (res) => {
        setChannelLoading(false);
        if (res?.success) {
          setMessages((prev) => ({
            ...prev,
            [activeChannel._id]: res.messages?.reverse() || [],
          }));
        } else {
          console.error("Failed to load messages:", res?.error);
        }
      },
    );
  }, [activeChannel?._id, socketReady]);

  // Real-time listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socketReady) return;

    const handleNewMessage = (newMsg) => {
      setMessages((prev) => ({
        ...prev,
        [newMsg.channelId]: [...(prev[newMsg.channelId] || []), newMsg],
      }));
    };

    const handleEdited = (updatedMsg) => {
      setMessages((prev) => ({
        ...prev,
        [updatedMsg.channelId]:
          prev[updatedMsg.channelId]?.map((m) =>
            m._id === updatedMsg._id ? updatedMsg : m,
          ) || [],
      }));
    };

    const handleDeleted = ({ messageId, channelId }) => {
      setMessages((prev) => ({
        ...prev,
        [channelId]: prev[channelId]?.filter((m) => m._id !== messageId) || [],
      }));
    };

    const handleNewChannel = (newChannel) => {
      setAllChannels((prev) => {
        if (prev.some((ch) => ch._id === newChannel._id)) return prev;
        return [...prev, newChannel];
      });
      if (!activeChannel) setActiveChannel(newChannel);
    };

    socket.on("message:new", handleNewMessage);
    socket.on("notice:new", handleNewMessage);
    socket.on("message:edited", handleEdited);
    socket.on("message:deleted", handleDeleted);
    socket.on("channel:new", handleNewChannel);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("notice:new", handleNewMessage);
      socket.off("message:edited", handleEdited);
      socket.off("message:deleted", handleDeleted);
      socket.off("channel:new", handleNewChannel);
    };
  }, [socketReady, activeChannel]);

  // Filter & group channels
  const filteredChannels = allChannels.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase()),
  );

  const noticeChannels = filteredChannels.filter((ch) => ch.type === "notice");
  const teamChannels = filteredChannels.filter((ch) => ch.type === "regular");
  const privateChannels = filteredChannels.filter(
    (ch) => ch.type === "private",
  );

  const startPrivateChat = (employee) => {
    if (!socketRef.current?.connected) {
      alert("Chat connection not ready. Please refresh.");
      return;
    }

    socketRef.current.emit(
      "private:create",
      { recipientId: employee._id },
      (res) => {
        if (!res?.success) {
          alert(res?.error || "Failed to start private chat");
          return;
        }

        const newChannel = res.channel;

        setAllChannels((prev) => {
          if (prev.some((ch) => ch._id === newChannel._id)) return prev;
          return [...prev, newChannel];
        });

        setActiveChannel(newChannel);
        setTab("Private Messages");
        setSearch("");
      },
    );
  };

  const sendNoticeMessage = (text) => {
    if (!activeChannel?._id || !text.trim() || !socketRef.current?.connected)
      return;

    const optimisticMsg = {
      _id: `temp-notice-${Date.now()}`,
      channelId: activeChannel._id,
      userId: currentUser,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      isEdited: false,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannel._id]: [...(prev[activeChannel._id] || []), optimisticMsg],
    }));

    socketRef.current.emit("notice:send", {
      channelId: activeChannel._id,
      text: text.trim(),
    });
  };

  const sendRegularMessage = (text) => {
    if (!activeChannel?._id || !text.trim() || !socketRef.current?.connected)
      return;

    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      channelId: activeChannel._id,
      userId: currentUser,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      isEdited: false,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannel._id]: [...(prev[activeChannel._id] || []), optimisticMsg],
    }));

    socketRef.current.emit("message:send", {
      channelId: activeChannel._id,
      text: text.trim(),
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mr-2" size={20} />
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

            <div className="flex-1 flex flex-col bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">
                  {activeChannel?.name || "Select a notice channel"}
                </h3>
              </div>

              {channelLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : (
                <NoticeChatList
                  messages={messages[activeChannel?._id] || []}
                  socket={socketRef.current}
                />
              )}

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
            <div className="w-80 bg-gray-50 border rounded-lg p-4 flex flex-col">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Messages & Team
              </h4>
              <EmployeeSearch value={search} onChange={setSearch} />

              <div className="mt-4 space-y-4 overflow-y-auto flex-1">
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

            <div className="flex-1 flex flex-col bg-white border rounded-lg overflow-hidden">
              {activeChannel ? (
                <>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">
                      {activeChannel.name || "Chat"}
                    </h3>
                  </div>

                  {channelLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                  ) : (
                    <NoticeChatList
                      messages={messages[activeChannel._id] || []}
                      socket={socketRef.current}
                    />
                  )}

                  <NoticeChatComposer
                    activeRoom={activeChannel}
                    onSend={sendRegularMessage}
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
