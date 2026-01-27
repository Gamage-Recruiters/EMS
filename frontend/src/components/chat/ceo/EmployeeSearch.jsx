import { Search } from "lucide-react";

export default function EmployeeSearch({ value, onChange }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 border border-[#E0E0E0] rounded px-3 py-2 bg-[#FFFFFF]">
        <Search size={16} className="text-[#7A7A7A]" />
        <input
          type="text"
          placeholder="Search employees..."
          className="flex-1 text-sm outline-none text-[#1F1F1F] placeholder-[#7A7A7A]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
