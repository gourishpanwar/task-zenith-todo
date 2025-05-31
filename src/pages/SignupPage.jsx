// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlusIcon } from '@heroicons/react/24/outline';

function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password should be at least 6 characters');
    }
    setError('');
    setLoading(true);
    try {
      await signup(email, password, displayName || email.split('@')[0]); // Use part of email if display name is empty
      // We'll handle local task migration here later
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError('Failed to create an account. This email might already be in use.');
      console.error("Signup error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 dark:from-primary/20 dark:via-transparent dark:to-secondary/20">
      <div className="w-full max-w-md p-8 space-y-6 bg-light-card dark:bg-dark-card rounded-xl shadow-custom-light dark:shadow-custom-dark">
        <div className="text-center">
            <UserPlusIcon className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-3xl font-extrabold text-light-text dark:text-dark-text">
            Create your account
            </h2>
            <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light">
                Sign in
            </Link>
            </p>
        </div>
        
        {error && <p className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative text-sm" role="alert">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Display Name (Optional)
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent dark:text-dark-text"
            />
          </div>
          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Email address
            </label>
            <input
              id="email-signup"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent dark:text-dark-text"
            />
          </div>
          <div>
            <label htmlFor="password-signup" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Password
            </label>
            <input
              id="password-signup"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent dark:text-dark-text"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent dark:text-dark-text"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-dark-bg disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SignupPage;
