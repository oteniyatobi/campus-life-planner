// STORAGE 

const KEY = 'campusPlanner:tasks';

// Load tasks from localStorage
export function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

// Save tasks to localStorage
export function saveTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

// Load seed data if localStorage is empty
export function loadSeedIfEmpty() {
  const existing = localStorage.getItem(KEY);
  if (!existing || JSON.parse(existing).length === 0) {
    fetch('./seed.json')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem(KEY, JSON.stringify(data));
        location.reload();
      });
  }
}