import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const statusStyles = {
  Applied: 'bg-blue-100 text-blue-700',
  Interview: 'bg-amber-100 text-amber-700',
  Offer: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Ghosted: 'bg-gray-100 text-gray-600',
}

function Dashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchApplications = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error)
        return
      }
      setApplications(data)
    } catch (err) {
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token')
    await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchApplications()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {})

  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted']

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }
  if (error) return <p className="p-8 text-red-500">{error}</p>

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="font-[Sora] text-2xl sm:text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-500 text-sm mt-1">{applications.length} total</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/applications/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              + Add Application
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {applications.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {statuses.map((status) => (
              <div key={status} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{statusCounts[status] || 0}</p>
                <p className="text-xs text-gray-500 mt-1">{status}</p>
              </div>
            ))}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 mb-4">No applications yet — start tracking your job search!</p>
            <Link to="/applications/new" className="text-indigo-600 hover:underline font-medium">
              + Add your first application
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-5 rounded-xl border border-gray-200 flex justify-between items-center hover:border-indigo-300 transition-colors"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{app.company_name}</h2>
                  <p className="text-gray-500 text-sm">{app.job_title}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <Link to={`/applications/edit/${app.id}`} className="text-indigo-600 hover:underline font-medium">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(app.id)} className="text-red-500 hover:underline font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard