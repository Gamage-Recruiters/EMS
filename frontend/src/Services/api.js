// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function submitDeveloperComplaint(payload) {
  const res = await fetch(`${BASE_URL}/api/complaints/developer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to submit developer complaint')
  return res.json()
}

export async function submitExecutiveComplaint(payload) {
  const res = await fetch(`${BASE_URL}/api/complaints/executive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to submit executive complaint')
  return res.json()
}
