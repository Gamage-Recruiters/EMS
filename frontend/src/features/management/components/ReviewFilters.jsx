export default function ReviewFilters({ developers, filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        placeholder="Search task or project or developer"
        className="border rounded px-3 py-2 text-sm"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <select
        className="border rounded px-3 py-2 text-sm"
        value={filters.developer}
        onChange={(e) => setFilters({ ...filters, developer: e.target.value })}
      >
        <option value="all">All Developers</option>
        {developers.map((d) => (
          <option key={d._id} value={d._id}>
            {d.firstName} {d.lastName}
          </option>
        ))}
      </select>

      <select
        className="border rounded px-3 py-2 text-sm"
        value={filters.view}
        onChange={(e) => setFilters({ ...filters, view: e.target.value })}
      >
        <option value="week">This Week</option>
        <option value="all">All</option>
      </select>
    </div>
  );
}
