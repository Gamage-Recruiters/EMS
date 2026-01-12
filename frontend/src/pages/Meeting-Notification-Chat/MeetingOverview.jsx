import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import MeetingTabs from "../../components/meeting/MeetingTabs";
import { useAuth } from "../../context/AuthContext";

import {
  getAllMeetings,
  cancelMeeting,
  rescheduleMeeting,
  getMyMeetings,
} from "../../services/meetingService";

const MeetingOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState("All");

  /* ================= TIME HELPERS ================= */
  const getDurationInMinutes = (duration) => {
    if (!duration) return 30;
    const value = parseInt(duration);
    if (isNaN(value)) return 30;
    return duration.toLowerCase().includes("hour") ? value * 60 : value;
  };

  const calculateEndTime = (date, time, duration) => {
    const start = new Date(`${date.split("T")[0]}T${time}`);
    start.setMinutes(start.getMinutes() + getDurationInMinutes(duration));
    return start.toISOString();
  };

  /* ================= FETCH MEETINGS ================= */
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res =
        user.role === "Developer"
          ? await getMyMeetings()
          : await getAllMeetings();

      const formatted = res.data.data.map((m) => ({
        id: m._id,
        title: m.title,
        start: `${m.date.split("T")[0]}T${m.time}`,
        end: calculateEndTime(m.date, m.time, m.duration),
        backgroundColor: m.status === "Cancelled" ? "#ef4444" : "#6366f1",
        borderColor: m.status === "Cancelled" ? "#ef4444" : "#6366f1",
        textColor: "#fff",
        extendedProps: m,
      }));

      setEvents(formatted);
    } catch {
      alert("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  /* ================= EVENT CLICK ================= */
  const handleEventClick = (info) => {
    const meeting = info.event.extendedProps;

    setSelectedMeeting(meeting);
    setEditData({
      title: meeting.title,
      date: meeting.date.split("T")[0],
      time: meeting.time,
      duration: meeting.duration,
      meetingLink: meeting.meetingLink || "",
    });
  };

  /* ================= EDIT ================= */
  const handleEditMeeting = async () => {
    try {
      setLoading(true);
      await rescheduleMeeting(selectedMeeting._id, {
        title: editData.title,
        date: new Date(editData.date),
        time: editData.time,
        duration: editData.duration,
        meetingLink: editData.meetingLink,
      });
      alert("Meeting updated");
      setShowEdit(false);
      setSelectedMeeting(null);
      fetchMeetings();
    } catch {
      alert("Failed to update meeting");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const handleCancelMeeting = async () => {
    if (!window.confirm("Cancel this meeting?")) return;
    try {
      setLoading(true);
      await cancelMeeting(selectedMeeting._id);
      alert("Meeting cancelled");
      setSelectedMeeting(null);
      fetchMeetings();
    } catch {
      alert("Failed to cancel meeting");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredEvents = events.filter((e) => {
    const m = e.extendedProps;
    const now = new Date();
    const d = new Date(e.start);

    if (activeTab === "All") return true;
    if (activeTab === "Upcoming") return d > now && m.status !== "Cancelled";
    if (activeTab === "Past") return d < now && m.status !== "Cancelled";
    if (activeTab === "Cancelled") return m.status === "Cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Meeting Overview</h1>
            <p className="text-sm text-gray-500">View scheduled meetings</p>
          </div>

          {["PM", "TL", "CEO"].includes(user.role) && (
            <button
              onClick={() => navigate("/meetings/create")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Schedule
            </button>
          )}
        </div>

        <MeetingTabs active={activeTab} setActive={setActiveTab} />

        <div className="bg-white rounded-xl shadow p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={filteredEvents}
            eventClick={handleEventClick}
            height="80vh"
            nowIndicator
          />
        </div>
      </div>

      {/* ================= VIEW MODAL (ALL ROLES) ================= */}
      {selectedMeeting && !showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{selectedMeeting.title}</h2>
              <button onClick={() => setSelectedMeeting(null)}>
                <X />
              </button>
            </div>

            <div className="text-sm space-y-1 text-gray-700">
              <p>
                <b>Date:</b> {new Date(selectedMeeting.date).toDateString()}
              </p>
              <p>
                <b>Time:</b> {selectedMeeting.time}
              </p>
              <p>
                <b>Duration:</b> {selectedMeeting.duration}
              </p>
              <p>
                <b>Type:</b> {selectedMeeting.meetingType}
              </p>
              <p>
                <b>Location:</b> {selectedMeeting.locationType}
              </p>
              {selectedMeeting.meetingLink && (
                <p>
                  <b>Link:</b>{" "}
                  <a
                    href={selectedMeeting.meetingLink}
                    className="text-blue-600 underline"
                    target="_blank"
                  >
                    Join Meeting
                  </a>
                </p>
              )}
            </div>

            <div>
              <p className="font-medium mb-1">Participants</p>
              <ul className="text-sm text-gray-600 list-disc ml-5">
                {selectedMeeting.participants.map((p) => (
                  <li key={p.user._id}>
                    {p.user.firstName} {p.user.lastName} ({p.user.role})
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTIONS */}
            {["PM", "TL", "CEO"].includes(user.role) && (
              <div className="flex justify-between pt-4">
                <button
                  onClick={handleCancelMeeting}
                  className="text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Cancel
                </button>

                <button
                  onClick={() => setShowEdit(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-1"
                >
                  <Edit size={16} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL (PM / TL / CEO) ================= */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Edit Meeting</h2>

            <input
              className="w-full border p-2 rounded"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="border p-2 rounded"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
              />
              <input
                type="time"
                className="border p-2 rounded"
                value={editData.time}
                onChange={(e) =>
                  setEditData({ ...editData, time: e.target.value })
                }
              />
            </div>

            <input
              className="w-full border p-2 rounded"
              value={editData.duration}
              onChange={(e) =>
                setEditData({ ...editData, duration: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEdit(false)}>Back</button>
              <button
                onClick={handleEditMeeting}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingOverview;
