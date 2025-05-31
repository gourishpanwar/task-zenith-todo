// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, ArrowLeftOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/solid'; // Added UserCircleIcon
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth(); // Get currentUser and logout
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Failed to log out", error);
      // Handle logout error (e.g., display a message)
    }
  };

  return (
    <header className="bg-light-card dark:bg-dark-card shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex flex-col group">
          <h1 className="text-3xl font-bold text-primary group-hover:text-primary-dark dark:group-hover:text-primary-light transition-colors">TaskZenith</h1>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            Created by - Gourish Panwar
          </p>
        </Link>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {currentUser ? (
            <>
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-7 w-7 text-light-text-secondary dark:text-dark-text-secondary hidden sm:block" />
                <span className="text-sm font-medium text-light-text dark:text-dark-text hidden md:block">
                  {currentUser.displayName || currentUser.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 p-2 rounded-md text-sm font-medium text-light-text hover:bg-gray-200 dark:text-dark-text dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-light-text hover:text-primary dark:text-dark-text dark:hover:text-primary-light transition-colors px-2 py-1 sm:px-3 sm:py-1.5 rounded-md">
                Login
              </Link>
              <Link to="/signup" className="text-sm font-medium bg-primary hover:bg-primary-dark text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors">
                Signup
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-indigo-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;