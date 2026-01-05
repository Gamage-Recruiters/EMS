import React, { useState } from "react";
import { X } from "lucide-react";

const ParticipantsPanel = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
}) => {
  const [email, setEmail] = useState("");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Participants</h2>

      {/* LIST */}
      <div className="space-y-3 mb-6">
        {participants.map((p) => (
          <div
            key={p.email}
            className="flex justify-between items-center p-3 border rounded-xl bg-gray-50"
          >
            <div>
              <p className="font-medium">{p.email}</p>
              <p className="text-sm text-gray-500">Developer</p>
            </div>

            <button onClick={() => onRemoveParticipant(p.email)}>
              <X size={18} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* ADD */}
      <input
        className="w-full px-4 py-2.5 rounded-xl border"
        placeholder="Add participant email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="mt-3 w-full border px-4 py-2 rounded-xl hover:bg-gray-100"
        onClick={() => {
          if (email.trim()) {
            onAddParticipant(email);
            setEmail("");
          }
        }}
      >
        + Add Participant
      </button>
    </div>
  );
};

export default ParticipantsPanel;
