import React, { useState } from "react";
import ProfileLayout from "../../components/ProfileLayout.jsx";

const ContactDetailsPage = () => {
  const [form, setForm] = useState({
    phone1: "",
    phone2: "",
    email: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
    setIsUpdated(false); // hide success when editing again
  };

  const validate = () => {
    const newErrors = {};

    if (!form.phone1.trim()) {
      newErrors.phone1 = "Phone number 1 is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    // phone2, city, address are OPTIONAL → no validation here

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdated(false);

    if (!validate()) return;

    // TODO: Integrate with backend API
    // try {
    //   const res = await fetch("/api/profile/contact", {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(form),
    //   });
    //   if (!res.ok) throw new Error("Failed to update");
    //   setIsUpdated(true);
    // } catch (err) {
    //   // TODO: show API error toast / message
    // }

    // For now just simulate success:
    setIsUpdated(true);
  };

  return (
    <ProfileLayout>
      <form className="max-w-4xl" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Phone 1 (required) */}
          <div>
            <label className="block text-sm text-slate-800 mb-1">
              Phone Number 1 <span className="text-red-500">*</span>
            </label>
            <input
              name="phone1"
              value={form.phone1}
              onChange={handleChange}
              className={`w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border ${
                errors.phone1 ? "border-red-400" : "border-transparent"
              }`}
              placeholder="Phone Number 1"
            />
            {errors.phone1 && (
              <p className="mt-1 text-xs text-red-500">{errors.phone1}</p>
            )}
          </div>

          {/* Phone 2 (optional) */}
          <div>
            <label className="block text-sm text-slate-800 mb-1">
              Phone Number 2 (optional)
            </label>
            <input
              name="phone2"
              value={form.phone2}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border border-transparent"
              placeholder="Phone Number 2"
            />
          </div>
        </div>

        {/* Email (required) */}
        <div className="mb-6">
          <label className="block text-sm text-slate-800 mb-1">
            E-mail Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border ${
              errors.email ? "border-red-400" : "border-transparent"
            }`}
            placeholder="johndoe@gmail.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* City (optional) */}
        <div className="mb-6 max-w-md">
          <label className="block text-sm text-slate-800 mb-1">
            City of residence (optional)
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none border border-transparent"
            placeholder="City of residence"
          />
        </div>

        {/* Address (optional) */}
        <div className="mb-8">
          <label className="block text-sm text-slate-800 mb-1">
            Residential Address (optional)
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded-xl bg-[#E6F2FF] px-4 py-3 text-sm outline-none resize-none border border-transparent"
            rows={3}
            placeholder="Alembank, Addis Ababa"
          />
        </div>

        <button
          type="submit"
          className="px-10 py-2.5 rounded-full bg-[#2E7D32] text-white text-sm font-semibold shadow hover:bg-[#256427]"
        >
          Update
        </button>

        {isUpdated && (
          <p className="mt-3 text-sm text-green-600">
            Contact details updated successfully.
          </p>
        )}
      </form>
    </ProfileLayout>
  );
};

export default ContactDetailsPage;