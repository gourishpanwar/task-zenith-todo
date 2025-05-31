// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
// Import functions from your services
import { getLocalTodos, clearLocalTodos } from '../services/localTodoService';
import { batchAddTodos } from '../services/todoService'; // Firebase todo service

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to migrate local tasks to Firebase
  async function migrateLocalTasksToFirebase(userId) {
    const localTasks = getLocalTodos();
    if (localTasks.length > 0 && userId) {
      try {
        console.log("Migrating local tasks for user:", userId, localTasks);
        await batchAddTodos(userId, localTasks); // Use the batch function
        clearLocalTodos(); // Clear local tasks after successful migration
        console.log("Local tasks migrated and cleared.");
        // Optionally: show a success message to the user
      } catch (error) {
        console.error("Failed to migrate local tasks:", error);
        // Optionally: show an error message to the user, maybe offer to retry
      }
    }
  }

  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => { // Make this async
        await updateProfile(userCredential.user, { displayName: displayName || email.split('@')[0] });
        // After profile is updated and user is technically signed in:
        await migrateLocalTasksToFirebase(userCredential.user.uid);
        // setCurrentUser will be handled by onAuthStateChanged, but ensure context reflects new user for immediate UI updates
        // Forcing a refresh of user data might be needed if updateProfile doesn't trigger onAuthStateChanged immediately with display name
        // However, migrateLocalTasksToFirebase just needs the UID.
        return userCredential; // Return original credential
      });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => { // Make this async
        await migrateLocalTasksToFirebase(userCredential.user.uid);
        return userCredential; // Return original credential
      });
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
    // We don't need to expose migrateLocalTasksToFirebase directly if it's handled internally by login/signup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}