import React,{useState} from "react";
import { Link,Outlet, useSearchParams } from "react-router-dom";


export default function EmployeeProfile() {

  const [jobData, setJobData] = useState({
    jobTitle: "",
    department: "",
    jobCategory: "",
  });
  const [searchParams] = useSearchParams();
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const isEdit = searchParams.get("mode") === "edit";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* header part  */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      {/* ------- BREADCRUMB ------- */}
      <div className="px-6 py-3 text-gray-600 text-sm">
        Dashboard &gt; <span className="font-semibold">{isEdit ? "Edit Profile" : "Add Profile"}</span>
      </div>

      {/* this is side navigatin bar */}
      <div className="flex px-6 py-4 gap-6">
        {/* ------- SIDEBAR ------- */}
        <div className="w-60 bg-white p-4 rounded-lg shadow">
          <nav className="flex flex-col gap-3">
            {/* Preserve any existing search params (e.g. ?mode=edit) when switching tabs */}
            <Link className="hover:bg-gray-200 p-2 rounded" to={`personal-details${qs}`}>
              Personal Details
            </Link>
            <Link className="hover:bg-gray-200 p-2 rounded" to={`contact-details${qs}`}>
              Contact Details
            </Link>
            <Link className="hover:bg-gray-200 p-2 rounded" to={`education-qualification${qs}`}>
              Education Qualification
            </Link>
            <Link className="hover:bg-gray-200 p-2 rounded" to={`job-details${qs}`}>
              Job Details
            </Link>
          </nav>
        </div>
        
        {/* CONTENT AREA */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          <Outlet context={{ jobData, setJobData }} /> {/* 👈 This shows the selected page */}
        </div>

      </div>
    </div>
  );
}
