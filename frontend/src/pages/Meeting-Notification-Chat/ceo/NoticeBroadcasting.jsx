import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import chatService from "../../../services/chatService";
import CEOTabs from "../../../components/chat/ceo/CEOTabs";
import NoticeChatComposer from "../../../components/chat/ceo/NoticeChatComposer";
import NoticeChatList from "../../../components/chat/ceo/NoticeChatList";
import EmployeeSearch from "../../../components/chat/ceo/EmployeeSearch";

export default function NoticeBroadcasting() {
  const [tab, setTab] = useState("Send Notice");
  const [rooms, setRooms] = useState([]);
  const [activeNoticeRoom, setActiveNoticeRoom] = useState(null);
  const [noticeChats, setNoticeChats] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     FETCH ROOMS (Channels)
  ================================ */
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await chatService.getChannels();
      const allChannels = res.data.channels || [];
      // Filter for notice channels only for this view
      const noticeChannels = allChannels.filter(c => c.type === "notice");
      setRooms(noticeChannels);
      if (noticeChannels.length > 0 && !activeNoticeRoom) {
        setActiveNoticeRoom(noticeChannels[0]);
      }
    } catch (err) {
      toast.error("Failed to load notice channels");
    } finally {
      setLoading(false);
    }
  }, [activeNoticeRoom]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  /* ===============================
     FETCH MESSAGES
  ================================ */
  const fetchMessages = useCallback(async (roomId) => {
    if (!roomId) return;
    try {
      const res = await chatService.getMessages(roomId);
      const messages = res.data.messages || [];
      
      const formattedMessages = messages.map(m => ({
        id: m._id,
        sender: `${m.userId?.firstName || ""} ${m.userId?.lastName || ""}`.trim() || "CEO",
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setNoticeChats((prev) => ({
        ...prev,
        [roomId]: formattedMessages,
      }));
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  }, []);

  useEffect(() => {
    if (activeNoticeRoom) {
      fetchMessages(activeNoticeRoom._id);
    }
  }, [activeNoticeRoom, fetchMessages]);

  /* ===============================
     FILTER ROOMS (External Search)
  ================================ */
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ===============================
     SEND MESSAGE HANDLER
  ================================ */
  const sendNoticeMessage = async (roomId, messageObj) => {
    try {
      // Persist to backend
      await chatService.sendNotice({
        channelId: roomId,
        text: messageObj.text
      });

      // Optimistic update or just re-fetch
      fetchMessages(roomId);
      toast.success("Notice sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send notice");
    }
  };

  return (
    <div className="h-[90vh] max-w-7xl mx-auto bg-[#F7FAFC] border border-[#E0E0E0] rounded-xl flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <CEOTabs tab={tab} setTab={setTab} />

        {tab === "Send Notice" && (
          <div className="flex flex-1 p-5 gap-4 overflow-hidden">
            {/* ===============================
                LEFT SIDEBAR (Discord Style)
            ================================ */}
            <div className="w-72 bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-3 flex flex-col">
              <h4 className="text-xs font-semibold text-[#7A7A7A] uppercase mb-2">
                Notice Channels
              </h4>

              <EmployeeSearch value={search} onChange={setSearch} />

              <div className="space-y-1 overflow-y-auto mt-2">
                {loading ? (
                  <div className="space-y-2 p-1 animate-pulse">
                    <div className="h-9 bg-[#F0F0F0] rounded w-full"></div>
                    <div className="h-9 bg-[#F0F0F0] rounded w-5/6"></div>
                    <div className="h-9 bg-[#F0F0F0] rounded w-full"></div>
                    <div className="h-9 bg-[#F0F0F0] rounded w-4/5"></div>
                    <div className="h-9 bg-[#F0F0F0] rounded w-11/12"></div>
                  </div>
                ) : filteredRooms.length === 0 ? (
                  <p className="text-xs text-center p-4 text-gray-400">No channels found</p>
                ) : (
                  filteredRooms.map((room) => (
                    <div
                      key={room._id}
                      onClick={() => setActiveNoticeRoom(room)}
                      className={`
                        px-3 py-2 rounded cursor-pointer text-sm transition-colors duration-200
                        ${
                          activeNoticeRoom?._id === room._id
                            ? "bg-[#F0F0F0] font-semibold text-[#1F1F1F]"
                            : "hover:bg-[#F0F0F0] text-[#4D4D4D]"
                        }
                      `}
                    >
                      {room.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ===============================
                CHAT PANEL
            ================================ */}
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg overflow-hidden">
              {/* HEADER */}
              <div className="p-4 border-b border-[#E0E0E0]">
                <h3 className="text-[#1F1F1F] font-semibold">
                  {activeNoticeRoom?.name || "Select a channel"}
                </h3>
                <p className="text-xs text-[#7A7A7A]">
                  Official notices sent by the CEO
                </p>
              </div>

              {/* MESSAGE LIST */}
              <NoticeChatList
                messages={activeNoticeRoom ? (noticeChats[activeNoticeRoom._id] || []) : []}
              />

              {/* COMPOSER */}
              {activeNoticeRoom && (
                <NoticeChatComposer
                  activeRoom={activeNoticeRoom}
                  onSend={(id, msg) => sendNoticeMessage(activeNoticeRoom._id, msg)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
