export default function CEOTabs({ tab, setTab }) {
  const tabs = ["Send Notice"];

  return (
    <div className="flex border-b border-[#E0E0E0] bg-[#FFFFFF]">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-6 py-3 text-sm font-medium
            ${
              tab === t
                ? "border-b-2 border-[#3676E0] text-[#3676E0]"
                : "text-[#4D4D4D]"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
