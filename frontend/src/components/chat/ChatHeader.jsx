import { Hash } from "lucide-react";

export default function ChatHeader({ channel }) {
  return (
    <div className="h-14 bg-[#FFFFFF] border-b border-[#E0E0E0] flex items-center px-5">
      <Hash size={16} className="text-[#7A7A7A] mr-2" />
      <span className="font-semibold text-[#1F1F1F]">{channel.name}</span>
    </div>
  );
}
