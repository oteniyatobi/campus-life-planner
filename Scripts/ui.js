// ===== UI =====
import { getTasks } from './state.js';

// Render recent tasks on dashboard
export function renderDashboard() {
  const tasks = getTasks();

  // Stat cards
  document.getElementById('stat-total').textContent = tasks.length;

  const today = new Date().toISOString().split('T')[0];
  const overdue = tasks.filter(t => t.dueDate < today);
  const dueToday = tasks.filter(t => t.dueDate === today);

  document.getElementById('stat-overdue').textContent = overdue.length;
  document.getElementById('stat-today').textContent = dueToday.length;

  // Top tag
  const tagCount = {};
  tasks.forEach(t => {
    tagCount[t.tag] = (tagCount[t.tag] || 0) + 1;
  });
  const topTag = Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a])[0] || '—';
  document.getElementById('stat-top-tag').textContent = topTag;

  // Recent tasks table
  const tbody = document.getElementById('recent-tasks-body');
  tbody.innerHTML = '';

  const recent = [...tasks].slice(-5).reverse();

  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:1rem;">No tasks yet. Add one to get started.</td></tr>';
    return;
  }

  recent.forEach(task => {
    const isOverdue = task.dueDate < today;
    const isToday = task.dueDate === today;
    const tr = document.createElement('tr');
    if (isOverdue) tr.style.borderLeft = '3px solid #C8102E';
    if (isToday) tr.style.borderLeft = '3px solid #185FA5';

    tr.innerHTML = `
      <td>${task.title}</td>
      <td>${task.dueDate}</td>
      <td>${task.duration} min</td>
      <td>${task.priority}</td>
      <td>${task.tag}</td>
      <td>—</td>
    `;
    tbody.appendChild(tr);
  });
}

// Render all tasks on tasks page
export function renderTasksPage() {
  const tasks = getTasks();
  const tbody = document.getElementById('tasks-body');
  tbody.innerHTML = '';

  const today = new Date().toISOString().split('T')[0];

  if (tasks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:1rem;">No tasks yet. Add one to get started.</td></tr>';
    return;
  }

  tasks.forEach(task => {
    const isOverdue = task.dueDate < today;
    const isToday = task.dueDate === today;
    const tr = document.createElement('tr');
    if (isOverdue) tr.classList.add('overdue-row');
    if (isToday) tr.classList.add('today-row');

    tr.innerHTML = `
      <td>${task.title}</td>
      <td>${task.dueDate}</td>
      <td>${task.duration} min</td>
      <td>${task.priority}</td>
      <td>${task.tag}</td>
      <td>
        <button class="btn-edit" data-id="${task.id}" aria-label="Edit ${task.title}">
          <span class="material-icons">edit</span>
        </button>
        <button class="btn-delete" data-id="${task.id}" aria-label="Delete ${task.title}">
          <span class="material-icons">delete</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}