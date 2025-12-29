// src/components/SelectInput.jsx
export default function SelectInput({ label, value, onChange, options = [], required }) {
  return (
    <label className="field">
      <span>{label}{required ? ' *' : ''}</span>
      <select value={value} onChange={e => onChange(e.target.value)} required={required}>
        <option value="" disabled>Select</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  )
}
