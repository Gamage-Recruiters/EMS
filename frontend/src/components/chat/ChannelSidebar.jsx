import { Hash } from "lucide-react";

export default function ChannelSidebar({
  channels,
  activeChannel,
  setActiveChannel,
}) {
  return (
    <div className="w-64 bg-[#FFFFFF] border-r border-[#E0E0E0] p-4">
      <h2 className="text-xs font-semibold text-[#4D4D4D] mb-4 uppercase">
        Text Channels
      </h2>

      {channels.map((channel) => (
        <div
          key={channel.id}
          onClick={() => setActiveChannel(channel)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm
            ${
              activeChannel.id === channel.id
                ? "bg-[#F0F0F0] text-[#1F1F1F] font-medium"
                : "text-[#4D4D4D] hover:bg-[#F0F0F0]"
            }`}
        >
          <Hash size={14} />
          {channel.name}
        </div>
      ))}
    </div>
  );
}
