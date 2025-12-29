// src/pages/DeveloperComplaint.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextInput from '../Components/TextInput.jsx'
import TextArea from '../Components/TextArea.jsx'
import SelectInput from '../Components/SelectInput.jsx'
import { submitDeveloperComplaint } from '../Services/api.js'

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export default function DeveloperComplaint() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    reporterName: '',
    reporterEmail: '',
    module: '',
    environment: '',
    summary: '',
    steps: '',
    expected: '',
    actual: '',
    severity: '',
    repoUrl: '',
    attachmentsUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await submitDeveloperComplaint(form)
      navigate('/success')
    } catch (err) {
      setError(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Developer complaint</h2>
      <form onSubmit={handleSubmit} className="form">
        <TextInput label="Name" value={form.reporterName} onChange={v => update('reporterName', v)} required />
        <TextInput label="Email" type="email" value={form.reporterEmail} onChange={v => update('reporterEmail', v)} required />
        <TextInput label="Module / Feature" value={form.module} onChange={v => update('module', v)} required />
        <TextInput label="Environment (e.g., prod, staging)" value={form.environment} onChange={v => update('environment', v)} required />
        <TextArea label="Summary" value={form.summary} onChange={v => update('summary', v)} required />
        <TextArea label="Steps to reproduce" value={form.steps} onChange={v => update('steps', v)} required rows={8} />
        <TextArea label="Expected behavior" value={form.expected} onChange={v => update('expected', v)} required />
        <TextArea label="Actual behavior" value={form.actual} onChange={v => update('actual', v)} required />
        <SelectInput label="Severity" value={form.severity} onChange={v => update('severity', v)} options={severityOptions} required />
        <TextInput label="Repository URL" value={form.repoUrl} onChange={v => update('repoUrl', v)} placeholder="https://github.com/org/repo" />
        <TextInput label="Attachments URL" value={form.attachmentsUrl} onChange={v => update('attachmentsUrl', v)} placeholder="Drive/Dropbox link" />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Submit complaint'}</button>
      </form>
    </section>
  )
}
