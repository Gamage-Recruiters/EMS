import { useEffect, useState } from "react";
import api from "../../../api/api";
import socket from "../../../components/chat/socket";

import TeamSidebar from "../../../components/chat/tlchat/TeamSidebar";
import ChatRoom from "../../../components/chat/tlchat/ChatRoom";
import CreateChannelModal from "../../../components/chat/tlchat/CreateChannelModal";

export default function TeamChatPage() {
  const [channels, setChannels] = useState([]); // ALWAYS array
  const [users, setUsers] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  /* ----------------------------------
     LOAD INITIAL DATA
  ---------------------------------- */
  useEffect(() => {
    loadChannels();
    loadUsers();
  }, []);

  const loadChannels = async () => {
    try {
      const res = await api.get("/chat/channels");

      // Ensure channels is always an array
      const channelList = Array.isArray(res.data)
        ? res.data
        : res.data.channels || res.data.data || [];

      setChannels(channelList);

      if (!activeChannelId && channelList.length > 0) {
        setActiveChannelId(channelList[0]._id);
      }
    } catch (err) {
      console.error("Failed to load channels", err);
      setChannels([]); // fallback to empty array
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/user"); // now sends token automatically
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
    }
  };

  /* ----------------------------------
     SAFE ACTIVE CHANNEL
  ---------------------------------- */
  const activeChannel = channels.length
    ? channels.find((c) => c._id === activeChannelId) || null
    : null;

  /* ----------------------------------
     SOCKET EVENTS
  ---------------------------------- */
  useEffect(() => {
    socket.on("channel:new", (channel) => {
      setChannels((prev) => [...prev, channel]);
    });

    socket.on("channel:updated", (updated) => {
      setChannels((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      );
    });

    socket.on("channel:deleted", (channelId) => {
      setChannels((prev) => prev.filter((c) => c._id !== channelId));
      setActiveChannelId((prev) => (prev === channelId ? null : prev));
    });

    return () => {
      socket.off("channel:new");
      socket.off("channel:updated");
      socket.off("channel:deleted");
    };
  }, []);

  /* ----------------------------------
     CREATE CHANNEL
  ---------------------------------- */
  const createChannel = (data) => {
    socket.emit("channel:create", data, (res) => {
      if (!res?.success) {
        alert(res?.error || "Channel creation failed");
      }
      setShowCreate(false);
    });
  };

  /* ----------------------------------
     RENDER
  ---------------------------------- */
  return (
    <>
      <div className="flex h-[80vh] border rounded-xl overflow-hidden bg-white">
        <TeamSidebar
          channels={channels}
          users={users}
          activeId={activeChannelId}
          setActiveId={setActiveChannelId}
          onCreate={() => setShowCreate(true)}
        />

        {activeChannel ? (
          <ChatRoom channel={activeChannel} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a channel to start chatting
          </div>
        )}
      </div>

      {showCreate && (
        <CreateChannelModal
          isOpen={showCreate} // Pass the state
          users={users}
          currentUser={currentUser}
          onCreate={createChannel}
          onClose={() => setShowCreate(false)}
        />
      )}
    </>
  );
}
