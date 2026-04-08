import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createComplaint } from "../../../services/complaintService";

const COMPLAINT_TYPES = [
  {
    value: "Bug",
    title: "Bug",
    description: "Broken behavior, unexpected errors, or UI issues.",
  },
  {
    value: "Behavior",
    title: "Behavior",
    description: "Workplace conduct, communication, or team concerns.",
  },
  {
    value: "Performance",
    title: "Performance",
    description: "Work quality, delivery concerns, or recurring delays.",
  },
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ComplaintSubmissionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ================= IMAGE HANDLING =================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be under 5MB");
      e.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      navigate("..", { replace: true, relative: "path" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit complaint"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0,_#f8fafc_35%,_#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100">
                Employee Support
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Submit a complaint
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Share clear details so your concern can be reviewed quickly and
                  tracked with the right context.
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
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Complaint type
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pick the category that best describes the issue.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {COMPLAINT_TYPES.map((option) => {
                const active = type === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={`group rounded-lg border p-4 text-left transition-all duration-200 ${
                      active
                        ? "border-blue-600 bg-blue-50 shadow-[0_10px_30px_rgba(37,99,235,0.12)]"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`text-base font-semibold ${
                            active ? "text-blue-700" : "text-slate-900"
                          }`}
                        >
                          {option.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {option.description}
                        </p>
                      </div>

                      <span
                        className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                          active
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-transparent group-hover:border-slate-400"
                        }`}
                      >
                        ✓
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Short summary of the issue"
                  required
                />
              </div>

              <div className="space-y-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <span className="text-xs text-slate-400">
                    {description.length} characters
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={7}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Describe what happened, when it happened, and anything that would help the reviewer understand the issue."
                  required
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Attach image
                </label>

                <div className="rounded-lg border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-6 w-6"
                          aria-hidden="true"
                        >
                          <path d="M12 16V4" />
                          <path d="m7 9 5-5 5 5" />
                          <path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
                        </svg>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Add a screenshot or photo
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          JPG, PNG, or WEBP up to 5MB. Clear visuals help speed
                          up review.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-700 cursor-pointer"
                      >
                        Choose image
                      </button>
                      <span className="text-sm text-slate-600">
                        {imageFile ? imageFile.name : "No file selected"}
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      id="complaint-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <p className="text-xs text-slate-500">
                      Tip: use a screenshot that clearly shows the issue.
                    </p>
                  </div>
                </div>
              </div>

              {previewUrl && (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-medium text-slate-700">
                      Image preview
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-52 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-3 top-3 inline-flex items-center rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-rose-700 shadow-md transition hover:bg-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("..", { relative: "path" })}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.3 hover:from-blue-500 hover:to-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
