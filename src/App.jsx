import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Row from './components/Row'
import { useUser } from './context/useUser'

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const { user } = useUser()

  useEffect(() => {
    if (!user?.token) return

    axios
      .get(`${apiUrl}/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        setTasks(response.data)
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message || error.message || error)
      })
  }, [user])

  const addTask = (event) => {
    event.preventDefault()
    const description = task.trim()
    if (!description) return

    const newTask = { description }

    axios
      .post(
        `${apiUrl}/tasks`,
        { task: newTask },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((response) => {
        setTasks((currentTasks) => [...currentTasks, response.data])
        setTask('')
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message || error.message || error)
      })
  }

  const deleteTask = (deletedId) => {
    axios
      .delete(`${apiUrl}/tasks/${deletedId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(() => {
        setTasks((currentTasks) =>
          currentTasks.filter((item) => item.id !== deletedId)
        )
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message || error.message || error)
      })
  }

  return (
    <div id="container">
      <h1>Todos</h1>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          value={task}
          placeholder="Add a task"
          onChange={(event) => setTask(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.map((item) => (
          <Row key={item.id} task={item} onDelete={deleteTask} />
        ))}
      </ul>
    </div>
  )
}

export default App
