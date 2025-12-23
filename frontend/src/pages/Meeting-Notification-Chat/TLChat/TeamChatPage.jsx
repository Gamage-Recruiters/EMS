import { useState } from "react";
import { initialRooms, users } from "../../../data/dummyChatData";
import TeamSidebar from "../../../components/chat/tlchat/TeamSidebar";
import ChatRoom from "../../../components/chat/tlchat/ChatRoom";
import UserManager from "../../../components/chat/tlchat/UserManager";
import CreateChannelModal from "../../../components/chat/tlchat/CreateChannelModal";

export default function TeamChatPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState(initialRooms[0].id);
  const [showCreate, setShowCreate] = useState(false);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  const sendMessage = (text) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoomId
          ? {
              ...r,
              messages: [...r.messages, { id: Date.now(), userId: 1, text }],
            }
          : r
      )
    );
  };

  const createChannel = (channel) => {
    setRooms((prev) => [...prev, channel]);
    setActiveRoomId(channel.id);
  };

  return (
    <>
      <div className="flex h-[80vh] bg-[#F7FAFC] rounded-xl border border-[#E0E0E0]">
        <TeamSidebar
          rooms={rooms}
          activeRoomId={activeRoomId}
          setActiveRoomId={setActiveRoomId}
          onCreateTeam={() => setShowCreate(true)}
        />

        <ChatRoom room={activeRoom} users={users} onSend={sendMessage} />

        <UserManager room={activeRoom} users={users} setRooms={setRooms} />
      </div>

      {showCreate && (
        <CreateChannelModal
          users={users}
          onCreate={createChannel}
          onClose={() => setShowCreate(false)}
        />
      )}
    </>
  );
}
