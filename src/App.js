import logo from './logo.svg';
import { useState } from 'react';
import './App.css';

function App() {
  // State management (similar to form state in Django)
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  // Add new todo (similar to form handling in Django views)
  const addTodo = (e) => {
    e.preventDefault(); // Prevents page reload (similar to Django form validation)
    if (input.trim() === '') return;
    
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput(''); // Clear input field
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
  
  return (
    <div className="App">
      <h1>Todo App</h1>
      
      {/* Form to add todos (similar to Django form) */}
      <form onSubmit={addTodo}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Add a todo"
        />
        <button type="submit">Add</button>
      </form>
      
      {/* Todo list (similar to template rendering in Django) */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
