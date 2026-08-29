import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser'

export const AuthenticationMode = Object.freeze({
  SignIn: 'Login',
  SignUp: 'SignUp',
})

export default function Authentication({ authenticationMode }) {
  const { user, setUser, signUp, signIn } = useUser()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    const signFunction =
      authenticationMode === AuthenticationMode.SignUp ? signUp : signIn

    signFunction()
      .then(() => {
        navigate(authenticationMode === AuthenticationMode.SignUp ? '/signin' : '/')
      })
      .catch((error) => {
        alert(error.response ? error.response.data.error.message : error.message)
      })
  }

  return (
    <div className="auth-card">
      <h2>{authenticationMode === AuthenticationMode.SignIn ? 'Sign in' : 'Sign up'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(event) => setUser({ ...user, email: event.target.value })}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={user.password}
            onChange={(event) => setUser({ ...user, password: event.target.value })}
          />
        </div>

        <button type="submit">
          {authenticationMode === AuthenticationMode.SignIn ? 'Login' : 'Submit'}
        </button>

        <div>
          {authenticationMode === AuthenticationMode.SignIn ? (
            <Link to="/signup">No account? Sign up</Link>
          ) : (
            <Link to="/signin">Already signed up? Sign in</Link>
          )}
        </div>
      </form>
    </div>
  )
}
