import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function EmployeeSearch({ value, onChange }) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => onChange(debouncedValue), 300);
    return () => clearTimeout(timer);
  }, [debouncedValue]);

  return (
    <div className="relative mb-4">
      <Search
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        value={debouncedValue}
        onChange={(e) => setDebouncedValue(e.target.value)}
      />
    </div>
  );
}
