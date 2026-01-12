import { useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createComplaint } from "../../../services/complaintService";

export default function ComplaintSubmissionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  // ================= IMAGE HANDLING =================
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

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !subject || !description) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("subject", subject);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
      setSubmitting(true);
      await createComplaint(formData);

      toast.success("Complaint submitted successfully");

      // 🔁 Redirect to complaint dashboard
      navigate("/complaints");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit complaint"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Submit Complaint</h1>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as {user.firstName} {user.lastName} ({user.role})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Complaint Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            >
              <option value="">Select type</option>
              <option value="Bug">Bug</option>
              <option value="Behavior">Behavior</option>
              <option value="Performance">Performance</option>
            </select>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Short summary"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Describe the issue in detail"
              required
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Attach Image (optional)
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <div className="mt-3 relative w-40">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="rounded border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/complaints")}
              className="px-4 py-2 border rounded text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
