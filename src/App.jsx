import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Row from './components/Row'

const apiUrl = 'http://localhost:3001'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    axios
      .get(`${apiUrl}/tasks`)
      .then((response) => {
        setTasks(response.data)
      })
      .catch((error) => {
        alert(error.response?.data?.message || error.message || error)
      })
  }, [])

  const addTask = (event) => {
    event.preventDefault()
    const description = task.trim()
    if (!description) return

    const newTask = { description }

    axios
      .post(`${apiUrl}/tasks`, { task: newTask })
      .then((response) => {
        setTasks((currentTasks) => [...currentTasks, response.data])
        setTask('')
      })
      .catch((error) => {
        alert(error.response?.data?.error || error.message || error)
      })
  }

  const deleteTask = (deletedId) => {
    axios
      .delete(`${apiUrl}/tasks/${deletedId}`)
      .then(() => {
        setTasks((currentTasks) =>
          currentTasks.filter((item) => item.id !== deletedId)
        )
      })
      .catch((error) => {
        alert(error.response?.data?.error || error.message || error)
      })
  }

  return (
    <div id="container">
      <h1>Todos</h1>

      <form onSubmit={addTask}>
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
