import { useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

export default function UserProvider({ children }) {
  const savedUser = sessionStorage.getItem('user')
  const [user, setUser] = useState(
    savedUser ? JSON.parse(savedUser) : { email: '', password: '' }
  )

  const signUp = async () => {
    const payload = {
      user: {
        email: user.email?.trim().toLowerCase(),
        password: user.password,
      },
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, payload, {
      headers: { 'Content-Type': 'application/json' },
    })

    sessionStorage.removeItem('user')
    setUser({ email: '', password: '' })
  }

  const signIn = async () => {
    const payload = {
      user: {
        email: user.email?.trim().toLowerCase(),
        password: user.password,
      },
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/signin`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
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
