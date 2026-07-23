import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition ${
      isActive ? 'bg-ink text-white' : 'text-ink/70 hover:bg-ink/5'
    }`

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-line bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">Job Application Tracker</span>
          <div className="flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>Board</NavLink>
            <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink/60 hidden sm:inline">{user?.fullName}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-ink/70 hover:text-ink px-3 py-1.5 rounded-md hover:bg-ink/5 transition"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
