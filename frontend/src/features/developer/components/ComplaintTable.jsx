import { FiEye, FiImage } from "react-icons/fi";
import ComplaintStatusBadge from "./ComplaintStatusBadge";

export default function ComplaintTable({
  complaints,
  onImageClick,
  onViewDescription,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Subject</th>
            <th className="px-3 py-2 text-left">Type</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Description</th>
            <th className="px-3 py-2 text-left">Image</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {complaints.map((c) => (
            <tr key={c._id} className="hover:bg-slate-50">
              <td className="px-3 py-2">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>

              <td className="px-3 py-2 font-medium">{c.subject}</td>

              <td className="px-3 py-2 text-slate-600">{c.type || "-"}</td>

              <td className="px-3 py-2">
                <ComplaintStatusBadge status={c.status} />
              </td>

              {/* Description preview */}
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

          {complaints.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-slate-500">
                No complaints found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
