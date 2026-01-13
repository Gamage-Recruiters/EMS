import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";

import ComplaintDescriptionModal from "../components/ComplaintDescriptionModal";
import { getMyComplaints } from "../../../services/complaintService";

import ComplaintStats from "../components/ComplaintStats";
import ComplaintTable from "../components/ComplaintTable";
import ImagePreviewModal from "../components/ImagePreviewModal";

export default function ComplaintDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewComplaint, setViewComplaint] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    getMyComplaints()
      .then((res) => setComplaints(res.data.data))
      .catch(() => toast.error("Failed to load complaints"))
      .finally(() => setLoading(false));
  }, []);

  // ================= FILTER =================
  const filteredComplaints = useMemo(() => {
    const term = search.toLowerCase();

    return complaints.filter((c) => {
      const matchesSearch = !search || c.subject.toLowerCase().includes(term);

      const matchesStatus = status === "all" || c.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, status]);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading complaints…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">My Complaints</h1>

        <button
          onClick={() => navigate("/complaints/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          <FiPlus /> New Complaint
        </button>
      </div>

      {/* ================= STATS ================= */}
      <ComplaintStats complaints={filteredComplaints} />

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <FiSearch className="text-slate-400" />
          <input
            placeholder="Search by subject"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter className="text-slate-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="In Review">In Review</option>
            <option value="Solved">Solved</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border rounded-xl shadow-sm p-4">
        <ComplaintTable
          complaints={filteredComplaints}
          onImageClick={setPreviewImage}
          onViewDescription={setViewComplaint}
        />
      </div>
      <ComplaintDescriptionModal
        complaint={viewComplaint}
        onClose={() => setViewComplaint(null)}
      />

      {/* ================= IMAGE MODAL ================= */}
      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
