export default function Input({ label, error, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, color: "#374151" }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${error ? "#ef4444" : "#e5e7eb"}`,
          outline: "none",
        }}
      />
      {error && <div style={{ fontSize: 12, color: "#ef4444" }}>{error}</div>}
    </div>
  );
}
