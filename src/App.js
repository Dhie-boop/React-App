import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Enhanced state management
  const [todos, setTodos] = useState(() => {
    // Load todos from localStorage (if any)
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Format current date as YYYY-MM-DD for the date input min value
  const today = new Date().toISOString().split('T')[0];
  
  // Add new todo with enhanced properties
  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    setTodos([...todos, { 
      id: Date.now(), 
      text: input, 
      completed: false,
      category,
      priority,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    }]);
    
    // Reset input fields
    setInput('');
    setDueDate('');
    setPriority('medium');
  };
  
  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    if (filter === 'high') return todo.priority === 'high';
    if (filter === 'medium') return todo.priority === 'medium';
    if (filter === 'low') return todo.priority === 'low';
    if (filter === 'personal') return todo.category === 'personal';
    if (filter === 'work') return todo.category === 'work';
    if (filter === 'study') return todo.category === 'study';
    return true;
  });

  // Get priority color
  const getPriorityColor = (priority) => {
    return priority === 'high' ? '#ff7675' : 
           priority === 'medium' ? '#fdcb6e' : 
           '#55efc4';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };
  
  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1>Advanced Todo App</h1>
        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {/* Current date display */}
      <div className="current-date">
        Current Date: {new Date().toLocaleDateString()} | 
        User: Dhie-boop
      </div>
      
      {/* Form to add todos */}
      <form onSubmit={addTodo} className="todo-form">
        <div className="form-row">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Add a todo"
            className="todo-input"
          />
        </div>

        <div className="form-row">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
          </select>

          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="priority-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="form-row">
          <input 
            type="date"
            value={dueDate}
            min={today}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
          />
          <button type="submit" className="add-button">Add Todo</button>
        </div>
      </form>
      
      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
        <button onClick={() => setFilter('high')} className={filter === 'high' ? 'active' : ''}>High Priority</button>
        <button onClick={() => setFilter('personal')} className={filter === 'personal' ? 'active' : ''}>Personal</button>
        <button onClick={() => setFilter('work')} className={filter === 'work' ? 'active' : ''}>Work</button>
        <button onClick={() => setFilter('study')} className={filter === 'study' ? 'active' : ''}>Study</button>
      </div>
      
      {/* Stats */}
      <div className="todo-stats">
        <div>Total: {todos.length}</div>
        <div>Completed: {todos.filter(todo => todo.completed).length}</div>
        <div>Active: {todos.filter(todo => !todo.completed).length}</div>
      </div>

      {/* Todo list */}
      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="empty-state">No todos found</li>
        ) : (
          filteredTodos.map(todo => (
            <li 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              style={{ borderLeft: `5px solid ${getPriorityColor(todo.priority)}` }}
            >
              <div className="todo-content">
                <span 
                  className="todo-text" 
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.text}
                </span>
                <div className="todo-details">
                  <span className="todo-category">{todo.category}</span>
                  {todo.dueDate && (
                    <span className="todo-due-date">Due: {formatDate(todo.dueDate)}</span>
                  )}
                </div>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="delete-button">Delete</button>
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      <footer className="app-footer">
        <p>React Todo App - Created on {formatDate(new Date())}</p>
      </footer>
    </div>
  );
}

export default App;