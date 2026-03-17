export default function CEOTabs({ tab, setTab }) {
  const tabs = ["Send Notice", "Private Messages"];

  return (
    <div className="flex border-b bg-white p-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            tab === t
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
