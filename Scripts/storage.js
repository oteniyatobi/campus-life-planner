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
// Export tasks as JSON file
export function exportTasks() {
  const tasks = JSON.parse(localStorage.getItem(KEY) || '[]');
  const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campus-planner-tasks.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import tasks from JSON file
export function importTasks(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('Invalid format');
        const valid = data.every(t => t.id && t.title && t.dueDate && t.duration && t.tag);
        if (!valid) throw new Error('Some tasks are missing required fields');
        localStorage.setItem(KEY, JSON.stringify(data));
        resolve(data);
      } catch (err) {
        reject(err.message);
      }
    };
    reader.readAsText(file);
  });
}