

import { dailyTasks } from "../data/dailyTasks";

// export tasks to CSV grouped by developer
function exportTasksToCSV(tasks) {
  if (!tasks || tasks.length === 0) return;
  const headers = [
    '#', 'Date', 'Task', 'Developer', 'Project', 'Status', 'Start', 'End', 'Hours', 'Faced Issues', 'Learnings', 'PM Check', 'Team Lead Check'
  ];
  // group tasks by developer
  const devMap = {};
  tasks.forEach((task) => {
    const dev = task.assignedTo?.name || 'Unassigned';
    if (!devMap[dev]) devMap[dev] = [];
    devMap[dev].push(task);
  });
  let csvContent = '';
  let devIdx = 0;
  Object.entries(devMap).forEach(([dev, devTasks]) => {
    if (devIdx > 0) csvContent += '\n'; // blank line between devs
    csvContent += `Developer: ${dev}\n`;
    csvContent += headers.join(',') + '\n';
    devTasks.forEach((task, idx) => {
      const row = [
        idx + 1,
        task.date,
        task.title,
        task.assignedTo?.name || '',
        task.project,
        task.status,
        task.startTime,
        task.endTime,
        task.workingHours,
        task.facedIssues?.replace(/\n/g, ' '),
        task.learnings?.replace(/\n/g, ' '),
        task.pmCheck,
        task.teamLeadCheck
      ];
      csvContent += row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(',') + '\n';
    });
    devIdx++;
  });
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'progress_report_by_developer.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const StatusBadge = ({ label }) => {
  let colorClass = "text-slate-600 bg-slate-100";
  switch (label) {
    case "Completed":
      colorClass = "text-green-800 bg-green-100";
      break;
    case "In Progress":
      colorClass = "text-yellow-800 bg-yellow-100";
      break;
    case "Pending":
    case "Not Started":
      colorClass = "text-amber-800 bg-amber-100";
      break;
    case "Blocked":
      colorClass = "text-red-800 bg-red-100";
      break;
    case "Good":
      colorClass = "text-emerald-600 bg-emerald-50";
      break;
    case "Average":
      colorClass = "text-amber-600 bg-amber-50";
      break;
    case "Poor":
      colorClass = "text-red-600 bg-red-50";
      break;
    default:
      colorClass = "text-slate-600 bg-slate-100";
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

const ProgressTracking = ({
  // Optionally accept role as prop, default to DEV
  role = "DEV",
}) => {
  // Use dailyTasks as the data source
  // Use dailyTasks as the data source for all developers
  const tasks = dailyTasks;
  const totalProjects = [...new Set(tasks.map((t) => t.project))].length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending" || t.status === "Not Started").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Weekly Progress Updates</h2>

      {/* Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-4 flex flex-col items-center shadow-sm">
          <span className="text-2xl font-bold text-blue-600">{totalProjects}</span>
          <span className="text-xs text-slate-500 mt-1">Projects</span>
        </div>
        <div className="bg-white border rounded-xl p-4 flex flex-col items-center shadow-sm">
          <span className="text-2xl font-bold text-green-600">{completedTasks}</span>
          <span className="text-xs text-slate-500 mt-1">Completed Tasks</span>
        </div>
        <div className="bg-white border rounded-xl p-4 flex flex-col items-center shadow-sm">
          <span className="text-2xl font-bold text-yellow-600">{inProgressTasks}</span>
          <span className="text-xs text-slate-500 mt-1">In Progress</span>
        </div>
        <div className="bg-white border rounded-xl p-4 flex flex-col items-center shadow-sm">
          <span className="text-2xl font-bold text-amber-600">{pendingTasks}</span>
          <span className="text-xs text-slate-500 mt-1">Pending Tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(role === "TL" || role === "PM") && (
          <>
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button className="text-sm text-blue-600">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3">Project</th>
                      <th className="text-left py-3">Completion %</th>
                      <th className="text-left py-3">Pending</th>
                      <th className="text-left py-3">Status</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    {teamStats.map((team) => (
                      // <tr key={team.name} className="border-b">
                      //   <td className="py-3">{team.name}</td>
                      //   <td className="py-3">{team.completion}%</td>
                      //   <td className="py-3">{team.pending}</td>
                      //   <td className="py-3">
                      //     <span className={`inline-flex items-center gap-2 ${team.status === "Good" ? "text-emerald-600" : team.status === "Average" ? "text-amber-600" : "text-red-600"}`}>
                      //       <span className={`w-2 h-2 rounded-full ${team.status === "Good" ? "bg-emerald-600" : team.status === "Average" ? "bg-amber-600" : "bg-red-600"}`} />
                      //       {team.status}
                      //     </span>
                      //   </td>
                      // </tr>
                    ))}
                  </tbody> */}
                </table>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-semibold">Quick Stats</h3>

              <div>
                <p className="text-sm">Weekly Hours</p>
                <div className="h-2 bg-slate-200 rounded-full mt-2">
                  <div className="h-full bg-blue-600 rounded-full w-[96%]" />
                </div>
                <p className="text-xs text-slate-500 mt-1">38h 30m / 40h</p>
              </div>

              <div>
                <p className="text-sm">Attendance Rate</p>
                <div className="h-2 bg-slate-200 rounded-full mt-2">
                  <div className="h-full bg-emerald-600 rounded-full w-[96%]" />
                </div>
                <p className="text-xs text-slate-500 mt-1">22 of 23 days</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Download button and table header */}
      <div className="flex justify-between items-center mt-8 mb-2">
        <h3 className="text-lg font-semibold">Detailed Task Progress</h3>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
          onClick={() => exportTasksToCSV(tasks)}
        >
          Download Report
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Task</th>
                <th className="px-3 py-2 font-semibold">Developer</th>
                <th className="px-3 py-2 font-semibold">Project</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Start</th>
                <th className="px-3 py-2 font-semibold">End</th>
                <th className="px-3 py-2 font-semibold">Hours</th>
                <th className="px-3 py-2 font-semibold">Faced Issues</th>
                <th className="px-3 py-2 font-semibold">Learnings</th>
                <th className="px-3 py-2 font-semibold">PM Check</th>
                <th className="px-3 py-2 font-semibold">Team Lead Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {role === "DEV" && tasks.length === 0 && (
                <tr>
                  <td colSpan={13} className="py-6 text-center text-slate-500">No tasks assigned yet</td>
                </tr>
              )}
              {tasks.map((task, idx) => (
                <tr key={task._id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-3 text-slate-700 text-sm">{task.date}</td>
                  <td className="px-3 py-3 font-medium">{task.task}</td>
                  <td className="px-3 py-3 text-slate-700">{task.developer}</td>
                  <td className="px-3 py-3 text-slate-700">{task.project}</td>
                  <td className="px-3 py-3">
                    <StatusBadge label={task.status} />
                  </td>
                  <td className="px-3 py-3 text-slate-700 text-sm">{task.startTime}</td>
                  <td className="px-3 py-3 text-slate-700 text-sm">{task.endTime}</td>
                  <td className="px-3 py-3 text-slate-700 text-sm">{task.workingHours}</td>
                  <td className="px-3 py-3 text-slate-700 text-xs max-w-xs truncate" title={task.facedIssues}>{task.facedIssues}</td>
                  <td className="px-3 py-3 text-slate-700 text-xs max-w-xs truncate" title={task.learnings}>{task.learnings}</td>
                  <td className="px-3 py-3 text-slate-700 text-sm">
                    {role === "PM" ? (
                      <select
                        value={task.pmCheck}
                        onChange={e => {/* TODO: handle PM check update */}}
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                        <option value="Issue">Issue</option>
                        <option value="Not Completed">Not Completed</option>
                      </select>
                    ) : (
                      task.pmCheck
                    )}
                  </td>
                  <td className="px-3 py-3 text-slate-700 text-sm">
                    {role === "TL" ? (
                      <select
                        value={task.teamLeadCheck}
                        onChange={e => {/* TODO: handle TL check update */}}
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                        <option value="Issue">Issue</option>
                        <option value="Not Completed">Not Completed</option>
                      </select>
                    ) : (
                      task.teamLeadCheck
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
