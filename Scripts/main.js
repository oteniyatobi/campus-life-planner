import { addTask, generateId, deleteTask, updateTask, getTasks } from './state.js';
import { validateForm } from './validator.js';
import { loadSeedIfEmpty } from './storage.js';
import { exportTasks, importTasks } from './storage.js';
import { renderDashboard, renderTasksPage, renderCapBar, renderChart, renderReminders, renderAnalysis } from './ui.js';

// NAVIGATION
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

function showPage(pageId) {
  pages.forEach(page => page.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');
  const targetLink = document.querySelector(`[data-page="${pageId}"]`);
  if (targetLink) targetLink.classList.add('active');
  if (pageId === 'tasks') renderTasksPage();
  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'reminders') renderReminders();
  if (pageId === 'analysis') renderAnalysis();
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = link.getAttribute('data-page');
    showPage(pageId);
    if (navLinksList) navLinksList.classList.remove('open');
  });
});
// FORM
let editingId = null;

function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) errorEl.textContent = message || '';
}

function clearErrors() {
  ['title', 'date', 'duration', 'priority', 'tag'].forEach(field => {
    showError(field, '');
  });
}

document.addEventListener('submit', (e) => {
  const form = e.target;
  if (form.id !== 'task-form') return;
  e.preventDefault();
  clearErrors();

  const data = {
    title: document.getElementById('task-title').value,
    dueDate: document.getElementById('task-date').value,
    duration: document.getElementById('task-duration').value,
    priority: document.getElementById('task-priority').value,
    tag: document.getElementById('task-tag').value,
  };

  const errors = validateForm(data);

  let hasErrors = false;
  if (errors.title) { showError('title', errors.title); hasErrors = true; }
  if (errors.dueDate) { showError('date', errors.dueDate); hasErrors = true; }
  if (errors.duration) { showError('duration', errors.duration); hasErrors = true; }
  if (errors.priority) { showError('priority', errors.priority); hasErrors = true; }
  if (errors.tag) { showError('tag', errors.tag); hasErrors = true; }

  if (hasErrors) {
    document.getElementById('form-status').textContent = 'Please fix the errors above.';
    return;
  }

  const newTask = {
    id: generateId(),
    title: data.title,
    dueDate: data.dueDate,
    duration: parseFloat(data.duration),
    priority: data.priority,
    tag: data.tag,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (editingId) {
    updateTask(editingId, newTask);
    editingId = null;
  } else {
    addTask(newTask);
  }

  renderDashboard();
  form.reset();
  document.getElementById('form-status').textContent = 'Task saved successfully!';
  showPage('dashboard');
});


// DELETE TASK
document.addEventListener('click', (e) => {
  if (e.target.closest('.btn-delete')) {
    const id = e.target.closest('.btn-delete').dataset.id;
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      renderTasksPage();
      renderDashboard();
    }
  }
});

// EDIT TASK
document.addEventListener('click', (e) => {
  if (e.target.closest('.btn-edit')) {
    const id = e.target.closest('.btn-edit').dataset.id;
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('task-title').value = task.title;
    document.getElementById('task-date').value = task.dueDate;
    document.getElementById('task-duration').value = task.duration;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-tag').value = task.tag;

    editingId = id;
    showPage('add-task');
  }
});
loadSeedIfEmpty();

// SEARCH
let currentSort = 'title';

document.addEventListener('input', (e) => {
  if (e.target.id === 'search-input') {
    renderTasksPage(e.target.value, currentSort);
  }
});

// SORT
document.addEventListener('click', (e) => {
  if (e.target.closest('.sort-pill')) {
    const pill = e.target.closest('.sort-pill');
    document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentSort = pill.dataset.sort;
    const searchValue = document.getElementById('search-input').value;
    renderTasksPage(searchValue, currentSort);
  }
});

// SETTINGS
let currentCap = parseInt(localStorage.getItem('campusPlanner:cap') || '600');

document.addEventListener('click', (e) => {
  // Export
  if (e.target.closest('#export-btn')) {
    exportTasks();
  }

  // Import
  if (e.target.closest('#import-btn')) {
    document.getElementById('import-input').click();
  }

  // Save cap
  if (e.target.closest('#save-cap-btn')) {
    const capValue = parseInt(document.getElementById('cap-input').value);
    if (capValue > 0) {
      localStorage.setItem('campusPlanner:cap', capValue);
      currentCap = capValue;
      renderCapBar(currentCap);
      document.getElementById('form-status') && (document.getElementById('form-status').textContent = '');
      alert('Cap saved successfully!');
    }
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'import-input') {
    const file = e.target.files[0];
    if (!file) return;
    importTasks(file)
      .then(() => {
        document.getElementById('import-status').textContent = 'Tasks imported successfully!';
        renderDashboard();
        renderCapBar(currentCap);
      })
      .catch(err => {
        document.getElementById('import-status').textContent = `Import failed: ${err}`;
      });
  }
});

// HAMBURGER MENU
const hamburger = document.getElementById('hamburger-btn');
const navLinksList = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
  });
}

clearErrors();
renderDashboard();
renderCapBar(parseInt(localStorage.getItem('campusPlanner:cap') || '600'));
renderChart();