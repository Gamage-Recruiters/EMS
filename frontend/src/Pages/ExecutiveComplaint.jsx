
import { useState } from "react";

export default function ExecutiveComplaint() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [narrative, setNarrative] = useState("");
  const [urgency, setUrgency] = useState("");
  const [requestedAction, setRequestedAction] = useState("");
  const [role, setRole] = useState("CEO"); // CEO / PR / TL
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg","image/png","image/webp"];

  function handleFileChange(e){
    setError("");
    const file = e.target.files?.[0];
    if(!file) return;
    if(!ALLOWED_TYPES.includes(file.type)){ setError("Only JPG, PNG or WEBP allowed."); return; }
    if(file.size > MAX_FILE_SIZE){ setError("Max 5 MB allowed."); return; }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removeImage(){
    setImageFile(null);
    if(previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    if(!name.trim() || !email.trim() || !narrative.trim() || !urgency || !requestedAction){
      setError("Please fill required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("department", department);
    formData.append("title", title);
    formData.append("narrative", narrative);
    formData.append("urgency", urgency);
    formData.append("requestedAction", requestedAction);
    formData.append("role", role);
    if(imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("/api/complaints/executive", { method: "POST", body: formData });
      if(!res.ok) throw new Error(await res.text() || "Submission failed");
      // reset
      setName(""); setEmail(""); setDepartment(""); setTitle(""); setNarrative(""); setUrgency(""); setRequestedAction(""); setRole("CEO");
      removeImage();
      alert("Executive complaint submitted.");
    } catch(err){
      setError(err.message || "Submission failed.");
    }
  }

  return (
    <main className="main-content">
      <div className="container">
        <h1 className="page-title">Executive Complaint</h1>

        <section className="card">
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="role">Path (CEO / PR / TL)</label>
              <select id="role" className="input" value={role} onChange={(e)=>setRole(e.target.value)}>
                <option value="CEO">CEO</option>
                <option value="PR">PR</option>
                <option value="TL">TL</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="name">Name *</label>
              <input id="name" className="input" value={name} onChange={(e)=>setName(e.target.value)} required />
            </div>

            <div className="field">
              <label htmlFor="email">Email *</label>
              <input id="email" type="email" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>

            <div className="field">
              <label htmlFor="department">Department</label>
              <input id="department" className="input" value={department} onChange={(e)=>setDepartment(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" className="input" value={title} onChange={(e)=>setTitle(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="narrative">Narrative / Context *</label>
              <textarea id="narrative" className="input" value={narrative} onChange={(e)=>setNarrative(e.target.value)} required />
            </div>

            <div className="field">
              <label htmlFor="urgency">Urgency *</label>
              <select id="urgency" className="input" value={urgency} onChange={(e)=>setUrgency(e.target.value)} required>
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="requestedAction">Requested action *</label>
              <textarea id="requestedAction" className="input" value={requestedAction} onChange={(e)=>setRequestedAction(e.target.value)} required />
            </div>

            <div className="field">
              <label htmlFor="image">Attach Image</label>
              <input id="image" type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
              {previewUrl && (
                <div className="image-preview" aria-live="polite">
                  <img src={previewUrl} alt="Preview" className="preview-img" />
                  <button type="button" className="remove-btn" onClick={removeImage}>Remove</button>
                </div>
              )}
            </div>

            {error && <div className="error" role="alert">{error}</div>}

            <div style={{display:"flex",gap:12}}>
              <button type="submit" className="btn">Submit</button>
              <button type="button" className="btn secondary" onClick={()=>{
                setName(""); setEmail(""); setDepartment(""); setTitle(""); setNarrative(""); setUrgency(""); setRequestedAction(""); setRole("CEO"); removeImage(); setError("");
              }}>Cancel</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
