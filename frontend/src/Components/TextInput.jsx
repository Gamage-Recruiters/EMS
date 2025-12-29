// src/components/TextInput.jsx
export default function TextInput({ label, value, onChange, placeholder, required, type = 'text' }) {
  return (
    <label className="field">
      <span>{label}{required ? ' *' : ''}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  )
}
