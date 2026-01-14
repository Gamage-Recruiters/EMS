import { useState } from "react";
import {
  developers,
  noticeRooms,
  initialNoticeChats,
} from "../../../data/ceoDummyData";

import CEOTabs from "../../../components/chat/ceo/CEOTabs";
import NoticeChatComposer from "../../../components/chat/ceo/NoticeChatComposer";
import NoticeChatList from "../../../components/chat/ceo/NoticeChatList";
import EmployeeSearch from "../../../components/chat/ceo/EmployeeSearch";

export default function CEOChatUI() {
  const [tab, setTab] = useState("Send Notice");
  const [activeNoticeRoom, setActiveNoticeRoom] = useState(noticeRooms[0]);
  const [noticeChats, setNoticeChats] = useState(initialNoticeChats);
  const [search, setSearch] = useState("");

  /* ===============================
     FILTER ROOMS (External Search)
  ================================ */
  const filteredRooms = noticeRooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ===============================
     SEND MESSAGE HANDLER
  ================================ */
  const sendNoticeMessage = (roomId, message) => {
    setNoticeChats((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), message],
    }));
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
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setActiveNoticeRoom(room)}
                    className={`
                      px-3 py-2 rounded cursor-pointer text-sm
                      ${
                        activeNoticeRoom.id === room.id
                          ? "bg-[#F0F0F0] font-semibold text-[#1F1F1F]"
                          : "hover:bg-[#F0F0F0] text-[#4D4D4D]"
                      }
                    `}
                  >
                    {room.name}
                  </div>
                ))}
              </div>
            </div>

            {/* ===============================
                CHAT PANEL
            ================================ */}
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg overflow-hidden">
              {/* HEADER */}
              <div className="p-4 border-b border-[#E0E0E0]">
                <h3 className="text-[#1F1F1F] font-semibold">
                  {activeNoticeRoom.name}
                </h3>
                <p className="text-xs text-[#7A7A7A]">
                  Official notices sent by the CEO
                </p>
              </div>

              {/* MESSAGE LIST */}
              <NoticeChatList
                messages={noticeChats[activeNoticeRoom.id] || []}
              />

              {/* COMPOSER */}
              <NoticeChatComposer
                activeRoom={activeNoticeRoom}
                onSend={sendNoticeMessage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
