import React from "react";
import ProfileLayout from "../../components/ProfileLayout.jsx";

const JobDetailsPage = () => {
  return (
    <ProfileLayout>
      <div className="max-w-4xl text-sm text-slate-900">
        {/* Header row */}
        <div className="mb-10">
          <p className="text-xs font-semibold mb-4">View Job Details</p>

          <div className="grid grid-cols-3">
            <div />
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Job Role</p>
              <p className="text-base font-semibold">UI UX Designer</p>
            </div>
            <div />
          </div>

          <div className="grid grid-cols-3 mt-10">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Department</p>
              <p className="font-semibold">Design &amp; Marketing</p>
            </div>
            <div />
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Line Manager</p>
              <p className="font-semibold">Mr Domino’s Pizza</p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <p className="font-semibold mb-2">Job Description</p>
          <p className="text-xs mb-1">Your responsibilities will include:</p>
          <ul className="list-disc list-inside text-xs space-y-1">
            <li>
              Creating user-centered designs by understanding business
              requirements, and user feedback
            </li>
            <li>
              Creating user flows, wireframes, prototypes and mockups
            </li>
            <li>
              Translating requirements into style guides, design systems, design
              patterns and attractive user interfaces
            </li>
            <li>
              Designing UI elements such as input controls, navigational
              components and informational components
            </li>
            <li>
              Creating original graphic designs (e.g. images, sketches and
              tables)
            </li>
            <li>
              Identifying and troubleshooting UX problems (e.g. responsiveness)
            </li>
            <li>
              Collaborating effectively with product, engineering, and
              management teams
            </li>
            <li>
              Incorporating customer feedback, usage metrics, and usability
              findings into design in order to enhance user experience
            </li>
          </ul>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default JobDetailsPage;