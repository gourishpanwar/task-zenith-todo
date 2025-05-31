// src/services/todoService.js
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot, // For real-time updates
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  serverTimestamp, // For Firestore server-side timestamp
  writeBatch // For batch operations (like migrating local tasks)
} from 'firebase/firestore';

// Get To-Dos for a specific user (real-time)
export const getTodos = (userId, callback) => {
  if (!userId) return () => {}; // Return an empty unsubscribe function if no userId

  const todosColRef = collection(db, 'users', userId, 'todos');
  const q = query(todosColRef, orderBy('createdAt', 'desc')); // Order by newest first

  // onSnapshot returns an unsubscribe function
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const todos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(todos);
  }, (error) => {
    console.error("Error fetching todos: ", error);
    // Handle error appropriately, maybe call callback with an error state
    callback([]); // Or an error object
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
};

// Add a new To-Do
export const addTodo = async (userId, text) => {
  if (!userId || !text.trim()) return; // Basic validation

  try {
    const todosColRef = collection(db, 'users', userId, 'todos');
    await addDoc(todosColRef, {
      text: text.trim(),
      completed: false,
      createdAt: serverTimestamp(), // Use server timestamp
      userId: userId
    });
  } catch (error) {
    console.error("Error adding todo: ", error);
    throw error; // Re-throw to be handled by the component
  }
};

// Update a To-Do (e.g., toggle completion, edit text)
export const updateTodo = async (userId, todoId, updates) => {
  if (!userId || !todoId) return;

  try {
    const todoDocRef = doc(db, 'users', userId, 'todos', todoId);
    await updateDoc(todoDocRef, updates);
  } catch (error) {
    console.error("Error updating todo: ", error);
    throw error;
  }
};

// Delete a To-Do
export const deleteTodo = async (userId, todoId) => {
  if (!userId || !todoId) return;

  try {
    const todoDocRef = doc(db, 'users', userId, 'todos', todoId);
    await deleteDoc(todoDocRef);
  } catch (error) {
    console.error("Error deleting todo: ", error);
    throw error;
  }
};

// Batch add todos (useful for migrating local tasks)
export const batchAddTodos = async (userId, localTodos) => {
    if (!userId || !localTodos || localTodos.length === 0) return;

    const batch = writeBatch(db);
    const todosColRef = collection(db, 'users', userId, 'todos');

    localTodos.forEach(task => {
        const newTodoRef = doc(todosColRef); // Firestore generates ID
        batch.set(newTodoRef, {
            text: task.text,
            completed: task.completed || false,
            createdAt: task.createdAt ? new Date(task.createdAt) : serverTimestamp(), // Convert if local has string date
            userId: userId
            // If local tasks have IDs, you might want to use them or map them if necessary
            // but generally letting Firestore generate new IDs on migration is simpler.
        });
    });

    try {
        await batch.commit();
        console.log("Local tasks successfully migrated to Firebase.");
    } catch (error) {
        console.error("Error migrating local tasks: ", error);
        throw error;
    }
};
