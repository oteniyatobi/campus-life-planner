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

// Render 7-day chart
export function renderChart() {
  const tasks = getTasks();
  const chartEl = document.getElementById('chart-bars');
  chartEl.innerHTML = '';

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = days[date.getDay()];

    const count = tasks.filter(t => t.createdAt.startsWith(dateStr)).length;

    const col = document.createElement('div');
    col.style.cssText = 'flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end;';

    const bar = document.createElement('div');
    bar.style.cssText = `width:100%; background:#185FA5; border-radius:3px 3px 0 0; height:${count > 0 ? Math.max(count * 20, 10) : 4}px; transition: height 0.6s ease;`;
    bar.setAttribute('aria-label', `${dayName}: ${count} tasks`);

    const label = document.createElement('div');
    label.style.cssText = 'font-size:11px; color:#888; font-family:Inter,sans-serif;';
    label.textContent = dayName;

    col.appendChild(bar);
    col.appendChild(label);
    chartEl.appendChild(col);
  }
}
// Render reminders page
export function renderReminders() {
  const tasks = getTasks();
  const today = new Date().toISOString().split('T')[0];
  const list = document.getElementById('reminders-list');
  const empty = document.getElementById('reminders-empty');
  list.innerHTML = '';

  const overdue = tasks
    .filter(t => t.dueDate < today)
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  const upcoming = tasks
    .filter(t => t.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const all = [...overdue, ...upcoming];

  if (all.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  all.forEach(task => {
    const isOverdue = task.dueDate < today;
    const isToday = task.dueDate === today;

    const card = document.createElement('div');
    card.className = `reminder-card ${isOverdue ? '' : 'upcoming'}`;

    const icon = document.createElement('div');
    icon.className = `reminder-icon ${isOverdue ? '' : 'blue'}`;
    icon.innerHTML = `<span class="material-icons">${isOverdue ? 'warning' : 'schedule'}</span>`;

    const body = document.createElement('div');
    body.className = 'reminder-body';
    body.innerHTML = `
      <div class="reminder-title">${task.title}</div>
      <div class="reminder-sub">${task.dueDate} · ${task.duration} min · ${task.priority}</div>
    `;

    const time = document.createElement('div');
    time.className = 'reminder-time';
    time.style.color = isOverdue ? '#C8102E' : '#888';
    time.textContent = isOverdue ? 'Overdue' : isToday ? 'Due today' : task.dueDate;

    card.appendChild(icon);
    card.appendChild(body);
    card.appendChild(time);
    list.appendChild(card);
  });
}
// Render analysis page
export function renderAnalysis() {
  const tasks = getTasks();
  const today = new Date().toISOString().split('T')[0];

  // Tasks by tag
  const tagCount = {};
  tasks.forEach(t => {
    tagCount[t.tag] = (tagCount[t.tag] || 0) + 1;
  });

  const tagChart = document.getElementById('tag-chart');
  tagChart.innerHTML = '';
  Object.entries(tagCount).forEach(([tag, count]) => {
    const percent = Math.round((count / tasks.length) * 100);
    tagChart.innerHTML += `
      <div class="priority-bar-wrap">
        <div class="priority-bar-label">
          <span>${tag}</span>
          <span>${count} tasks (${percent}%)</span>
        </div>
        <div class="priority-track">
          <div class="priority-fill low" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  });

  // Tasks by priority
  const priorityCount = { High: 0, Medium: 0, Low: 0 };
  tasks.forEach(t => {
    if (priorityCount[t.priority] !== undefined) priorityCount[t.priority]++;
  });

  const priorityChart = document.getElementById('priority-chart');
  priorityChart.innerHTML = '';
  Object.entries(priorityCount).forEach(([priority, count]) => {
    const percent = tasks.length ? Math.round((count / tasks.length) * 100) : 0;
    const colorClass = priority === 'High' ? 'high' : priority === 'Medium' ? 'medium' : 'low';
    priorityChart.innerHTML += `
      <div class="priority-bar-wrap">
        <div class="priority-bar-label">
          <span>${priority}</span>
          <span>${count} tasks</span>
        </div>
        <div class="priority-track">
          <div class="priority-fill ${colorClass}" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  });

  // Overdue history
  const overdueTasks = tasks.filter(t => t.dueDate < today);
  const overdueBody = document.getElementById('overdue-body');
  const overdueEmpty = document.getElementById('overdue-empty');
  overdueBody.innerHTML = '';

  if (overdueTasks.length === 0) {
    overdueEmpty.style.display = 'block';
  } else {
    overdueEmpty.style.display = 'none';
    overdueTasks.forEach(task => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Title">${task.title}</td>
        <td data-label="Due Date">${task.dueDate}</td>
        <td data-label="Duration">${task.duration} min</td>
        <td data-label="Priority">${task.priority}</td>
        <td data-label="Tag">${task.tag}</td>
        <td data-label="Actions">—</td>
      `;
      overdueBody.appendChild(tr);
    });
  }

  // Trend chart
  const trendChart = document.getElementById('trend-chart');
  trendChart.innerHTML = '';
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const count = tasks.filter(t => {
      const d = new Date(t.createdAt);
      return d >= weekStart && d <= weekEnd;
    }).length;

    const col = document.createElement('div');
    col.style.cssText = 'flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end;';

    const bar = document.createElement('div');
    bar.style.cssText = `width:100%; background:${i === 0 ? '#C8102E' : '#185FA5'}; border-radius:3px 3px 0 0; height:${count > 0 ? Math.max(count * 15, 10) : 4}px;`;

    const label = document.createElement('div');
    label.style.cssText = 'font-size:11px; color:#888;';
    label.textContent = `Wk ${4 - i}`;

    col.appendChild(bar);
    col.appendChild(label);
    trendChart.appendChild(col);
  }
}
