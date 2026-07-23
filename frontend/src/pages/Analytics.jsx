import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import client from '../api/client'

const STATUS_COLORS = {
  APPLIED: '#64748B',
  INTERVIEW: '#CA8A04',
  OFFER: '#0D9488',
  REJECTED: '#E11D48',
}

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => {
    client.get('/analytics').then((res) => setData(res.data))
  }, [])

  if (!data) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-sm text-ink/50">Crunching your numbers…</div>
  }

  const statusChartData = Object.entries(data.countByStatus).map(([status, count]) => ({
    status,
    count,
  }))

  const weekChartData = Object.entries(data.applicationsPerWeek)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([week, count]) => ({ week, count }))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Analytics</h1>
        <p className="text-sm text-ink/60 mt-0.5">How your search is actually going, in numbers.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total applications" value={data.totalApplications} />
        <StatCard label="Reached interview" value={`${data.interviewConversionRate}%`} accent="text-interview" />
        <StatCard label="Reached offer" value={`${data.offerConversionRate}%`} accent="text-offer" />
        <StatCard
          label="Avg. days to first interview"
          value={data.averageDaysToFirstInterview != null ? data.averageDaysToFirstInterview.toFixed(1) : '—'}
        />
      </div>

      <div className="bg-white border border-line rounded-xl p-5">
        <h2 className="text-sm font-semibold text-ink mb-4">Applications by stage</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={statusChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E5DF" vertical={false} />
            <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#171923' }} axisLine={{ stroke: '#E3E5DF' }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#171923' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #E3E5DF', fontSize: 13 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {statusChartData.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-line rounded-xl p-5">
        <h2 className="text-sm font-semibold text-ink mb-4">Applications sent per week</h2>
        {weekChartData.length === 0 ? (
          <p className="text-sm text-ink/40">No applications logged yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E5DF" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#171923' }} axisLine={{ stroke: '#E3E5DF' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#171923' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E3E5DF', fontSize: 13 }} />
              <Bar dataKey="count" fill="#171923" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, accent = 'text-ink' }) {
  return (
    <div className="bg-white border border-line rounded-xl p-4">
      <div className="text-xs text-ink/50 mb-1">{label}</div>
      <div className={`font-display text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  )
}
