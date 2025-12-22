import React, { useState } from "react";
import MeetingHeader from "./components/meeting/MeetingHeader";
import MeetingForm from "./components/meeting/MeetingForm";
import ParticipantsPanel from "./components/meeting/ParticipantsPanel";

const CreateMeetings = () => {
  const [meetingData, setMeetingData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    meetingType: "",
    locationType: "",
    meetingLink: "",
    location: "",
  });

  const [participants, setParticipants] = useState([]);

  // Handles form field updates
  const handleMeetingChange = (field, value) => {
    setMeetingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add participant
  const handleAddParticipant = (email) => {
    setParticipants((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: email,
        role: "Developer",
        avatar: email.substring(0, 2).toUpperCase(),
      },
    ]);
  };

  //  Remove participant
  const handleRemoveParticipant = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  //  Convert form data → calendar meeting
  const buildCalendarMeeting = () => {
    const start = `${meetingData.date}T${meetingData.time}`;

    const endDate = new Date(start);
    endDate.setMinutes(
      endDate.getMinutes() + Number(meetingData.duration || 0)
    );

    return {
      id: Date.now(),
      title: meetingData.title,
      start,
      end: endDate.toISOString(),
      meetingType: meetingData.meetingType,
      locationType: meetingData.locationType,
      meetingLink: meetingData.meetingLink,
      location: meetingData.location,
      participants,
    };
  };

  //  Submit meeting
  const handleSubmit = () => {
    if (!meetingData.title || !meetingData.date || !meetingData.time) {
      alert("Please fill required fields");
      return;
    }

    const newMeeting = buildCalendarMeeting();

    const storedMeetings =
      JSON.parse(localStorage.getItem("meetings")) || [];

    localStorage.setItem(
      "meetings",
      JSON.stringify([...storedMeetings, newMeeting])
    );

    alert("Meeting created successfully!");

    // Optional: reset form
    setMeetingData({
      title: "",
      date: "",
      time: "",
      duration: "",
      meetingType: "",
      locationType: "",
      meetingLink: "",
      location: "",
    });
    setParticipants([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <MeetingHeader
          title="Schedule Meeting"
          subtitle="Plan and organize team meetings"
          submitLabel="Create Schedule Meeting"
          onSubmit={handleSubmit}
          onCancel={() => console.log("Cancelled")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <MeetingForm
              meetingData={meetingData}
              onChange={handleMeetingChange}
            />
          </div>

          <ParticipantsPanel
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMeetings;
