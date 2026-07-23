import { useEffect, useState } from 'react'
import client from '../api/client'
import KanbanBoard from '../components/KanbanBoard'
import AddApplicationModal from '../components/AddApplicationModal'
import ApplicationDetailModal from '../components/ApplicationDetailModal'

export default function Dashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)

  const fetchApplications = async () => {
    const { data } = await client.get('/applications/all')
    setApplications(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleAdd = async (form) => {
    const { data } = await client.post('/applications', form)
    setApplications((prev) => [data, ...prev])
  }

  const handleStatusChange = async (id, status) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    try {
      await client.patch(`/applications/${id}/status`, { status })
    } catch {
      fetchApplications() // revert on failure
    }
  }

  const handleUpdated = (updated) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    setSelectedApp(updated)
  }

  const handleDeleted = (id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-sm text-ink/50">Loading your pipeline…</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Your Applications</h1>
          <p className="text-sm text-ink/60 mt-0.5">
            {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-ink text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-ink/90 transition"
        >
          + Add application
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg py-16 text-center">
          <p className="text-sm text-ink/50 mb-3">Nothing tracked yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm font-medium text-ink underline"
          >
            Add your first application
          </button>
        </div>
      ) : (
        <KanbanBoard
          applications={applications}
          onStatusChange={handleStatusChange}
          onCardClick={setSelectedApp}
        />
      )}

      {showAddModal && (
        <AddApplicationModal onClose={() => setShowAddModal(false)} onSubmit={handleAdd} />
      )}

      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}
