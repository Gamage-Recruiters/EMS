// src/components/TextArea.jsx
export default function TextArea({ label, value, onChange, placeholder, required, rows = 6 }) {
  return (
    <label className="field">
      <span>{label}{required ? ' *' : ''}</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </label>
  )
}
