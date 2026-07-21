import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

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
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  useEffect(() => {
    if (isEditing) {
      const fetchApplication = async () => {
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setFormData({
          ...data,
          date_applied: data.date_applied?.split('T')[0] || '',
          follow_up_date: data.follow_up_date?.split('T')[0] || '',
        })
        setInitialLoading(false)
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
    setLoading(true)
    const token = localStorage.getItem('token')

    const url = isEditing
      ? `${import.meta.env.VITE_API_URL}/applications/${id}`
      : `${import.meta.env.VITE_API_URL}/applications`
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
        setLoading(false)
        return
      }
      toast.success(isEditing ? 'Application updated!' : 'Application added!')
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  if (initialLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="font-[Sora] text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Application' : 'Add New Application'}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Basics */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Basics</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company Name</label>
                <input name="company_name" value={formData.company_name} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Job Title</label>
                <input name="job_title" value={formData.job_title} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Job Posting URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input name="job_url" value={formData.job_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Application Details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Gmail Used <span className="text-gray-400 font-normal">(optional)</span></label>
                <input name="applied_gmail" type="email" value={formData.applied_gmail} onChange={handleChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date Applied</label>
                  <input name="date_applied" type="date" value={formData.date_applied} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Source <span className="text-gray-400 font-normal">(optional)</span></label>
                  <select name="source" value={formData.source} onChange={handleChange} className={inputClass}>
                    <option value="">Select source</option>
                    <option>LinkedIn</option>
                    <option>JobStreet</option>
                    <option>Indeed</option>
                    <option>Referral</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Status & Notes</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                    <option>Ghosted</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Follow-up Date <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input name="follow_up_date" type="date" value={formData.follow_up_date} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className={inputClass} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Application' : 'Create Application'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplicationForm