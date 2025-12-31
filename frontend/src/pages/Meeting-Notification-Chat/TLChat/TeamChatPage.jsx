import { useState } from "react";
import { users, initialRooms } from "../../../data/dummyChatData";
import TeamSidebar from "../../../components/chat/tlchat/TeamSidebar";
import ChatRoom from "../../../components/chat/tlchat/ChatRoom";

const CURRENT_USER_ID = 2; // TL (Nimal)

export default function TeamChatPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState(initialRooms[0].id);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  // 💬 SEND MESSAGE
  const sendMessage = (text) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoomId
          ? {
              ...r,
              messages: [
                ...r.messages,
                {
                  id: Date.now(),
                  userId: CURRENT_USER_ID,
                  text,
                },
              ],
            }
          : r
      )
    );
  };

  // 📩 START OR OPEN DM
  const startDM = (user) => {
    const existing = rooms.find(
      (r) =>
        r.type === "dm" &&
        r.members.includes(CURRENT_USER_ID) &&
        r.members.includes(user.id)
    );

    if (existing) {
      setActiveRoomId(existing.id);
      return;
    }

    const newRoom = {
      id: `dm-${CURRENT_USER_ID}-${user.id}`,
      name: user.name,
      type: "dm",
      members: [CURRENT_USER_ID, user.id],
      messages: [],
    };

    setRooms((prev) => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);
  };

  return (
    <div className="flex h-[80vh] border rounded-xl overflow-hidden">
      <TeamSidebar
        rooms={rooms}
        users={users}
        activeRoomId={activeRoomId}
        setActiveRoomId={setActiveRoomId}
        onStartDM={startDM}
      />

      <ChatRoom room={activeRoom} users={users} onSend={sendMessage} />
    </div>
  );
}
