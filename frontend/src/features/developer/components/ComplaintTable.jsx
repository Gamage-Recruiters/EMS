import { FiEye, FiImage } from "react-icons/fi";
import ComplaintStatusBadge from "./ComplaintStatusBadge";

/**
 * @props
 * - complaints: array
 * - scope: "developers" | "admin"
 * - onImageClick(imageUrl)
 * - onViewDescription(complaint)
 * - canUpdateStatus(complaint)
 * - onStatusChange(id, value)
 */
export default function ComplaintTable({
  complaints,
  scope = "developers",
  onImageClick,
  onViewDescription,
  canUpdateStatus,
  onStatusChange,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        {/* ================= HEADER ================= */}
        <thead className="bg-slate-100 text-slate-600 sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Submitted By</th>
            <th className="px-3 py-2 text-left">Subject</th>

            {scope === "developers" ? (
              <th className="px-3 py-2 text-left">Type</th>
            ) : (
              <>
                <th className="px-3 py-2 text-left">Urgency</th>
                <th className="px-3 py-2 text-left">Department</th>
                <th className="px-3 py-2 text-left">Required Action</th>
              </>
            )}

            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Description</th>
            <th className="px-3 py-2 text-left">Image</th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody className="divide-y">
          {complaints.map((c) => (
            <tr key={c._id} className="hover:bg-slate-50">
              {/* Date */}
              <td className="px-3 py-2">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>

              {/* User */}
              <td className="px-3 py-2">
                {c.user?.firstName} {c.user?.lastName}
                <div className="text-xs text-slate-500">{c.user?.email}</div>
              </td>

              {/* Subject */}
              <td className="px-3 py-2 font-medium">{c.subject}</td>

              {/* ===== ROLE SPECIFIC ===== */}
              {scope === "developers" ? (
                <td className="px-3 py-2 text-slate-600">{c.type || "-"}</td>
              ) : (
                <>
                  {/* Urgency */}
                  <td className="px-3 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.urgency === "high"
                          ? "bg-red-100 text-red-700"
                          : c.urgency === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {c.urgency}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="px-3 py-2">{c.department || "-"}</td>

                  {/* Required Action */}
                  <td className="px-3 py-2">
                    <button
                      onClick={() =>
                        onViewDescription({
                          ...c,
                          description: c.requiredAction,
                        })
                      }
                      className="flex items-center gap-1 text-blue-600 text-xs hover:underline"
                    >
                      <FiEye /> View
                    </button>
                  </td>
                </>
              )}

              {/* ===== STATUS ===== */}
              <td className="px-3 py-2">
                {canUpdateStatus?.(c) ? (
                  <select
                    value={c.status}
                    onChange={(e) => onStatusChange?.(c._id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    <option value="In Review">In Review</option>
                    <option value="Solved">Solved</option>
                  </select>
                ) : (
                  <ComplaintStatusBadge status={c.status} />
                )}
              </td>

              {/* Description */}
              <td className="px-3 py-2">
                <button
                  onClick={() => onViewDescription(c)}
                  className="flex items-center gap-1 text-blue-600 text-xs hover:underline"
                >
                  <FiEye /> View
                </button>
              </td>

              {/* Image */}
              <td className="px-3 py-2">
                {c.image ? (
                  <button
                    onClick={() => onImageClick(c.image)}
                    className="text-slate-600 hover:text-blue-600"
                  >
                    <FiImage />
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}

          {/* Empty */}
          {complaints.length === 0 && (
            <tr>
              <td
                colSpan={scope === "developers" ? 7 : 9}
                className="py-6 text-center text-slate-500"
              >
                No complaints found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
