import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { createMeeting, getParticipants } from "../../services/meetingService";

import MeetingHeader from "../../components/meeting/MeetingHeader";
import MeetingForm from "../../components/meeting/MeetingForm";
import ParticipantsPanel from "../../components/meeting/ParticipantsPanel";

const CreateMeetings = () => {
  const { user } = useAuth();

  // 🔒 ROLE GUARD
  if (!user || !["PM", "TL", "CEO"].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const [meetingData, setMeetingData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    meetingType: "",
    locationType: "",
    meetingLink: "",
  });

  const [users, setUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    getParticipants()
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error("Failed to load participants"));
  }, []);

  /* ================= HANDLERS ================= */
  const handleMeetingChange = (field, value) => {
    setMeetingData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleParticipant = (user) => {
    setParticipants((prev) => {
      const exists = prev.some((p) => p.email === user.email);
      return exists
        ? prev.filter((p) => p.email !== user.email)
        : [...prev, { email: user.email }];
    });
  };

  /* ================= SUBMIT ================= */
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

    if (
      !title ||
      !date ||
      !time ||
      !duration ||
      !meetingType ||
      !locationType
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (locationType === "online" && !meetingLink) {
      toast.error("Meeting link is required");
      return;
    }

    try {
      setLoading(true);

      await createMeeting({
        ...meetingData,
        participants,
      });

      toast.success("Meeting scheduled successfully");

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
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
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
          <div className="lg:col-span-2">
            <MeetingForm
              meetingData={meetingData}
              onChange={handleMeetingChange}
            />
          </div>

          <ParticipantsPanel
            users={users}
            selectedParticipants={participants}
            onToggleParticipant={toggleParticipant}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMeetings;
