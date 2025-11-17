import { tasks, loadTasksFromStorage, getTodayString } from './state.js';
import { renderTasks, renderDashboard, switchView } from './ui.js';
import { loadProfile, applyTheme, applyThemeColor } from './settings.js';
import { showToast } from './notifications.js';

export const initApp = () => {
  loadTasksFromStorage();
  loadProfile();

  // Apply saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  // Apply saved theme color
  const savedColor = localStorage.getItem('theme_color') || '#3ECF8E|#32B87B';
  applyThemeColor(savedColor);

  renderTasks();
  renderDashboard();
  checkDeadlinesOnLoad(); // Add deadline check
  switchView('dashboard'); // Default view
};

// Deadline check function (moved from original file)
const checkDeadlinesOnLoad = () => {
  const todayStr = getTodayString();
  let dueTodayCount = 0;

  tasks.forEach(task => {
    if (!task.isCompleted && task.dueDate === todayStr) {
      dueTodayCount++;
    }
  });

  if (dueTodayCount > 0) {
    const message = `You have ${dueTodayCount} task${dueTodayCount > 1 ? 's' : ''} due today!`;
    showToast(message, 'warning');
  }
};