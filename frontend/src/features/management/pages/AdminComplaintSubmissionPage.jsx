import { useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createAdminComplaint } from "../../../services/complaintService";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";

export default function AdminComplaintSubmissionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Only PM/TL/CEO can create admin complaints
  if (!user || !["PM", "TL", "CEO"].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const typeParam = searchParams.get("type");

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
    
    // Explicitly set target category based on query parameter
    if (typeParam === "teamlead") {
      formData.append("targetCategory", "TeamLead");
    } else {
      formData.append("targetCategory", "Admin");
    }

    if (imageFile) formData.append("image", imageFile);

    try {
      setSubmitting(true);
      await createAdminComplaint(formData);
      toast.success("Complaint submitted successfully");
      navigate("/dashboard/complaints/review");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const isTeamLead = typeParam === "teamlead";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0,_#f8fafc_35%,_#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-indigo-100">
                Management Support
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {isTeamLead ? "Submit Team Lead Complaint" : "Submit Admin Complaint"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Lodge an official management-level complaint regarding team issues, operations, or policy violations.
                </p>
              </div>
            </div>

            <div className="rounded-md border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-200 shadow-lg">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Signed in as
              </p>
              <p className="mt-1 font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-slate-300">{user.role}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 px-6 py-8 sm:px-8">
          <section className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subject *
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  placeholder="Short summary of the issue"
                  required
                />
              </div>

              <div className="space-y-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Description *
                  </label>
                  <span className="text-xs text-slate-400">
                    {description.length} characters
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={9}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  placeholder="Provide comprehensive details about the incident or issue."
                  required
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Urgency *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Department *
                  </label>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="E.g. Engineering"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Required Action *
                </label>
                <input
                  value={requiredAction}
                  onChange={(e) => setRequiredAction(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  placeholder="What is the expected resolution?"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Attach evidence (optional)
                </label>

                <div className="rounded-lg border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5 shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                        <FiUpload size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Upload file
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          JPG, PNG, or WEBP up to 5MB.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-700 cursor-pointer">
                        Choose file
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-sm text-slate-600">
                        {imageFile ? imageFile.name : "No file selected"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {previewUrl && (
                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 inline-flex items-center rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-rose-700 shadow-md transition hover:bg-white"
                  >
                    <FiX size={14} className="mr-1" /> Remove
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard/complaints/review")}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
