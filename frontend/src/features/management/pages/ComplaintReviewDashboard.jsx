import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";

import { useAuth } from "../../../context/AuthContext";
import {
  getDeveloperComplaints,
  getAdminComplaints,
  getMyComplaints,
  updateComplaintStatus,
} from "../../../services/complaintService";

import ComplaintStatusBadge from "../../developer/components/ComplaintStatusBadge";
import ImagePreviewModal from "../../developer/components/ImagePreviewModal";
import ComplaintDescriptionModal from "../../developer/components/ComplaintDescriptionModal";

export default function ComplaintReviewDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || !["PM", "TL", "CEO"].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const [devComplaints, setDevComplaints] = useState([]);
  const [adminComplaints, setAdminComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [viewRequiredAction, setViewRequiredAction] = useState(null);

  const [scope, setScope] = useState("developers"); // developers | admin
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const devRes = await getDeveloperComplaints();
        setDevComplaints(devRes.data.data);

        if (["CEO", "PM", "TL"].includes(user.role)) {
          const adminRes = await getAdminComplaints();
          setAdminComplaints(adminRes.data.data);
        }
      } catch {
        toast.error("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.role]);

  const activeList = scope === "developers" ? devComplaints : adminComplaints;

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return activeList.filter((c) => {
      const subjectMatch = !term || c.subject?.toLowerCase().includes(term);
      const statusMatch = status === "all" || c.status === status;
      return subjectMatch && statusMatch;
    });
  }, [activeList, search, status]);

  /* ================= PERMISSION ================= */
  const canUpdateStatus = () => {
    if (scope === "developers") return ["PM", "TL", "CEO"].includes(user.role);
    return scope === "admin" && user.role === "CEO";
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      toast.success("Status updated");

      const updater = (list) =>
        list.map((c) => (c._id === id ? { ...c, status: newStatus } : c));

      scope === "developers"
        ? setDevComplaints(updater)
        : setAdminComplaints(updater);
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Loading…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Complaint Review</h1>
          <p className="text-sm text-slate-500">
            Logged in as {user.firstName} {user.lastName} ({user.role})
          </p>
        </div>

        <button
          onClick={() => navigate("/complaints/new-admin")}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          <FiPlus /> Create Admin Complaint
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 w-full lg:max-w-md">
          <FiSearch className="text-slate-400" />
          <input
            placeholder="Search by subject"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="developers">Developer Complaints</option>
            {["CEO", "PM", "TL"].includes(user.role) && (
              <option value="admin">Admin Complaints</option>
            )}
          </select>

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
      <div className="bg-white border rounded-xl shadow-sm overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-100 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Submitted By</th>
              <th className="px-3 py-2 text-left">Subject</th>

              {scope === "admin" && (
                <>
                  <th className="px-3 py-2 text-left">Urgency</th>
                  <th className="px-3 py-2 text-left">Department</th>
                  <th className="px-3 py-2 text-left">Required Action</th>
                </>
              )}

              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left">Image</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>

                <td className="px-3 py-2">
                  {c.user?.firstName} {c.user?.lastName}
                  <div className="text-xs text-slate-500">{c.user?.email}</div>
                </td>

                <td className="px-3 py-2 font-medium">{c.subject}</td>

                {scope === "admin" && (
                  <>
                    <td className="px-3 py-2 capitalize">{c.urgency}</td>
                    <td className="px-3 py-2">{c.department}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() =>
                          setViewRequiredAction({
                            title: "Required Action",
                            text: c.requiredAction,
                          })
                        }
                        className="text-blue-600 text-xs hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </>
                )}

                <td className="px-3 py-2">
                  {canUpdateStatus() ? (
                    <select
                      value={c.status}
                      onChange={(e) =>
                        handleStatusUpdate(c._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="In Review">In Review</option>
                      <option value="Solved">Solved</option>
                    </select>
                  ) : (
                    <ComplaintStatusBadge status={c.status} />
                  )}
                </td>

                <td className="px-3 py-2">
                  <button
                    onClick={() => setViewComplaint(c)}
                    className="text-blue-600 text-xs hover:underline"
                  >
                    View
                  </button>
                </td>

                <td className="px-3 py-2">
                  {c.image ? (
                    <button
                      onClick={() => setPreviewImage(c.image)}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center text-slate-500">
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS ================= */}
      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      <ComplaintDescriptionModal
        complaint={viewComplaint}
        onClose={() => setViewComplaint(null)}
      />

      {viewRequiredAction && (
        <ComplaintDescriptionModal
          complaint={{
            subject: viewRequiredAction.title,
            description: viewRequiredAction.text,
            createdAt: new Date(),
          }}
          onClose={() => setViewRequiredAction(null)}
        />
      )}
    </div>
  );
}
