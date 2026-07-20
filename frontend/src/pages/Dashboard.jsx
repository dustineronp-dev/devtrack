import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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

  if (loading) return <p className="p-8">Loading...</p>
  if (error) return <p className="p-8 text-red-500">{error}</p>

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <div className="flex gap-3">
          <Link to="/applications/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Application
          </Link>
          <button onClick={handleLogout} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Logout
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No applications yet — start tracking your job search!</p>
          <Link to="/applications/new" className="text-blue-600 hover:underline font-medium">
            + Add your first application
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{app.company_name}</h2>
                <p className="text-gray-600">{app.job_title}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {app.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Link to={`/applications/edit/${app.id}`} className="text-blue-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard