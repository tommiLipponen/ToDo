import { useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

export default function UserProvider({ children }) {
  const savedUser = sessionStorage.getItem('user')
  const [user, setUser] = useState(
    savedUser ? JSON.parse(savedUser) : { email: '', password: '' }
  )

  const signUp = async () => {
    const headers = { headers: { 'Content-Type': 'application/json' } }
    await axios.post(
      `${import.meta.env.VITE_API_URL}/users/signup`,
      JSON.stringify({ user }),
      headers
    )
    setUser({ email: '', password: '' })
  }

  const signIn = async () => {
    const headers = { headers: { 'Content-Type': 'application/json' } }
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/signin`,
      JSON.stringify({ user }),
      headers
    )

    const loggedInUser = response.data
    setUser(loggedInUser)
    sessionStorage.setItem('user', JSON.stringify(loggedInUser))
  }

  return (
    <UserContext.Provider value={{ user, setUser, signUp, signIn }}>
      {children}
    </UserContext.Provider>
  )
}
