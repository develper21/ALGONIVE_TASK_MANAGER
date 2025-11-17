import {
  tasks,
  loadTasksFromStorage,
  saveTasks,
  addTask,
  updateTask,
  deleteTask,
  draftAttachments,
  taskToDeleteId,
  currentDetailTaskId,
  setTaskToDeleteId,
  setCurrentDetailTaskId
} from './state.js';
import { renderTasks, renderDashboard, switchView } from './ui.js';
import { showToast } from './notifications.js';
import { formatPriority, stringifyTags, formatRelativeTime, formatFileSize, getFileName } from './utils.js';

// DOM Elements
const openModalBtn = document.getElementById('open-modal-btn');
const taskForm = document.getElementById('task-form');
const filterSelect = document.getElementById('filter-select');
const searchInput = document.getElementById('search-input');
const navDashboardLink = document.getElementById('nav-dashboard-link');
const navTasksLink = document.getElementById('nav-tasks-link');
const navSettingsLink = document.getElementById('nav-settings-link');
const taskList = document.getElementById('task-list');
const taskModal = document.getElementById('task-modal');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalSaveDraftBtn = document.getElementById('modal-save-draft-btn');
const closeDetailModalBtn = document.getElementById('close-detail-modal-btn');
const detailModal = document.getElementById('task-detail-modal');
const confirmModal = document.getElementById('confirm-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
const downloadMenuListSelector = '.download-menu-list';
const attachmentInput = document.getElementById('task-attachments');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromStorage();
  renderTasks();
  renderDashboard();

  // Navigation
  navTasksLink?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('tasks');
  });

  navSettingsLink?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('settings');
  });

  navDashboardLink?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('dashboard');
  });

  // Task Form
  taskForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(taskForm);
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      priority: formData.get('priority'),
      tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(Boolean),
      notes: formData.get('notes'),
      attachments: draftAttachments
    };

    const idInput = document.getElementById('task-id-input');
    const id = idInput ? idInput.value : '';

    if (id) {
      updateTask(id, taskData);
      showToast('Task updated successfully!');
    } else {
      addTask(taskData);
      showToast('Task added successfully!');
    }

    renderTasks();
    renderDashboard();
    taskModal?.classList.remove('show');
    resetDraftState();
  });

  // Filters & Search
  filterSelect?.addEventListener('change', renderTasks);
  searchInput?.addEventListener('input', renderTasks);

  // Add Task Button
  openModalBtn?.addEventListener('click', () => {
    taskModal?.classList.add('show');
  });

  // Close Modal
  document.getElementById('close-modal-btn')?.addEventListener('click', () => {
    taskModal?.classList.remove('show');
    resetDraftState();
  });

  modalCancelBtn?.addEventListener('click', () => {
    taskModal?.classList.remove('show');
    resetDraftState();
  });

  modalSaveDraftBtn?.addEventListener('click', () => {
    showToast('Draft saved for later.', 'info');
    taskModal?.classList.remove('show');
  });

  // Task Actions (edit, delete, complete) - add event delegation here
  taskList?.addEventListener('click', (e) => {
    const taskCard = e.target.closest('.task-card');
    if (!taskCard) return;

    const taskId = taskCard.dataset.id;

    if (e.target.closest('.delete-btn')) {
      // Open confirm modal
      setTaskToDeleteId(taskId);
      confirmModal?.classList.add('show');
    } else if (e.target.closest('.edit-btn')) {
      // Open edit modal
    } else if (e.target.closest('.complete-btn')) {
      const existingTask = tasks.find(t => t.id === taskId);
      if (existingTask) {
        updateTask(taskId, { isCompleted: !existingTask.isCompleted });
        const msg = existingTask.isCompleted ? 'Marked as pending.' : 'Task completed!';
        showToast(msg, 'success');
      }
      renderTasks();
      renderDashboard();
    } else if (e.target.closest('.view-detail-btn')) {
      setCurrentDetailTaskId(taskId);
      detailModal?.classList.add('show');
    } else if (e.target.closest('.download-toggle')) {
      e.preventDefault();
      const menu = taskCard.querySelector(downloadMenuListSelector);
      menu?.classList.toggle('active');
    } else if (e.target.closest('.download-docx-btn')) {
      e.preventDefault();
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        showToast('Unable to find task to export.', 'error');
        return;
      }
      exportTaskAsDocx(task)
        .then(() => {
          showToast('DOCX exported successfully.', 'success');
        })
        .catch((error) => {
          console.error('DOCX export failed:', error);
          showToast(error.message || 'Failed to export DOCX.', 'error');
        })
        .finally(() => {
          const menu = taskCard.querySelector(downloadMenuListSelector);
          menu?.classList.remove('active');
        });
    } else if (e.target.closest('.download-pdf-btn')) {
      e.preventDefault();
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        showToast('Unable to find task to export.', 'error');
        return;
      }
      try {
        exportTaskAsPdf(task);
        showToast('PDF exported successfully.', 'success');
      } catch (error) {
        console.error('PDF export failed:', error);
        showToast(error.message || 'Failed to export PDF.', 'error');
      } finally {
        const menu = taskCard.querySelector(downloadMenuListSelector);
        menu?.classList.remove('active');
      }
    }
  });

  confirmDeleteBtn?.addEventListener('click', () => {
    if (taskToDeleteId) {
      deleteTask(taskToDeleteId);
      setTaskToDeleteId(null);
      renderTasks();
      renderDashboard();
      showToast('Task deleted.', 'success');
    }
    confirmModal?.classList.remove('show');
  });

  confirmCancelBtn?.addEventListener('click', () => {
    setTaskToDeleteId(null);
    confirmModal?.classList.remove('show');
  });

  closeDetailModalBtn?.addEventListener('click', () => {
    setCurrentDetailTaskId(null);
    detailModal?.classList.remove('show');
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.download-menu')) return;
    document.querySelectorAll(downloadMenuListSelector).forEach(menu => {
      menu.classList.remove('active');
    });
  });
});

