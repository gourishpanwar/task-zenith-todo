// src/components/Footer.jsx
import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light-card dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary py-8 px-4 text-center transition-colors duration-300 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="https://www.linkedin.com/in/gourish-panwar-1706702b0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            title="LinkedIn Profile"
            className="text-2xl hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/gourishpanwar/task-zenith-todo.git" // Changed to your general GitHub profile
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="GitHub Profile"
            className="text-2xl hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            <FaGithub />
          </a>
        </div>
        <p className="text-sm mb-1">
          Connect via LinkedIn / View source on GitHub
        </p>
        <p className="text-sm mb-1">
          TaskZenith - Your Modern To-Do Assistant
        </p>
        <p className="text-sm font-medium text-light-text dark:text-dark-text">
          © {currentYear} Created By Gourish Panwar
        </p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);