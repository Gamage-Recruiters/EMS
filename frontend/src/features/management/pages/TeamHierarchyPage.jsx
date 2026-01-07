import React, { useEffect, useState } from "react";
import TeamHierarchyView from "../components/TeamHierarchyView";
import { hierarchyService } from "../../../services/hierarchyService";

export default function TeamHierarchyPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    hierarchyService
      .getTree()
      .then((res) => {
        // Backend might send data in different shapes; handle common ones.
        const data = res.data;
        if (Array.isArray(data)) {
          setTeams(data);
        } else if (Array.isArray(data.teams)) {
          setTeams(data.teams);
        } else {
          setTeams([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load team hierarchy.");
        setTeams([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Team Hierarchy
          </h1>
          <p className="text-sm text-gray-500">
            Visual overview of team structure and reporting lines.
          </p>
        </div>
      </header>

      {loading && <div>Loading hierarchy…</div>}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && teams.length === 0 && (
        <p className="text-sm text-gray-500">
          No hierarchy data available. Once the backend team exposes the
          hierarchy API, it will be displayed here.
        </p>
      )}

      <div className="space-y-4">
        {teams.map((team) => (
          <TeamHierarchyView key={team.id || team.name} team={team} />
        ))}
      </div>
    </div>
  );
}
