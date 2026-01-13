export default function Button({ variant="primary", children, ...props }) {
  const styles = {
    primary: { background: "#2563eb", color: "#fff" },
    secondary: { background: "#eef2ff", color: "#1f2a44" },
    danger: { background: "#dc2626", color: "#fff" },
  };
  return (
    <button
      {...props}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        ...styles[variant],
        opacity: props.disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}
