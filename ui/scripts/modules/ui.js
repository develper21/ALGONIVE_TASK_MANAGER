import { tasks, getTodayString } from './state.js';
import { escapeHTML, formatRelativeTime, formatFileSize, formatPriority, stringifyTags } from './utils.js';
import { showToast } from './notifications.js';

// SVG Icons
const ICON_COMPLETE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const ICON_UNDO = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v6h6"></path><path d="M21 12A9 9 0 0 0 6.03 9L3 12m0-6l3 3"></path><path d="M21 21v-6h-6"></path><path d="M3 12a9 9 0 0 0 14.97 3l4.03-3m0 6l-3-3"></path></svg>`;
const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
const ICON_DELETE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 0-2 2H7a2 2 0 0 0-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
const ICON_DOCX = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 13l1.5 3L12 13"></path><path d="M12 13l1.5 3L15 13"></path></svg>`;
const ICON_PDF = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 16h1.5a1.5 1.5 0 0 0 0-3H9v3z"></path><path d="M12 16v-3h1.5a1 1 0 0 1 1 1v2"></path><path d="M15 16h2"></path></svg>`;
const ICON_VIEW = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const ICON_PAPERCLIP = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.2a1 1 0 0 1-1.41-1.41l8.49-8.49"></path></svg>`;

// DOM Elements (example - add all from original file)
const taskList = document.getElementById('task-list');
const tasksCountChip = document.getElementById('tasks-count-chip');
const dashboardView = document.getElementById('dashboard-view');
const tasksView = document.getElementById('tasks-view');
const settingsView = document.getElementById('settings-view');
const navDashboardLink = document.getElementById('nav-dashboard-link');
const navTasksLink = document.getElementById('nav-tasks-link');
const navSettingsLink = document.getElementById('nav-settings-link');

let emptyListToastShown = false;
let lastOverdueToastCount = null;

// Render tasks
const renderTasks = () => {
  taskList.innerHTML = '';
  // Add filter and search logic here
  const filteredTasks = tasks.filter(task => !task.isDraft); // Example filter

  if (filteredTasks.length === 0) {
    renderEmptyState();
    if (tasksCountChip) tasksCountChip.textContent = '0 items';
    if (!emptyListToastShown) {
      showToast('No tasks to display yet. Click "Add Task" to create one.', 'info');
      emptyListToastShown = true;
    }
    return;
  }

  if (emptyListToastShown) emptyListToastShown = false;

  filteredTasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.dataset.id = task.id;

    if (task.isCompleted) taskCard.classList.add('completed');
    if (task.isDraft) taskCard.classList.add('is-draft');

    const priorityClass = `priority-pill priority-pill--${task.priority || 'medium'}`;
    const priorityLabel = formatPriority(task.priority);

    const tagsMarkup = stringifyTags(task.tags)
      ? task.tags.map(tag => `<span class="task-tag">${escapeHTML(tag)}</span>`).join('')
      : '<span class="task-tag task-tag--empty">Untagged</span>';

    const attachmentsCount = Array.isArray(task.attachments) ? task.attachments.length : 0;
    const attachmentsMarkup = attachmentsCount > 0
      ? `<span class="task-attachments-count">${ICON_PAPERCLIP}<span>${attachmentsCount} file${attachmentsCount === 1 ? '' : 's'}</span></span>`
      : '';

    const dueLabel = task.dueDate ? `Due: ${task.dueDate}` : 'No due date';
    const descriptionText = task.description ? escapeHTML(task.description) : '<span class="task-card-description--empty">No description added.</span>';

    taskCard.innerHTML = `
      <div class="task-card-content">
        <div class="task-card-header">
          <div class="task-card-title-block">
            <span class="task-status ${task.isCompleted ? 'is-completed' : 'is-pending'}">${task.isCompleted ? 'Completed' : 'Pending'}</span>
            <h3>${escapeHTML(task.title)}</h3>
          </div>
          <div class="task-card-actions">
            <div class="task-actions-cluster">
              <button class="btn-icon view-detail-btn" title="View Task">
                ${ICON_VIEW}
              </button>
              <button class="btn-icon ${task.isCompleted ? 'undo-btn' : 'complete-btn'}" title="${task.isCompleted ? 'Mark as Pending' : 'Mark as Completed'}">
                ${task.isCompleted ? ICON_UNDO : ICON_COMPLETE}
              </button>
              <button class="btn-icon edit-btn" title="Edit Task">
                ${ICON_EDIT}
              </button>
              <button class="btn-icon delete-btn" title="Delete Task">
                ${ICON_DELETE}
              </button>
            </div>
            <div class="download-menu">
              <button class="btn btn-secondary download-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download
              </button>
              <div class="download-menu-list">
                <button class="download-option download-docx-btn">
                  ${ICON_DOCX}
                  <span>Download as DOCX</span>
                </button>
                <button class="download-option download-pdf-btn">
                  ${ICON_PDF}
                  <span>Download as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <p class="task-card-description">${descriptionText}</p>
        <div class="task-card-meta">
          <span class="${priorityClass}">${priorityLabel}</span>
          <div class="task-card-tags">${tagsMarkup}</div>
          ${attachmentsMarkup}
        </div>
        <div class="task-card-footer">
          <span class="due-date" title="Updated ${formatRelativeTime(task.updatedAt)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>${dueLabel}</span>
          </span>
        </div>
      </div>
    `;

    taskList.appendChild(taskCard);
  });
};

