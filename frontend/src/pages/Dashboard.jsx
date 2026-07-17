import { useState, useEffect } from 'react'

function Dashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token')

      try {
        const response = await fetch('http://localhost:3000/applications', {
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

    fetchApplications()
  }, [])

  if (loading) return <p className="p-8">Loading...</p>
  if (error) return <p className="p-8 text-red-500">{error}</p>

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{app.company_name}</h2>
            <p className="text-gray-600">{app.job_title}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard