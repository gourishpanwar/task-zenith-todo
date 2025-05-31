// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLocalTodos, addLocalTodo, updateLocalTodo, deleteLocalTodo } from '../services/localTodoService';
import TodoItem from '../components/TodoItem'; // Reuse TodoItem component
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext'; // To check if user is logged in

function HomePage() {
  const { currentUser } = useAuth(); // Check if user is logged in to conditionally show content
  const [localTodos, setLocalTodos] = useState([]);
  const [newLocalTodoText, setNewLocalTodoText] = useState('');

  useEffect(() => {
    // Only load/manage local todos if the user is NOT logged in.
    // If they are logged in, they should be using the dashboard for cloud tasks.
    if (!currentUser) {
      setLocalTodos(getLocalTodos());
    } else {
      setLocalTodos([]); // Clear local todos if user is logged in and on home page
    }
  }, [currentUser]); // Rerun when currentUser state changes

  const handleAddLocalTodo = (e) => {
    e.preventDefault();
    if (!newLocalTodoText.trim()) return;
    const addedTodo = addLocalTodo(newLocalTodoText);
    if (addedTodo) {
      setLocalTodos(prevTodos => [addedTodo, ...prevTodos]);
    }
    setNewLocalTodoText('');
  };

  const handleToggleLocalComplete = (todoId, completed) => {
    updateLocalTodo(todoId, { completed });
    setLocalTodos(getLocalTodos()); // Re-fetch to update state
  };

  const handleUpdateLocalTodoText = (todoId, newText) => {
     if (!newText.text.trim()) return;
    updateLocalTodo(todoId, { text: newText.text.trim() });
    setLocalTodos(getLocalTodos());
  };

  const handleDeleteLocalTodo = (todoId) => {
    deleteLocalTodo(todoId);
    setLocalTodos(getLocalTodos()); // Re-fetch to update state
  };

  const activeLocalTodos = localTodos.filter(todo => !todo.completed);
  const completedLocalTodos = localTodos.filter(todo => todo.completed);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
      <div className="text-center pt-8 pb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-light-text dark:text-dark-text mb-4">
          Welcome to <span className="text-primary">TaskZenith</span>
        </h1>
        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto">
          Organize your tasks effortlessly. Try it out below, or{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            sign up
          </Link>{' '}
          to sync them to the cloud!
        </p>
      </div>

      {/* Only show local todo section if user is not logged in */}
      {!currentUser && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-light-text dark:text-dark-text">
            Your Local Tasks
          </h2>
          <form onSubmit={handleAddLocalTodo} className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 p-3 bg-light-card dark:bg-dark-card rounded-xl shadow-custom-light dark:shadow-custom-dark">
            <input
              type="text"
              value={newLocalTodoText}
              onChange={(e) => setNewLocalTodoText(e.target.value)}
              placeholder="Add a task (stored locally)..."
              className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="submit"
              className="p-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-dark-bg transition-colors"
              aria-label="Add local task"
            >
              <PlusCircleIcon className="h-6 w-6" />
            </button>
          </form>

          {localTodos.length === 0 && (
             <div className="text-center py-10 px-6 bg-light-card dark:bg-dark-card rounded-xl shadow-custom-light dark:shadow-custom-dark">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-light-text dark:text-dark-text">No local tasks yet!</h3>
                <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">Add your first task above to try TaskZenith locally.</p>
            </div>
          )}

          {/* Active Local Todos */}
          {activeLocalTodos.length > 0 && (
              <div className="mb-8">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-light-text dark:text-dark-text">
                      Active <span className="text-sm font-normal text-primary">({activeLocalTodos.length})</span>
                  </h3>
                  <ul className="space-y-2">
                      {activeLocalTodos.map(todo => (
                      <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggleComplete={handleToggleLocalComplete}
                          onDelete={handleDeleteLocalTodo}
                          onUpdate={handleUpdateLocalTodoText}
                      />
                      ))}
                  </ul>
              </div>
          )}

          {/* Completed Local Todos */}
          {completedLocalTodos.length > 0 && (
              <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-light-text dark:text-dark-text">
                      Completed <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({completedLocalTodos.length})</span>
                  </h3>
                  <ul className="space-y-2">
                      {completedLocalTodos.map(todo => (
                      <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggleComplete={handleToggleLocalComplete}
                          onDelete={handleDeleteLocalTodo}
                          onUpdate={handleUpdateLocalTodoText}
                      />
                      ))}
                  </ul>
              </div>
          )}
        </div>
      )}

      {currentUser && (
         <div className="text-center py-10 mt-8">
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                You are logged in. Your tasks are managed in the cloud.
            </p>
            <Link
                to="/dashboard"
                className="mt-4 inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors"
            >
                Go to My Dashboard
            </Link>
         </div>
      )}
    </div>
  );
}
export default HomePage;
