// ===== STATE =====
import { loadTasks, saveTasks } from './storage.js';

let tasks = loadTasks();

// Get all tasks
export function getTasks() {
  return tasks;
}

// Add a new task
export function addTask(task) {
  tasks.push(task);
  saveTasks(tasks);
}

// Update an existing task
export function updateTask(id, updatedData) {
  tasks = tasks.map(t => t.id === id ? { ...t, ...updatedData, updatedAt: new Date().toISOString() } : t);
  saveTasks(tasks);
}

// Delete a task
export function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}

// Generate unique id
export function generateId() {
  return 'task_' + Date.now();
}