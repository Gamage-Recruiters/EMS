import React, { useState } from "react";
import { X } from "lucide-react";

const ParticipantsPanel = ({ participants, onAddParticipant, onRemoveParticipant }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Participants</h2>

      <p className="text-gray-600 text-sm mb-2">Developers</p>

      <div className="space-y-3 mb-6">
        {participants.map((dev) => (
          <div key={dev.id} className="flex items-center justify-between p-3 border rounded-xl bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {dev.avatar}
              </div>
              <div>
                <p className="font-medium">{dev.name}</p>
                <p className="text-gray-500 text-sm">{dev.role}</p>
              </div>
            </div>

            <button onClick={() => onRemoveParticipant(dev.id)}>
              <X size={20} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-sm">Developer Participants</p>

      <input
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white shadow-sm text-gray-700 mt-2 focus:ring-2 focus:ring-blue-500"
        placeholder="Add developer email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 mt-3 w-full"
        onClick={() => {
          if (email.trim() !== "") {
            onAddParticipant(email);
            setEmail("");
          }
        }}
      >
        + Add Developer Participant
      </button>
    </div>
  );
};

export default ParticipantsPanel;
