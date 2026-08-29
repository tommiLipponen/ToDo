import { useState } from 'react'
import './App.css'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  const addTask = (event) => {
    event.preventDefault()
    const description = task.trim()
    if (!description) return

    setTasks((currentTasks) => [...currentTasks, description])
    setTask('')
  }

  const deleteTask = (deleted) => {
    setTasks((currentTasks) => currentTasks.filter((item) => item !== deleted))
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
          <li key={item}>
            {item}
            <button
              type="button"
              className="delete-button"
              onClick={() => deleteTask(item)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
