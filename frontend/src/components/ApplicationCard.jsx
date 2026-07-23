const STATUS_COLORS = {
  APPLIED: 'bg-applied',
  INTERVIEW: 'bg-interview',
  OFFER: 'bg-offer',
  REJECTED: 'bg-rejected',
}

export default function ApplicationCard({ application, onDragStart, onClick }) {
  const daysAgo = application.appliedDate
    ? Math.floor((Date.now() - new Date(application.appliedDate)) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application)}
      onClick={() => onClick(application)}
      className="bg-white border border-line rounded-lg p-3 mb-2 cursor-pointer hover:border-ink/30 hover:shadow-sm transition select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-sm text-ink">{application.companyName}</div>
          <div className="text-xs text-ink/60 mt-0.5">{application.roleTitle}</div>
        </div>
        <span className={`status-dot ${STATUS_COLORS[application.status]} mt-1`} />
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-ink/50 font-mono">
        <span>{daysAgo !== null ? `${daysAgo}d ago` : '—'}</span>
        {application.interviewRounds?.length > 0 && (
          <span>{application.interviewRounds.length} round{application.interviewRounds.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {application.deadline && (
        <div className="text-xs text-interview mt-1 font-medium">
          Deadline: {application.deadline}
        </div>
      )}
    </div>
  )
}
