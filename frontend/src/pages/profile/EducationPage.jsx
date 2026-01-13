import React, { useState } from "react";
//import ProfileLayout from "../../components/ProfileLayout.jsx";

const EducationPage = () => {
  const [form, setForm] = useState({
    institution: "",
    department: "",
    course: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setIsUpdated(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.institution.trim()) {
      newErrors.institution = "Institution is required.";
    }
    if (!form.course.trim()) {
      newErrors.course = "Course is required.";
    }
    if (!form.startDate) {
      newErrors.startDate = "Start date is required.";
    }
    if (!form.endDate) {
      newErrors.endDate = "End date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // TODO: call backend API here
    // try {
    //   const res = await fetch("/api/profile/education", {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(form),
    //   });
    //   if (!res.ok) throw new Error("Update failed");
    //   setIsUpdated(true);
    // } catch (err) {
    //   // TODO: show toast / error message from API
    // }

    setIsUpdated(true);
  };

  return (
    <ProfileLayout>
      <form className="max-w-4xl" onSubmit={handleSubmit} noValidate>
        {/* Success header */}
        {isUpdated && (
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-full border-4 border-[#22C55E] flex items-center justify-center mb-4">
              <span className="text-3xl text-[#22C55E]">✓</span>
            </div>
            <p className="text-xl font-semibold text-[#22C55E]">
              Updated Successfully
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Institution (required) */}
          <div>
            <label className="block text-sm text-slate-800 mb-1">
              Name of Institution <span className="text-red-500">*</span>
            </label>
            <input
              name="institution"
              value={form.institution}
              onChange={handleChange}
              className={`w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border ${
                errors.institution ? "border-red-400" : "border-transparent"
              }`}
              placeholder="Jimma university"
            />
            {errors.institution && (
              <p className="mt-1 text-xs text-red-500">
                {errors.institution}
              </p>
            )}
          </div>

          {/* Department (optional) */}
          <div>
            <label className="block text-sm text-slate-800 mb-1">
              Department (optional)
            </label>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border border-transparent"
              placeholder="Computer Dept"
            />
          </div>

          {/* Course (required) */}
          <div>
            <label className="block text-sm text-slate-800 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              className={`w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border ${
                errors.course ? "border-red-400" : "border-transparent"
              }`}
              placeholder="Computer Science"
            />
            {errors.course && (
              <p className="mt-1 text-xs text-red-500">{errors.course}</p>
            )}
          </div>

          {/* Location (optional) */}
          <div>
            <label className="block text-sm text-slate-800 mb-1">
              Location (optional)
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border border-transparent"
              placeholder="Jimma, Ethiopia"
            />
          </div>

          {/* Start date (required) */}
          <div>
            <label className="block text-sm text-slate-800 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={`w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border ${
                errors.startDate ? "border-red-400" : "border-transparent"
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
            )}
          </div>

          {/* End date (required) */}
          <div>
            <label className="block text-sm text-slate-800 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className={`w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border ${
                errors.endDate ? "border-red-400" : "border-transparent"
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Description (optional) */}
        <div className="mb-8">
          <label className="block text-sm text-slate-800 mb-1">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none resize-none border border-transparent"
            rows={4}
            placeholder="• Gathering and evaluating product requirements..."
          />
        </div>

        <button
          type="submit"
          className="px-10 py-2.5 rounded-full bg-[#2E7D32] text-white text-sm font-semibold shadow hover:bg-[#256427]"
        >
          Update
        </button>
      </form>
    </ProfileLayout>
  );
};

export default EducationPage;