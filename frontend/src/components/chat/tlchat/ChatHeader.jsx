export default function ChatHeader({ room }) {
  const icon =
    room.type === "regular" ? "#" : room.type === "notice" ? "📢" : "💬";

  return (
    <div className="h-14 px-4 flex items-center gap-2 bg-white border-b">
      <span className="text-gray-500">{icon}</span>
      <span className="font-semibold">{room.name}</span>
    </div>
  );
}
