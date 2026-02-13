import { useMemo } from "react";

const defaultProjects = [
  {
    name: "Project ATS",
    team: "Frontend Team",
    completedOn: "2025-12-01",
    summary: "Core UI, role-based dashboards, and attendance tracking.",
  },
  {
    name: "Project Beta - Mobile App Redesign",
    team: "Mobile Team",
    completedOn: "2025-01-13",
    summary: "New navigation patterns, updated UI kit, and onboarding flow.",
  },
  {
    name: "Project Gamma - Backend API Migration",
    team: "Backend Team",
    completedOn: "2024-12-05",
    summary: "Service decomposition and API gateway migration.",
  },
];

export default function TLPastProjects() {
  const projects = useMemo(() => defaultProjects, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Past Project Details
          </h1>
          <p className="text-sm text-gray-500">
            Review completed projects and summarize outcomes for your team.
          </p>
        </div>

        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {project.name}
                  </h2>
                  <p className="text-xs text-gray-500">{project.team}</p>
                </div>
                <div className="text-xs text-gray-500">
                  Completed on {new Date(project.completedOn).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">{project.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
