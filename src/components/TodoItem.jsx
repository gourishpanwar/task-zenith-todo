// src/components/TodoItem.jsx
import React, { useState } from 'react';
import { CheckCircleIcon, TrashIcon, PencilSquareIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';


function TodoItem({ todo, onToggleComplete, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (editText.trim() === '') return; // Prevent empty update
    onUpdate(todo.id, { text: editText });
    setIsEditing(false);
  };

  return (
    <li className={`flex items-center justify-between p-3 sm:p-4 rounded-lg mb-3 transition-all duration-200 ease-in-out
                    ${todo.completed ? 'bg-green-500/10 dark:bg-green-500/20' : 'bg-light-bg dark:bg-dark-bg shadow-sm hover:shadow-md'}
                    border border-gray-200 dark:border-gray-700`}>
      {isEditing ? (
        <div className="flex-grow flex items-center mr-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-grow p-2 border border-primary/50 rounded-md bg-transparent focus:ring-1 focus:ring-primary outline-none text-sm sm:text-base"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
          />
          <button
            onClick={handleUpdate}
            className="p-1.5 sm:p-2 text-green-500 hover:text-green-700 dark:hover:text-green-400 ml-2"
            aria-label="Save task"
          >
            <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={() => { setIsEditing(false); setEditText(todo.text); }}
            className="p-1.5 sm:p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 ml-1"
            aria-label="Cancel edit"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center flex-grow cursor-pointer mr-2" onClick={() => onToggleComplete(todo.id, !todo.completed)}>
            {todo.completed ? (
              <CheckCircleSolidIcon className="h-6 w-6 sm:h-7 sm:w-7 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
            ) : (
              <CheckCircleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400 dark:text-gray-500 group-hover:text-primary mr-3 flex-shrink-0" />
            )}
            <span className={`text-sm sm:text-base ${todo.completed ? 'line-through text-light-text-secondary dark:text-dark-text-secondary' : 'text-light-text dark:text-dark-text'}`}>
              {todo.text}
            </span>
          </div>
          <div className="flex-shrink-0 space-x-1 sm:space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 sm:p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 disabled:opacity-50"
              aria-label="Edit task"
              disabled={todo.completed}
            >
              <PencilSquareIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1.5 sm:p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
              aria-label="Delete task"
            >
              <TrashIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;