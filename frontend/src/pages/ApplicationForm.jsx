import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ApplicationForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_url: '',
    applied_gmail: '',
    date_applied: '',
    status: 'Applied',
    source: '',
    notes: '',
    follow_up_date: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditing) {
      const fetchApplication = async () => {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3000/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setFormData({
          ...data,
          date_applied: data.date_applied?.split('T')[0] || '',
          follow_up_date: data.follow_up_date?.split('T')[0] || '',
        })
      }
      fetchApplication()
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const token = localStorage.getItem('token')

    const url = isEditing
      ? `http://localhost:3000/applications/${id}`
      : 'http://localhost:3000/applications'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error)
        return
      }

      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Application' : 'Add New Application'}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input name="company_name" placeholder="Company Name" value={formData.company_name} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
        <input name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
        <input name="job_url" placeholder="Job Posting URL" value={formData.job_url} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
        <input name="applied_gmail" placeholder="Gmail Used" value={formData.applied_gmail} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
        <input name="date_applied" type="date" value={formData.date_applied} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />

        <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded mb-3">
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
          <option>Ghosted</option>
        </select>

        <select name="source" value={formData.source} onChange={handleChange} className="w-full border p-2 rounded mb-3">
          <option value="">Select Source</option>
          <option>LinkedIn</option>
          <option>JobStreet</option>
          <option>Indeed</option>
          <option>Referral</option>
          <option>Other</option>
        </select>

        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
        <input name="follow_up_date" type="date" value={formData.follow_up_date} onChange={handleChange} className="w-full border p-2 rounded mb-3" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {isEditing ? 'Update' : 'Create'} Application
        </button>
      </form>
    </div>
  )
}

export default ApplicationForm