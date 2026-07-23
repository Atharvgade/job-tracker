import { useState } from 'react'

export default function AddApplicationModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    companyName: '',
    roleTitle: '',
    appliedDate: new Date().toISOString().slice(0, 10),
    deadline: '',
    jobPostingUrl: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({ ...form, deadline: form.deadline || null })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this application.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold text-ink">Add application</h2>

        {error && (
          <div className="text-sm text-rejected bg-rejected/10 border border-rejected/20 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">Company</label>
              <input
                required
                value={form.companyName}
                onChange={handleChange('companyName')}
                className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">Role</label>
              <input
                required
                value={form.roleTitle}
                onChange={handleChange('roleTitle')}
                className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">Applied date</label>
              <input
                type="date"
                value={form.appliedDate}
                onChange={handleChange('appliedDate')}
                className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">Deadline (optional)</label>
              <input
                type="date"
                value={form.deadline}
                onChange={handleChange('deadline')}
                className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/60 mb-1">Job posting URL (optional)</label>
            <input
              type="url"
              value={form.jobPostingUrl}
              onChange={handleChange('jobPostingUrl')}
              className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/60 mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              rows={3}
              className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-ink/70 px-4 py-2 rounded-md hover:bg-ink/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="text-sm font-medium bg-ink text-white px-4 py-2 rounded-md hover:bg-ink/90 transition disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Add application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
