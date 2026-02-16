import { useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createAdminComplaint } from "../../../services/complaintService";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";

export default function AdminComplaintSubmissionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only PM/TL/CEO can create admin complaints
  if (!user || !["PM", "TL", "CEO"].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");
  const [department, setDepartment] = useState("");
  const [requiredAction, setRequiredAction] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be under 5MB");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !subject ||
      !description ||
      !urgency ||
      !department ||
      !requiredAction
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("urgency", urgency);
    formData.append("department", department);
    formData.append("requiredAction", requiredAction);
    if (imageFile) formData.append("image", imageFile);

    try {
      setSubmitting(true);
      await createAdminComplaint(formData);
      toast.success("Admin complaint submitted");
      navigate("/dashboard/complaints/review");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Create Admin Complaint</h1>
          <p className="text-sm text-slate-500">
            Logged in as {user.firstName} {user.lastName} ({user.role})
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/complaints/review")}
          className="inline-flex items-center gap-2 border px-4 py-2 rounded text-sm hover:bg-slate-50"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6 space-y-5"
      >
        <div>
          <label className="text-sm font-medium">Subject *</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mt-1"
            placeholder="Short subject"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm mt-1"
            placeholder="Full complaint description"
            required
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Urgency *</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              required
            >
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Department *</label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              placeholder="E.g., HR / Dev / Ops"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Required Action *</label>
            <input
              value={requiredAction}
              onChange={(e) => setRequiredAction(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              placeholder="What do you want to happen?"
              required
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="text-sm font-medium">Attach Image (optional)</label>
          <div className="mt-2 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 border px-3 py-2 rounded text-sm cursor-pointer hover:bg-slate-50">
              <FiUpload /> Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  title="Remove"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/complaints/review")}
            className="border px-4 py-2 rounded text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