const resolveDocxLib = () => {
  const candidate = window.docx;
  if (candidate?.Document) return candidate;
  if (candidate?.default?.Document) return candidate.default;
  return null;
};

const resolveJsPdfLib = () => {
  const candidate = window.jspdf;
  if (candidate?.jsPDF) return candidate;
  if (candidate?.default?.jsPDF) return candidate.default;
  return null;
};

const exportTaskAsDocx = (task) => {
  const docxLib = resolveDocxLib();
  if (!docxLib) {
    return Promise.reject(new Error('DOCX library not loaded. Please ensure the CDN script is accessible.'));
  }

  const { Document, Packer, Paragraph, TextRun } = docxLib;

  const makeHeading = (text) => new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text, bold: true, size: 28 })]
  });

  const makeParagraph = (text) => new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text, size: 24 })]
  });

  const attachments = Array.isArray(task.attachments) ? task.attachments : [];

  const sections = [
    new Paragraph({
      spacing: { after: 240 },
      children: [new TextRun({ text: task.title || 'Untitled Task', bold: true, size: 40 })]
    }),
    makeParagraph(`Status: ${task.isCompleted ? 'Completed' : 'Pending'}`),
    makeParagraph(`Priority: ${formatPriority(task.priority)}`),
    makeParagraph(`Due Date: ${task.dueDate || 'Not set'}`),
    makeParagraph(`Tags: ${stringifyTags(task.tags) || 'None'}`),
    makeParagraph(`Last Updated: ${formatRelativeTime(task.updatedAt)}`),
    makeHeading('Description'),
    makeParagraph(task.description || 'No description provided.'),
    makeHeading('Notes'),
    makeParagraph(task.notes || 'No notes provided.'),
    makeHeading('Attachments'),
    attachments.length
      ? attachments.map(att => makeParagraph(`${att.name || 'Attachment'} (${formatFileSize(att.size)})`))
      : [makeParagraph('No attachments.')]
  ].flat();

  const doc = new Document({
    sections: [{
      properties: {},
      children: sections
    }]
  });

  return Packer.toBlob(doc).then((blob) => {
    const filename = getFileName(task, 'docx');
    downloadBlob(blob, filename);
  });
};

const exportTaskAsPdf = (task) => {
  const jspdf = resolveJsPdfLib();
  if (!jspdf || !jspdf.jsPDF) {
    throw new Error('PDF library not loaded. Please ensure the CDN script is accessible.');
  }

  const doc = new jspdf.jsPDF();
  const lineHeight = 8;
  let cursorY = 20;

  const addText = (text, options = {}) => {
    const { bold = false, size = 12 } = options;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 180);
    lines.forEach((line) => {
      doc.text(line, 15, cursorY);
      cursorY += lineHeight;
    });
    cursorY += 2;
  };

  addText(task.title || 'Untitled Task', { bold: true, size: 18 });
  addText(`Status: ${task.isCompleted ? 'Completed' : 'Pending'}`);
  addText(`Priority: ${formatPriority(task.priority)}`);
  addText(`Due Date: ${task.dueDate || 'Not set'}`);
  addText(`Tags: ${stringifyTags(task.tags) || 'None'}`);
  addText(`Last Updated: ${formatRelativeTime(task.updatedAt)}`);

  addText('Description', { bold: true });
  addText(task.description || 'No description provided.');

  addText('Notes', { bold: true });
  addText(task.notes || 'No notes provided.');

  const attachments = Array.isArray(task.attachments) ? task.attachments : [];
  addText('Attachments', { bold: true });
  if (attachments.length) {
    attachments.forEach(att => {
      addText(`• ${att.name || 'Attachment'} (${formatFileSize(att.size)})`);
    });
  } else {
    addText('No attachments.');
  }

  const filename = getFileName(task, 'pdf');
  doc.save(filename);
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const resetDraftState = () => {
  draftAttachments.length = 0;
  if (attachmentInput) {
    attachmentInput.value = '';
  }
};