import { getTasks } from './state.js';
import { filterTasks, compileRegex, highlight } from './search.js';

// Render dashboard
export function renderDashboard() {
  const tasks = getTasks();
  const today = new Date().toISOString().split('T')[0];

  document.getElementById('stat-total').textContent = tasks.length;

  const overdue = tasks.filter(t => t.dueDate < today);
  const dueToday = tasks.filter(t => t.dueDate === today);

  document.getElementById('stat-overdue').textContent = overdue.length;
  document.getElementById('stat-today').textContent = dueToday.length;

  const tagCount = {};
  tasks.forEach(t => {
    tagCount[t.tag] = (tagCount[t.tag] || 0) + 1;
  });
  const topTag = Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a])[0] || '—';
  document.getElementById('stat-top-tag').textContent = topTag;

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

// Render tasks page with search and sort
export function renderTasksPage(searchPattern = '', sortBy = 'title') {
  let tasks = getTasks();
  const today = new Date().toISOString().split('T')[0];

  const re = compileRegex(searchPattern);
  tasks = filterTasks(tasks, searchPattern);

  tasks = [...tasks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'dueDate') return a.dueDate.localeCompare(b.dueDate);
    if (sortBy === 'duration') return a.duration - b.duration;
    if (sortBy === 'priority') {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === 'tag') return a.tag.localeCompare(b.tag);
    return 0;
  });

  const tbody = document.getElementById('tasks-body');
  tbody.innerHTML = '';

  if (tasks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:1rem;">No tasks found.</td></tr>';
    return;
  }

  tasks.forEach(task => {
    const isOverdue = task.dueDate < today;
    const isToday = task.dueDate === today;
    const tr = document.createElement('tr');
    if (isOverdue) tr.classList.add('overdue-row');
    if (isToday) tr.classList.add('today-row');

    const titleHighlighted = highlight(task.title, re);
    const tagHighlighted = highlight(task.tag, re);

    tr.innerHTML = `
      <td>${titleHighlighted}</td>
      <td>${task.dueDate}</td>
      <td>${task.duration} min</td>
      <td>${task.priority}</td>
      <td>${tagHighlighted}</td>
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

// Render cap bar
export function renderCapBar(cap = 600) {
  const tasks = getTasks();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const weeklyTotal = tasks
    .filter(t => new Date(t.createdAt) >= weekStart)
    .reduce((sum, t) => sum + t.duration, 0);

  const percent = Math.min((weeklyTotal / cap) * 100, 100);
  const remaining = cap - weeklyTotal;

  document.getElementById('cap-fill').style.width = `${percent}%`;
  document.getElementById('cap-numbers').textContent = `${weeklyTotal} / ${cap} mins`;

  const message = document.getElementById('cap-message');

  if (weeklyTotal > cap) {
    document.getElementById('cap-fill').style.background = '#C8102E';
    message.textContent = `Cap exceeded by ${weeklyTotal - cap} mins`;
    message.setAttribute('aria-live', 'assertive');
  } else {
    document.getElementById('cap-fill').style.background = '#185FA5';
    message.textContent = `${remaining} mins remaining`;
    message.setAttribute('aria-live', 'polite');
  }
}