// src/pages/DeveloperComplaint.jsx
import { useState } from "react";

export default function DeveloperComplaint() {
  const [developer, setDeveloper] = useState("");
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  function handleFileChange(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Max 5 MB allowed.");
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function removeImage() {
    setImageFile(null);
    setPreviewUrl(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!developer.trim()) {
      setError("Please enter developer name.");
      return;
    }

    // Build form data
    const formData = new FormData();
    formData.append("developer", developer);
    formData.append("type", type);
    formData.append("subject", subject);
    formData.append("details", details);
    formData.append("anonymous", anonymous ? "true" : "false");
    if (imageFile) formData.append("image", imageFile);

    try {
      // Replace endpoint with your API route
      const res = await fetch("/api/complaints/developer", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      // success handling
      setDeveloper("");
      setType("");
      setSubject("");
      setDetails("");
      setAnonymous(false);
      removeImage();
      alert("Complaint submitted successfully.");
    } catch (err) {
      setError(err.message || "Submission failed.");
    }
  }

  return (
    <main className="main-content">
      <section className="card" aria-labelledby="complaint-title">
        <h2 id="complaint-title">Developer Complaint</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="developer">Developer</label>
            <input
              id="developer"
              className="input"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="type">Complaint Type</label>
            <select
              id="type"
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="bug">Bug</option>
              <option value="behavior">Behavior</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="subject">Complaint Subject</label>
            <input
              id="subject"
              className="input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="details">Complaint Details</label>
            <textarea
              id="details"
              className="input"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="image">Attach Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            {previewUrl && (
              <div className="image-preview" aria-live="polite">
                <img src={previewUrl} alt="Preview" className="preview-img" />
                <button type="button" className="remove-btn" onClick={removeImage}>
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />{" "}
              Submit Anonymously
            </label>
          </div>

          {error && <div className="error" role="alert">{error}</div>}

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="btn">Submit</button>
            <button type="button" className="btn" onClick={() => {
              setDeveloper(""); setType(""); setSubject(""); setDetails(""); setAnonymous(false); removeImage(); setError("");
            }}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
