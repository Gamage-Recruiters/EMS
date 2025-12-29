export default function ChatHeader({ room }) {
  const icon =
    room.type === "team" ? "#" : room.type === "notice" ? "📢" : "🚨";

  return (
    <div className="h-14 px-4 flex items-center gap-2 bg-[#FFFFFF] border-b border-[#E0E0E0]">
      <span className="text-[#7A7A7A]">{icon}</span>
      <span className="font-semibold text-[#1F1F1F]">{room.name}</span>
    </div>
  );
}
