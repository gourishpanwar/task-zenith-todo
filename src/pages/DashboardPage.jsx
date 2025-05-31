// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../services/todoService';
import TodoItem from '../components/TodoItem'; // Import TodoItem
import { PlusCircleIcon } from '@heroicons/react/24/solid';

function DashboardPage() {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    setLoadingTodos(true);
    setError('');
    // getTodos returns an unsubscribe function for real-time listener
    const unsubscribe = getTodos(currentUser.uid, (fetchedTodos) => {
      setTodos(fetchedTodos);
      setLoadingTodos(false);
    }, (err) => {
        console.error(err);
        setError("Failed to load tasks. Please try again later.");
        setLoadingTodos(false);
    });

    // Cleanup: unsubscribe when component unmounts or currentUser changes
    return () => unsubscribe();
  }, [currentUser]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim() || !currentUser) return;
    try {
      await addTodo(currentUser.uid, newTodoText);
      setNewTodoText(''); // Clear input field
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error(err);
    }
  };

  const handleToggleComplete = async (todoId, completed) => {
    if (!currentUser) return;
    try {
      await updateTodo(currentUser.uid, todoId, { completed });
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  };

  const handleUpdateTodoText = async (todoId, newText) => {
    if (!currentUser || !newText.text.trim()) return;
    try {
      await updateTodo(currentUser.uid, todoId, { text: newText.text.trim() });
    } catch (err) {
      setError('Failed to update task text. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!currentUser) return;
    try {
      await deleteTodo(currentUser.uid, todoId);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-text dark:text-dark-text mb-2">
                Welcome, {currentUser?.displayName || currentUser?.email}!
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Manage your tasks efficiently.
            </p>
        </div>

        {error && <p className="my-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm" role="alert">{error}</p>}

        <form onSubmit={handleAddTodo} className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 p-3 bg-light-card dark:bg-dark-card rounded-xl shadow-custom-light dark:shadow-custom-dark">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            className="p-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-dark-bg transition-colors"
            aria-label="Add task"
          >
            <PlusCircleIcon className="h-6 w-6" />
          </button>
        </form>

        {loadingTodos && <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-4">Loading your tasks...</p>}

        {!loadingTodos && todos.length === 0 && !error && (
          <div className="text-center py-10 px-6 bg-light-card dark:bg-dark-card rounded-xl shadow-custom-light dark:shadow-custom-dark">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-light-text dark:text-dark-text">No tasks yet!</h3>
            <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">Get started by adding your first task above.</p>
          </div>
        )}

        {/* Active Todos */}
        {activeTodos.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-light-text dark:text-dark-text">
                    Active Tasks <span className="text-sm font-normal text-primary">({activeTodos.length})</span>
                </h2>
                <ul className="space-y-2">
                    {activeTodos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTodo}
                        onUpdate={handleUpdateTodoText}
                    />
                    ))}
                </ul>
            </div>
        )}

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
            <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-light-text dark:text-dark-text">
                    Completed Tasks <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({completedTodos.length})</span>
                </h2>
                <ul className="space-y-2">
                    {completedTodos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTodo}
                        onUpdate={handleUpdateTodoText} // Editing completed tasks might be disabled in TodoItem
                    />
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;