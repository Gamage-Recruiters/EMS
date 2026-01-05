import React from 'react'
import { useOutletContext } from "react-router-dom";

export default function JobDetails() {
  const { jobData } = useOutletContext();
  return (
     <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <h3 className="text-sm text-gray-500 mb-4">View Job Details</h3>

      {/* Job Role */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-500">Job Role</p>
        <h2 className="text-xl font-semibold">
          {jobData.jobRole || "—"}
        </h2>
      </div>

      {/* Department  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center mb-10">
        <div>
          <p className="text-sm text-gray-500">Department</p>
          <p className="font-semibold">
          {jobData.department || "—"}
        </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Line Manager</p>
          <p className="font-semibold">Mr Domino’s Pizza</p>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <h3 className="text-center font-semibold mb-4">Job Description</h3>

        <p className="text-sm text-gray-600 mb-3">
          Your responsibilities will include:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
          <li>
            Creating user-centered designs by understanding business
            requirements and user feedback
          </li>
          <li>
            Creating user flows, wireframes, prototypes and mockups
          </li>
          <li>
            Translating requirements into style guides, design systems,
            design patterns and attractive user interfaces
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
            Collaborating effectively with product, engineering and management
            teams
          </li>
          <li>
            Incorporating customer feedback, usage metrics and usability
            findings into design in order to enhance user experience
          </li>
        </ul>
      </div>
    </div>
  )
}