const renderEmptyState = () => {
  taskList.innerHTML = `
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <h3>All Clear!</h3>
      <p>You have no tasks. Click "Add Task" to get started.</p>
    </div>
  `;
};

export const renderDashboard = () => {
  const todayStr = getTodayString();
  const today = new Date(`${todayStr}T00:00:00`);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  let overdueTasks = 0;
  const dueTodayTasks = [];
  const upcomingTasks = [];

  tasks
    .filter(t => !t.isCompleted && !t.isDraft && t.dueDate)
    .forEach(task => {
      const dueDate = new Date(`${task.dueDate}T00:00:00`);
      if (Number.isNaN(dueDate.getTime())) return;

      if (dueDate < today) {
        overdueTasks++;
      } else if (task.dueDate === todayStr) {
        dueTodayTasks.push(task);
      } else if (dueDate > today && dueDate <= nextWeek) {
        upcomingTasks.push(task);
      }
    });

  // Update dashboard stats
  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statCompleted = document.getElementById('stat-completed');
  const statOverdue = document.getElementById('stat-overdue');
  const listDueToday = document.getElementById('list-due-today');
  const listUpcoming = document.getElementById('list-upcoming');
  const taskChart = document.getElementById('task-chart');
  const chartCenterText = document.getElementById('chart-center-text');
  const legendPendingText = document.getElementById('legend-pending-text');
  const legendCompletedText = document.getElementById('legend-completed-text');

  if (statTotal) statTotal.textContent = totalTasks;
  if (statPending) statPending.textContent = pendingTasks;
  if (statCompleted) statCompleted.textContent = completedTasks;
  if (statOverdue) statOverdue.textContent = overdueTasks;

  if (overdueTasks > 0 && overdueTasks !== lastOverdueToastCount) {
    const message = overdueTasks === 1
      ? 'You have 1 overdue task. Try tackling it next!'
      : `You have ${overdueTasks} overdue tasks. Time to catch up!`;
    showToast(message, 'warning');
  }
  lastOverdueToastCount = overdueTasks;

  // Update task count chips
  const tasksCountChip = document.getElementById('tasks-count-chip');
  const topbarTotalCount = document.getElementById('topbar-total-count');
  if (tasksCountChip) tasksCountChip.textContent = `${tasks.length} Total`;
  if (topbarTotalCount) topbarTotalCount.textContent = tasks.length;

  // Populate due today list
  const emptyMsg = '<li class="empty-list-msg">No tasks found.</li>';
  if (listDueToday) {
    listDueToday.innerHTML = '';
    if (dueTodayTasks.length === 0) {
      listDueToday.innerHTML = emptyMsg;
    } else {
      dueTodayTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="list-title">${escapeHTML(task.title)}</span><span class="list-meta">Updated ${formatRelativeTime(task.updatedAt)}</span>`;
        listDueToday.appendChild(li);
      });
    }
  }

  // Populate upcoming list
  if (listUpcoming) {
    listUpcoming.innerHTML = '';
    if (upcomingTasks.length === 0) {
      listUpcoming.innerHTML = emptyMsg;
    } else {
      upcomingTasks
        .sort((a, b) => new Date(`${a.dueDate}T00:00:00`) - new Date(`${b.dueDate}T00:00:00`))
        .forEach(task => {
          const li = document.createElement('li');
          const attachmentsLabel = Array.isArray(task.attachments) && task.attachments.length > 0
          ? ` · ${formatFileSize(task.attachments.reduce((total, att) => total + (att.size || 0), 0))} attachments`
          : '';
          li.innerHTML = `<span class="list-title">${escapeHTML(task.title)}</span>
                          <span class="list-date">${task.dueDate || 'No due date'}${attachmentsLabel}</span>`;
          listUpcoming.appendChild(li);
        });
    }
  }

  // Update chart
  if (taskChart && chartCenterText) {
    const completedPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    taskChart.style.background = `conic-gradient(
      var(--success-color) 0% ${completedPercent}%,
      var(--warning-color) ${completedPercent}% 100%
    )`;
    chartCenterText.innerHTML = `<span>${completedPercent}%</span><p>Completed</p>`;
  }

  if (legendPendingText) legendPendingText.textContent = `Pending (${pendingTasks})`;
  if (legendCompletedText) legendCompletedText.textContent = `Completed (${completedTasks})`;
};

// View switching
const switchView = (view) => {
  dashboardView.style.display = 'none';
  tasksView.style.display = 'none';
  settingsView.style.display = 'none';

  navDashboardLink.classList.remove('active');
  navTasksLink.classList.remove('active');
  navSettingsLink.classList.remove('active');

  if (view === 'tasks') {
    tasksView.style.display = 'block';
    navTasksLink.classList.add('active');
  } else if (view === 'settings') {
    settingsView.style.display = 'block';
    navSettingsLink.classList.add('active');
  } else if (view === 'dashboard') {
    dashboardView.style.display = 'block';
    navDashboardLink.classList.add('active');
  }
};

export { renderTasks, switchView };