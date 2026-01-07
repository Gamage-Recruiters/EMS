import React from "react";
import { useOutletContext } from "react-router-dom";

export default function ContactDetails() {
  const { employee, setEmployee, isEdit } = useOutletContext();
  const contact = employee.contact || {};

  const updateContact = (patch) => {
    setEmployee((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...patch,
      },
    }));
  };

  return (
    <div className="w-full max-w-4xl p-4 mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Contact Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Phone Number 1
          </label>
          <input
            type="text"
            value={contact.phone1 || ""}
            onChange={(e) => updateContact({ phone1: e.target.value })}
            placeholder="Phone Number 1"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Phone Number 2
          </label>
          <input
            type="text"
            value={contact.phone2 || ""}
            onChange={(e) => updateContact({ phone2: e.target.value })}
            placeholder="Phone Number 2"
            className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-1">E-mail Address</label>
        <input
          type="email"
          value={contact.email || ""}
          onChange={(e) => updateContact({ email: e.target.value })}
          placeholder="johndoe@gmail.com"
          className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-1">
          City of residence
        </label>
        <input
          type="text"
          value={contact.city || ""}
          onChange={(e) => updateContact({ city: e.target.value })}
          placeholder="Enter City"
          className="w-full md:w-1/3 px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-1">
          Residential Address
        </label>
        <textarea
          rows={3}
          value={contact.address || ""}
          onChange={(e) => updateContact({ address: e.target.value })}
          placeholder="AlemBank, Addis ababa"
          className="w-full px-4 py-3 bg-blue-50 border border-gray-200 rounded-lg focus:ring focus:ring-blue-200"
        ></textarea>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        Changes will be saved using the main{" "}
        <span className="font-semibold">
          {isEdit ? "Update Profile" : "Create Profile"}
        </span>{" "}
        button.
      </p>
    </div>
  );
}
