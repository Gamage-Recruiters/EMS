function ProgressBar({ value }) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <span className="text-xs text-slate-600">{safeValue}%</span>
    </div>
  );
}

export default ProgressBar;
