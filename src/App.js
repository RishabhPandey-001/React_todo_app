// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
      deadline: deadline || null,
      priority: priority,
      subtasks: [],
    };
    setTodos([...todos, newTodo]);
    setInput("");
    setDeadline("");
    setPriority("Medium");
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const addSubtask = (id) => {
    const subtaskText = prompt("Enter subtask:");
    if (subtaskText) {
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                subtasks: [
                  ...todo.subtasks,
                  { id: Date.now(), text: subtaskText, completed: false },
                ],
              }
            : todo
        )
      );
    }
  };

  const toggleSubtask = (todoId, subtaskId) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: todo.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const searchedTodos = filteredTodos.filter((todo) =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    const today = new Date();
    return (
      new Date(deadline) < today &&
      !new Date(deadline).toDateString().includes(today.toDateString())
    );
  };

  return (
    <div className="app">
      <h1> To-Do App</h1>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Add a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Search & Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Task List */}
      <ul className="todo-list">
        {searchedTodos.map((todo) => (
          <li
            key={todo.id}
            className={`fade-in ${todo.completed ? "completed" : ""} ${
              isOverdue(todo.deadline) && !todo.completed ? "overdue" : ""
            } ${todo.priority.toLowerCase()}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            <span>{todo.text}</span>
            {todo.deadline && (
              <small>
                Deadline: {todo.deadline}{" "}
                {isOverdue(todo.deadline) && !todo.completed && (
                  <span className="warning">⚠️ Overdue</span>
                )}
              </small>
            )}
            <small className="priority-label">{todo.priority} Priority</small>
            <button onClick={() => deleteTodo(todo.id)}>Delete task</button>
            <button
              onClick={() => {
                const newText = prompt("Edit task:", todo.text);
                if (newText) editTodo(todo.id, newText);
              }}
            >
              ✏️ Edit Task
            </button>
            <button onClick={() => addSubtask(todo.id)}>➕ Subtask</button>

            {/* Subtasks */}
            {todo.subtasks.length > 0 && (
              <ul className="subtask-list">
                {todo.subtasks.map((sub) => (
                  <li
                    key={sub.id}
                    className={sub.completed ? "completed" : ""}
                  >
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => toggleSubtask(todo.id, sub.id)}
                    />
                    <span>{sub.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
