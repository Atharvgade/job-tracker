import { useState } from 'react'
import client from '../api/client'

const STATUS_LABELS = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
}

export default function ApplicationDetailModal({ application, onClose, onUpdated, onDeleted }) {
  const [notes, setNotes] = useState(application.notes || '')
  const [savingNotes, setSavingNotes] = useState(false)
  const [roundName, setRoundName] = useState('')
  const [roundDate, setRoundDate] = useState('')
  const [addingRound, setAddingRound] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const saveNotes = async () => {
    setSavingNotes(true)
    try {
      const { data } = await client.put(`/applications/${application.id}`, {
        companyName: application.companyName,
        roleTitle: application.roleTitle,
        status: application.status,
        appliedDate: application.appliedDate,
        deadline: application.deadline,
        jobPostingUrl: application.jobPostingUrl,
        notes,
      })
      onUpdated(data)
    } finally {
      setSavingNotes(false)
    }
  }

  const addRound = async (e) => {
    e.preventDefault()
    if (!roundName.trim()) return
    setAddingRound(true)
    try {
      await client.post(`/applications/${application.id}/interview-rounds`, {
        roundName,
        scheduledAt: roundDate ? new Date(roundDate).toISOString() : null,
        completed: false,
      })
      const { data } = await client.get(`/applications/${application.id}`)
      onUpdated(data)
      setRoundName('')
      setRoundDate('')
    } finally {
      setAddingRound(false)
    }
  }

  const toggleRoundCompleted = async (round) => {
    await client.put(`/applications/${application.id}/interview-rounds/${round.id}`, {
      ...round,
      completed: !round.completed,
    })
    const { data } = await client.get(`/applications/${application.id}`)
    onUpdated(data)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete application to ${application.companyName}? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await client.delete(`/applications/${application.id}`)
      onDeleted(application.id)
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-lg p-6 space-y-5 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{application.companyName}</h2>
            <p className="text-sm text-ink/60">{application.roleTitle}</p>
          </div>
          <span className="text-xs font-mono font-medium text-ink/50 uppercase tracking-wide">
            {STATUS_LABELS[application.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-ink/50">Applied</div>
            <div className="font-mono">{application.appliedDate || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-ink/50">Deadline</div>
            <div className="font-mono">{application.deadline || '—'}</div>
          </div>
        </div>

        {application.jobPostingUrl && (
          <a
            href={application.jobPostingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink underline block"
          >
            View job posting →
          </a>
        )}

        <div>
          <label className="block text-xs font-medium text-ink/60 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            className="mt-2 text-xs font-medium text-ink/70 hover:text-ink underline disabled:opacity-50"
          >
            {savingNotes ? 'Saving…' : 'Save notes'}
          </button>
        </div>

        <div>
          <div className="text-xs font-medium text-ink/60 mb-2">Interview rounds</div>
          <div className="space-y-1.5">
            {application.interviewRounds?.length === 0 && (
              <p className="text-sm text-ink/40">No rounds scheduled yet.</p>
            )}
            {application.interviewRounds?.map((round) => (
              <label
                key={round.id}
                className="flex items-center gap-2 text-sm border border-line rounded-md px-3 py-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={round.completed}
                  onChange={() => toggleRoundCompleted(round)}
                />
                <span className={round.completed ? 'line-through text-ink/40' : 'text-ink'}>
                  {round.roundName}
                </span>
                {round.scheduledAt && (
                  <span className="text-xs text-ink/40 font-mono ml-auto">
                    {new Date(round.scheduledAt).toLocaleDateString()}
                  </span>
                )}
              </label>
            ))}
          </div>

          <form onSubmit={addRound} className="flex gap-2 mt-2">
            <input
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              placeholder="e.g. Technical Round 1"
              className="flex-1 border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <input
              type="date"
              value={roundDate}
              onChange={(e) => setRoundDate(e.target.value)}
              className="border border-line rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <button
              type="submit"
              disabled={addingRound}
              className="text-sm font-medium bg-ink text-white px-3 py-2 rounded-md hover:bg-ink/90 transition disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-line">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm font-medium text-rejected hover:underline disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete application'}
          </button>
          <button
            onClick={onClose}
            className="text-sm font-medium text-ink/70 px-4 py-2 rounded-md hover:bg-ink/5 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
