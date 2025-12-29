import { useState } from "react";

export default function Meetings() {
  const [meetings, setMeetings] = useState([
    { id: 1, title: "Project Sync", date: "2025-12-10", time: "10:00 AM" },
    { id: 2, title: "Client Demo", date: "2025-12-12", time: "02:00 PM" },
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
  });

  const addMeeting = () => {
    setMeetings([...meetings, { id: Date.now(), ...newMeeting }]);
    setNewMeeting({ title: "", date: "", time: "" });
  };

  const deleteMeeting = (id) => {
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 max-w-lg mx-auto">
      <h2 className="font-bold text-lg mb-3">🗓 Meetings</h2>

      {/* FORM */}
      <div className="space-y-2 mb-4">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={newMeeting.title}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, title: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2 w-full"
          value={newMeeting.date}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, date: e.target.value })
          }
        />
        <input
          type="time"
          className="border p-2 w-full"
          value={newMeeting.time}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, time: e.target.value })
          }
        />
        <button
          onClick={addMeeting}
          className="bg-blue-500 text-white px-3 py-2 rounded w-full"
        >
          Add Meeting
        </button>
      </div>

      {/* LIST */}
      <ul className="space-y-2">
        {meetings.map((m) => (
          <li key={m.id} className="border p-3 rounded flex justify-between">
            <div>
              <p className="font-bold">{m.title}</p>
              <p className="text-sm text-gray-500">
                {m.date} • {m.time}
              </p>
            </div>
            <button
              onClick={() => deleteMeeting(m.id)}
              className="text-red-500 font-bold"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
