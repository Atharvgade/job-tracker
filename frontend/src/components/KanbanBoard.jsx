import { useState } from 'react'
import ApplicationCard from './ApplicationCard'

const COLUMNS = [
  { key: 'APPLIED', label: 'Applied', accent: 'border-t-applied' },
  { key: 'INTERVIEW', label: 'Interview', accent: 'border-t-interview' },
  { key: 'OFFER', label: 'Offer', accent: 'border-t-offer' },
  { key: 'REJECTED', label: 'Rejected', accent: 'border-t-rejected' },
]

export default function KanbanBoard({ applications, onStatusChange, onCardClick }) {
  const [dragOverCol, setDragOverCol] = useState(null)

  const handleDragStart = (e, application) => {
    e.dataTransfer.setData('applicationId', application.id)
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('applicationId')
    if (id) onStatusChange(Number(id), status)
    setDragOverCol(null)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const items = applications.filter((a) => a.status === col.key)
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverCol(col.key)
            }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`bg-white/60 rounded-lg border-t-[3px] ${col.accent} border-x border-b border-line p-3 min-h-[200px] transition ${
              dragOverCol === col.key ? 'bg-ink/5' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-ink">{col.label}</span>
              <span className="text-xs font-mono text-ink/40">{items.length}</span>
            </div>

            {items.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onDragStart={handleDragStart}
                onClick={onCardClick}
              />
            ))}

            {items.length === 0 && (
              <p className="text-xs text-ink/30 mt-4 text-center">Drop a card here</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
