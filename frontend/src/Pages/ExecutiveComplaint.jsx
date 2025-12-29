// src/pages/ExecutiveComplaint.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextInput from '../Components/TextInput.jsx'
import TextArea from '../Components/TextArea.jsx'
import SelectInput from '../Components/SelectInput.jsx'
import { submitExecutiveComplaint } from '../Services/api.js'

const urgencyOptions = [
  { value: 'informational', label: 'Informational' },
  { value: 'time-sensitive', label: 'Time-sensitive' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'blocker', label: 'Blocker' },
]

export default function ExecutiveComplaint() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    reporterName: '',
    reporterEmail: '',
    department: '',
    title: '',
    narrative: '',
    impactAreas: '',
    impactedKpis: '',
    urgency: '',
    requestedAction: '',
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
      await submitExecutiveComplaint(form)
      navigate('/success')
    } catch (err) {
      setError(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Executive complaint</h2>
      <form onSubmit={handleSubmit} className="form">
        <TextInput label="Name" value={form.reporterName} onChange={v => update('reporterName', v)} required />
        <TextInput label="Email" type="email" value={form.reporterEmail} onChange={v => update('reporterEmail', v)} required />
        <TextInput label="Department" value={form.department} onChange={v => update('department', v)} required />
        <TextInput label="Title" value={form.title} onChange={v => update('title', v)} required />
        <TextArea label="Narrative / Context" value={form.narrative} onChange={v => update('narrative', v)} required rows={8} />
        <TextInput label="Impact areas" value={form.impactAreas} onChange={v => update('impactAreas', v)} placeholder="Customers, revenue, compliance" />
        <TextInput label="Impacted KPIs" value={form.impactedKpis} onChange={v => update('impactedKpis', v)} placeholder="NPS, churn, SLA, cost" />
        <SelectInput label="Urgency" value={form.urgency} onChange={v => update('urgency', v)} options={urgencyOptions} required />
        <TextArea label="Requested action" value={form.requestedAction} onChange={v => update('requestedAction', v)} required />
        <TextInput label="Attachments URL" value={form.attachmentsUrl} onChange={v => update('attachmentsUrl', v)} placeholder="Drive/Dropbox link" />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Submit complaint'}</button>
      </form>
    </section>
  )
}
