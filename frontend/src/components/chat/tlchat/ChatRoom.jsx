import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatRoom({ room, users, onSend }) {
  if (!room) return null;

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAFC]">
      <ChatHeader room={room} />
      <MessageList messages={room.messages} users={users} />
      <MessageInput onSend={onSend} />
    </div>
  );
}
