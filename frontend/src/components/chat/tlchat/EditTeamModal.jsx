import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";

export default function EditTeamModal({
  channel, // use 'channel' for consistency
  users,
  onUpdate,
  onDelete,
  onClose,
}) {
  // If channel isn't yet available, don't try to read properties
  const [name, setName] = useState(channel?.name || "");
  const [members, setMembers] = useState(
    channel?.members?.map((m) => m._id) || []
  );

  // If the channel prop changes (e.g., opening a new modal), update state
  useEffect(() => {
    setName(channel?.name || "");
    setMembers(channel?.members?.map((m) => m._id) || []);
  }, [channel]);

  const toggleUser = (id) => {
    setMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const save = async () => {
    if (!channel) return; // safety check

    try {
      const res = await api.put(`/chat/channels/${channel._id}`, {
        name,
        memberIds: members,
      });

      toast.success("Channel updated");
      onUpdate(res.data.channel);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update channel");
    }
  };

  const remove = async () => {
    if (!channel) return; // safety check

    try {
      await api.delete(`/chat/channels/${channel._id}`);
      toast.success("Channel deleted");
      onDelete(channel._id);
      onClose();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // If channel is not yet loaded, don't render the modal
  if (!channel) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4">Edit Team</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        <div className="max-h-40 overflow-y-auto border rounded p-2 mb-3">
          {users?.map((u) => (
            <div key={u._id} className="flex justify-between mb-1">
              <span>
                {u.firstName} {u.lastName}
              </span>
              <input
                type="checkbox"
                checked={members.includes(u._id)}
                onChange={() => toggleUser(u._id)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={remove} className="text-red-500">
            Delete
          </button>

          <div className="flex gap-2">
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={save}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
