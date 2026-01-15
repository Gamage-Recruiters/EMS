export default function CEOTabs({ tab, setTab }) {
  const tabs = ["Send Notice", "Private Messages"];

  return (
    <div className="flex border-b border-gray-200 bg-white">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-6 py-3 text-sm font-medium transition-colors
            ${
              tab === t
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
