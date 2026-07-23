import { createContext, useContext, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('jt_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password })
    persist(data)
    return data
  }

  const register = async (fullName, email, password) => {
    const { data } = await client.post('/auth/register', { fullName, email, password })
    persist(data)
    return data
  }

  const persist = (data) => {
    localStorage.setItem('jt_token', data.token)
    const userData = { id: data.userId, fullName: data.fullName, email: data.email }
    localStorage.setItem('jt_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('jt_token')
    localStorage.removeItem('jt_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
