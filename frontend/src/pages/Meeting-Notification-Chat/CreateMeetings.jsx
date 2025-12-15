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

   const handleMeetingChange = (field, value) => {
    setMeetingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddParticipant = (email) => {
    setParticipants([
      ...participants,
      {
        id: participants.length + 1,
        name: email,
        role: "Developer",
        avatar: email.substring(0, 2).toUpperCase(),
      },
    ]);
  };

  const handleRemoveParticipant = (id) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    console.log(meetingData, participants);
    alert("Meeting created!");
  };

   return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <MeetingHeader
          title="Schedule Meeting"
          subtitle="Plan and organize team meetings"
          submitLabel="Create Schedule Meeting"
          onSubmit={handleSubmit}
          onCancel={() => console.log("cancel")}
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
