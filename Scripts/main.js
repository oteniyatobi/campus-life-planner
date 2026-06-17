import { validateForm } from './validator.js';

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
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = link.getAttribute('data-page');
    showPage(pageId);
  });
});

// FORM VALIDATION
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

  document.getElementById('form-status').textContent = 'Task saved successfully!';
});