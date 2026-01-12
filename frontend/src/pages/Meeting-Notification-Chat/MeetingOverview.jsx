import React, { useEffect, useState } from "react";
//import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus, X } from "lucide-react";
import MeetingTabs from "../../components/meeting/MeetingTabs";
import ParticipantsPanel from "../../components/meeting/ParticipantsPanel";
import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";

import {
  getAllMeetings,
  cancelMeeting,
  rescheduleMeeting,
  getMyMeetings
} from "../../services/meetingService";

const MeetingOverview = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [editParticipants, setEditParticipants] = useState([]);
  const { user } = useAuth(); // user.role

  //  DURATION 
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

  //  FETCH MEETINGS 
  const fetchMeetings = async () => {
  try {
    setLoading(true);
     const res =
    user.role === "Developer"
      ? await getMyMeetings()
      : await getAllMeetings();

    const formattedEvents = res.data.data.map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      start: `${meeting.date.split("T")[0]}T${meeting.time}`,
      end: calculateEndTime(
        meeting.date,
        meeting.time,
        meeting.duration
      ),
      backgroundColor:
        meeting.status === "Cancelled" ? "#ef4444" : "#6366f1",
      borderColor:
        meeting.status === "Cancelled" ? "#ef4444" : "#6366f1",
      textColor: "#ffffff",
      extendedProps: meeting,
    }));

    setEvents(formattedEvents);
  } catch (error) {
    console.error(error);
    alert("Failed to load meetings");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMeetings();
  }, []);

  //  EVENT CLICK 
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
     //  LOAD EXISTING PARTICIPANTS
  setEditParticipants(
    meeting.participants.map((p) => ({
      email: p.user.email, 
    }))
  );
  };

  //  EDIT MEETING
  const handleEditMeeting = async () => {
  try {
    setLoading(true);

    await rescheduleMeeting(selectedMeeting.id, {
      title: editData.title,
      date: new Date(editData.date),
      time: editData.time,
      duration: editData.duration,
      meetingLink: editData.meetingLink,
      participants: editParticipants.map((p) => p.email),
    });

    alert("Meeting updated successfully");
    setSelectedMeeting(null);
    fetchMeetings();
  } catch (error) {
    console.error("Edit meeting error:", error);
    alert("Failed to update meeting");
  } finally {
    setLoading(false);
  }
};


  //  CANCEL MEETING 
  const handleCancelMeeting = async () => {
  if (!window.confirm("Cancel this meeting?")) return;

  try {
    setLoading(true);

    await cancelMeeting(selectedMeeting.id);

    alert("Meeting cancelled");
    setSelectedMeeting(null);
    fetchMeetings();
  } catch (error) {
    console.error("Cancel meeting error:", error);
    alert("Failed to cancel meeting");
  } finally {
    setLoading(false);
  }
};

  //  FILTER EVENTS 
  const filteredEvents = events.filter((event) => {
    const meeting = event.extendedProps;
    const now = new Date();
    const meetingDate = new Date(event.start);

    if (activeTab === "All") return true;
    if (activeTab === "Upcoming")
      return meetingDate > now && meeting.status !== "Cancelled";
    if (activeTab === "Past")
      return meetingDate < now && meeting.status !== "Cancelled";
    if (activeTab === "Cancelled")
      return meeting.status === "Cancelled";

    return true;
  });

 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Schedule Meeting Overview</h1>
            <p className="text-sm text-gray-500">
              Plan and organize team meetings
            </p>
          </div>

          <button
            onClick={() => navigate("/meetings/create")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
          >
            <Plus size={18} />
            Schedule Meeting
          </button>
        </div>

        {/* TABS */}
        <MeetingTabs active={activeTab} setActive={setActiveTab} />

        {/* CALENDAR */}
        <div className="bg-white rounded-xl shadow p-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading meetings...
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* EDIT / CANCEL  */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Edit Meeting</h2>
              <button onClick={() => setSelectedMeeting(null)}>
                <X />
              </button>
            </div>

            <input
              className="w-full border p-2 rounded"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              placeholder="Title"
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
              placeholder="Duration (30 mins / 1 hour)"
            />

            {selectedMeeting.locationType === "online" && (
              <input
                className="w-full border p-2 rounded"
                value={editData.meetingLink}
                onChange={(e) =>
                  setEditData({ ...editData, meetingLink: e.target.value })
                }
                placeholder="Meeting Link"
              />
            )}

            {/* PARTICIPANTS EDIT */}
            <ParticipantsPanel
              participants={editParticipants}
              onAddParticipant={(email) =>
                setEditParticipants([...editParticipants, { email }])
              }
              onRemoveParticipant={(email) =>
                setEditParticipants(
                  editParticipants.filter((p) => p.email !== email)
                )
              }
            />

            <div className="flex justify-between pt-4">
              <button
                onClick={handleCancelMeeting}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel Meeting
              </button>

              <button
                onClick={handleEditMeeting}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingOverview;
