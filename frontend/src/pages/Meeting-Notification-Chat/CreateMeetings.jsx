import React, { useState } from "react";
import axios from "axios";
import MeetingHeader from "../../components/meeting/MeetingHeader";
import MeetingForm from "../../components/meeting/MeetingForm";
import ParticipantsPanel from "../../components/meeting/ParticipantsPanel";

const CreateMeetings = () => {
  const [meetingData, setMeetingData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    meetingType: "",
    locationType: "",
    meetingLink: "",
  });

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  //  HANDLE FORM CHANGE 
  const handleMeetingChange = (field, value) => {
    setMeetingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //  ADD PARTICIPANT 
  const handleAddParticipant = (email) => {
    if (!email) return;

    // prevent duplicate
    if (participants.some((p) => p.email === email)) {
      alert("Participant already added");
      return;
    }

    setParticipants((prev) => [...prev, { email }]);
  };

  //  REMOVE PARTICIPANT 
  const handleRemoveParticipant = (email) => {
    setParticipants((prev) =>
      prev.filter((p) => p.email !== email)
    );
  };

  // SUBMIT MEETING 
  const handleSubmit = async () => {
    const {
      title,
      date,
      time,
      duration,
      meetingType,
      locationType,
      meetingLink,
    } = meetingData;

    // Frontend validation 
    if (
      !title ||
      !date ||
      !time ||
      !duration ||
      !meetingType ||
      !locationType
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (locationType === "online" && !meetingLink) {
      alert("Meeting link is required for online meetings");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/meetings",
        {
          title,
          date: new Date(date), 
          time,
          duration,
          meetingType,
          locationType,
          meetingLink:
            locationType === "online" ? meetingLink : "",

          participants: participants.map((p) => ({
            email: p.email,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Meeting created successfully");

      // reset form
      setMeetingData({
        title: "",
        date: "",
        time: "",
        duration: "",
        meetingType: "",
        locationType: "",
        meetingLink: "",
      });
      setParticipants([]);
    } catch (error) {
      console.error("Create meeting error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create meeting"
      );
    } finally {
      setLoading(false);
    }
  };

  //  UI 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <MeetingHeader
          title="Schedule Meeting"
          subtitle="Plan and organize team meetings"
          submitLabel={loading ? "Saving..." : "Create Meeting"}
          onSubmit={handleSubmit}
          onCancel={() => window.history.back()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* LEFT FORM */}
          <div className="lg:col-span-2">
            <MeetingForm
              meetingData={meetingData}
              onChange={handleMeetingChange}
            />
          </div>

          {/* RIGHT PARTICIPANTS */}
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
