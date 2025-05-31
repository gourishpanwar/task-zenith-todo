// src/services/localTodoService.js

const LOCAL_STORAGE_KEY = 'taskZenith_localTodos';

// Get local todos
export const getLocalTodos = () => {
  const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedTodos ? JSON.parse(storedTodos) : [];
};

// Save local todos
const saveLocalTodos = (todos) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
};

// Add a local todo
export const addLocalTodo = (text) => {
  if (!text.trim()) return;
  const todos = getLocalTodos();
  const newTodo = {
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique local ID
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(), // Store as ISO string
  };
  const updatedTodos = [newTodo, ...todos]; // Add to the beginning
  saveLocalTodos(updatedTodos);
  return newTodo; // Return the added todo
};

// Update a local todo
export const updateLocalTodo = (todoId, updates) => {
  let todos = getLocalTodos();
  todos = todos.map(todo =>
    todo.id === todoId ? { ...todo, ...updates } : todo
  );
  saveLocalTodos(todos);
  return todos.find(t => t.id === todoId);
};

// Delete a local todo
export const deleteLocalTodo = (todoId) => {
  let todos = getLocalTodos();
  todos = todos.filter(todo => todo.id !== todoId);
  saveLocalTodos(todos);
};

// Clear all local todos (useful after migration)
export const clearLocalTodos = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};