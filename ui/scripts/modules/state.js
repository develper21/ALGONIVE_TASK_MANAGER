const DEMO_TASKS = [
  {
    id: 'demo-1',
    title: 'Sample Task',
    description: 'This is a sample task to get you started.',
    dueDate: '2025-12-31',
    isCompleted: false,
    priority: 'medium',
    tags: ['demo', 'sample'],
    notes: 'Created as a demo task.',
    attachments: [],
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let tasks = [];
let taskToDeleteId = null;
let draftAttachments = [];
let currentDetailTaskId = null;

const getTodayString = () => new Date().toISOString().split('T')[0];

const loadTasksFromStorage = () => {
  const stored = JSON.parse(localStorage.getItem('tasks'));
  if (!stored || !stored.length) {
    localStorage.setItem('tasks', JSON.stringify(DEMO_TASKS));
    tasks = DEMO_TASKS;
  } else {
    tasks = stored.map(task => ({
      ...task,
      id: task.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      dueDate: task.dueDate || '',
      isCompleted: Boolean(task.isCompleted),
      priority: task.priority || 'medium',
      tags: Array.isArray(task.tags) ? task.tags : (task.tags ? String(task.tags).split(',').map(tag => tag.trim()).filter(Boolean) : []),
      notes: task.notes || '',
      attachments: (Array.isArray(task.attachments) ? task.attachments : []).map(att => ({
        id: att.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: att.name || 'Attachment',
        size: Number(att.size) || 0,
        type: att.type || 'application/octet-stream',
        data: att.data || '',
        uploadedAt: att.uploadedAt || task.updatedAt || task.createdAt
      })),
      isDraft: Boolean(task.isDraft),
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt || task.createdAt
    }));
  }
};

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = (taskData) => {
  const newTask = {
    id: Date.now().toString(),
    ...taskData,
    isCompleted: false,
    isDraft: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks();
  return newTask;
};

const updateTask = (id, updates) => {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex > -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveTasks();
  }
};

const deleteTask = (id) => {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
};

const setTaskToDeleteId = (id) => {
  taskToDeleteId = id;
};

const setCurrentDetailTaskId = (id) => {
  currentDetailTaskId = id;
};

export {
  tasks,
  taskToDeleteId,
  draftAttachments,
  currentDetailTaskId,
  getTodayString,
  loadTasksFromStorage,
  saveTasks,
  addTask,
  updateTask,
  deleteTask,
  setTaskToDeleteId,
  setCurrentDetailTaskId
};