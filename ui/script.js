document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Elements ---
    
    // Views
    const dashboardView = document.getElementById('dashboard-view');
    const tasksView = document.getElementById('tasks-view');
    const settingsView = document.getElementById('settings-view');

    // Nav Links
    const navDashboardLink = document.getElementById('nav-dashboard-link');
    const navTasksLink = document.getElementById('nav-tasks-link');
    const navSettingsLink = document.getElementById('nav-settings-link');
    
    // Task View Elements
    const taskModal = document.getElementById('task-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterSelect = document.getElementById('filter-select');
    const searchInput = document.getElementById('search-input');
    
    // Task Modal fields
    const modalTitle = document.getElementById('modal-title');
    const taskIdInput = document.getElementById('task-id-input');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskDueDateInput = document.getElementById('task-due-date');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    
    // Task Validation spans
    const titleError = document.getElementById('title-error');
    const dateError = document.getElementById('date-error');

    // Task Confirm Modal elements
    const confirmModal = document.getElementById('confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    
    // Settings View Elements
    const profileNameInput = document.getElementById('profile-name-input');
    const profileEmailInput = document.getElementById('profile-email-input');
    const profileAvatarInput = document.getElementById('profile-avatar-input');
    const profileSaveBtn = document.getElementById('profile-save-btn');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarEmail = document.getElementById('sidebar-email');
    const topbarGreetingName = document.getElementById('topbar-greeting-name');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const colorPickers = document.querySelectorAll('input[name="theme-color"]');
    const clearAllDataBtn = document.getElementById('clear-all-data-btn');
    const clearDataModal = document.getElementById('clear-data-modal');
    const clearDataConfirmBtn = document.getElementById('clear-data-confirm-btn');
    const clearDataCancelBtn = document.getElementById('clear-data-cancel-btn');

    // NEW: Dashboard Elements
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

    // --- 2. State Management ---
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskToDeleteId = null;

    // --- 3. SVG Icons ---
    const ICON_COMPLETE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const ICON_UNDO = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v6h6"></path><path d="M21 12A9 9 0 0 0 6.03 9L3 12m0-6l3 3"></path><path d="M21 21v-6h-6"></path><path d="M3 12a9 9 0 0 0 14.97 3l4.03-3m0 6l-3-3"></path></svg>`;
    const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    const ICON_DELETE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

    // --- 4. NEW: View Switching Logic ---
    const switchView = (view) => {
        // Hide all views
        dashboardView.style.display = 'none';
        tasksView.style.display = 'none';
        settingsView.style.display = 'none';

        // Deactivate all nav links
        navDashboardLink.classList.remove('active');
        navTasksLink.classList.remove('active');
        navSettingsLink.classList.remove('active');

        // Show the selected view and activate its link
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
    
    // --- 5. NEW: Date Helper Function ---
    // Returns date as 'YYYY-MM-DD' string
    const getTodayString = () => {
        return new Date().toISOString().split('T')[0];
    };
    
    // --- 6. NEW: Dashboard Render Function ---
    const renderDashboard = () => {
        const today = new Date(getTodayString()); // Get today at midnight
        const todayStr = getTodayString();
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        // Calculate Stats
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.isCompleted).length;
        const pendingTasks = totalTasks - completedTasks;
        
        let overdueTasks = 0;
        let dueTodayTasks = [];
        let upcomingTasks = [];

        tasks.filter(t => !t.isCompleted).forEach(task => {
            const dueDate = new Date(task.dueDate + 'T00:00:00'); // Task due date at midnight
            
            if (dueDate < today) {
                overdueTasks++;
            } else if (task.dueDate === todayStr) {
                dueTodayTasks.push(task);
            } else if (dueDate > today && dueDate <= nextWeek) {
                upcomingTasks.push(task);
            }
        });

        // 1. Update Stats Cards
        statTotal.textContent = totalTasks;
        statPending.textContent = pendingTasks;
        statCompleted.textContent = completedTasks;
        statOverdue.textContent = overdueTasks;

        // 2. Update Lists
        const emptyMsg = '<li class="empty-list-msg">No tasks found.</li>';
        
        // Due Today
        listDueToday.innerHTML = '';
        if (dueTodayTasks.length === 0) {
            listDueToday.innerHTML = emptyMsg;
        } else {
            dueTodayTasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="list-title">${escapeHTML(task.title)}</span>`;
                listDueToday.appendChild(li);
            });
        }
        
        // Upcoming
        listUpcoming.innerHTML = '';
        if (upcomingTasks.length === 0) {
            listUpcoming.innerHTML = emptyMsg;
        } else {
            // Sort by due date, soonest first
            upcomingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            upcomingTasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="list-title">${escapeHTML(task.title)}</span>
                                <span class="list-date">${task.dueDate}</span>`;
                listUpcoming.appendChild(li);
            });
        }

        // 3. Update Chart
        const completedPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        
        // Set conic-gradient
        taskChart.style.background = `conic-gradient(
            var(--success-color) 0% ${completedPercent}%,
            var(--warning-color) ${completedPercent}% 100%
        )`;
        
        // Set center text
        chartCenterText.innerHTML = `<span>${completedPercent}%</span><p>Completed</p>`;
        
        // Set legend text
        legendPendingText.textContent = `Pending (${pendingTasks})`;
        legendCompletedText.textContent = `Completed (${completedTasks})`;
    };
    
    // --- 7. Settings - Profile Logic ---
    const loadProfile = () => {
        const profile = JSON.parse(localStorage.getItem('userProfile')) || {
            name: 'Algonive User',
            email: 'user@algonive.com',
            avatar: 'https://i.pravatar.cc/100?img=12'
        };

        sidebarName.textContent = profile.name;
        topbarGreetingName.textContent = `Welcome Back, ${profile.name}!`;
        sidebarEmail.textContent = profile.email;
        sidebarAvatar.src = profile.avatar;
        profileNameInput.value = profile.name;
        profileEmailInput.value = profile.email;
        profileAvatarInput.value = profile.avatar;
    };

    // --- 8. Settings - Appearance Logic ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.checked = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            darkModeToggle.checked = false;
        }
    };

    const applyThemeColor = (colorString) => {
        if (!colorString) return;
        
        const [color, hover] = colorString.split('|');
        document.documentElement.style.setProperty('--primary-color', color);
        document.documentElement.style.setProperty('--primary-hover', hover);
        
        const radioToCheck = document.querySelector(`input[name="theme-color"][value="${colorString}"]`);
        if(radioToCheck) radioToCheck.checked = true;
    };
    
    // --- 9. Toast Notification Function ---
    const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        if (type === 'success') icon = ICON_COMPLETE;
        if (type === 'error') icon = '✖';
        if (type === 'warning') icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    };

    // --- 10. Modal Functions (Task + Confirm) ---
    const openTaskModal = (task = null) => {
        taskForm.reset();
        clearValidation();
        if (task) {
            modalTitle.textContent = 'Edit Task';
            formSubmitBtn.textContent = 'Update Task';
            taskIdInput.value = task.id;
            taskTitleInput.value = task.title;
            taskDescInput.value = task.description;
            taskDueDateInput.value = task.dueDate;
        } else {
            modalTitle.textContent = 'Add New Task';
            formSubmitBtn.textContent = 'Save Task';
            taskIdInput.value = '';
        }
        taskModal.classList.add('show');
    };

    const closeTaskModal = () => taskModal.classList.remove('show');

    const openConfirmModal = (id) => {
        taskToDeleteId = id;
        confirmModal.classList.add('show');
    };

    const closeConfirmModal = () => {
        taskToDeleteId = null;
        confirmModal.classList.remove('show');
    };

    // --- 11. Form Validation ---
    const clearValidation = () => {
        titleError.style.display = 'none';
        taskTitleInput.classList.remove('invalid');
        dateError.style.display = 'none';
        taskDueDateInput.classList.remove('invalid');
    };

    const validateForm = () => {
        clearValidation();
        let isValid = true;
        
        if (!taskTitleInput.value.trim()) {
            titleError.style.display = 'block';
            taskTitleInput.classList.add('invalid');
            isValid = false;
        }
        if (!taskDueDateInput.value) {
            dateError.style.display = 'block';
            taskDueDateInput.classList.add('invalid');
            isValid = false;
        }
        return isValid;
    };

    // --- 12. Task Rendering ---
    const renderEmptyState = () => {
        taskList.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h3>All Clear!</h3>
                <p>You have no tasks. Click "Add Task" to get started.</p>
            </div>
        `;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        
        const filterValue = filterSelect.value;
        const searchValue = searchInput.value.toLowerCase(); 

        const filteredTasks = tasks
            .filter(task => {
                if (filterValue === 'completed') return task.isCompleted;
                if (filterValue === 'pending') return !task.isCompleted;
                return true; // 'all'
            })
            .filter(task => {
                return task.title.toLowerCase().includes(searchValue);
            });
        
        // Sort by due date, soonest first
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        if (filteredTasks.length === 0) {
            renderEmptyState();
            return;
        }

        filteredTasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.dataset.id = task.id;

            if (task.isCompleted) {
                taskCard.classList.add('completed');
            }
            
            const now = new Date(getTodayString());
            const dueDate = new Date(task.dueDate + 'T00:00:00'); 
            
            let dueDateClass = '';
            if (dueDate < now && !task.isCompleted) {
                dueDateClass = 'overdue';
            } else if (task.dueDate === getTodayString() && !task.isCompleted) {
                dueDateClass = 'warning'; 
            }

            taskCard.innerHTML = `
                <div class="task-info">
                    <h3>${escapeHTML(task.title)}</h3>
                    <p>${escapeHTML(task.description)}</p>
                    <div class="task-meta">
                        <span class="due-date ${dueDateClass}">
                            Due: ${task.dueDate}
                        </span>
                    </div>
                </div>
                <div class="task-actions">
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
            `;
            
            taskList.appendChild(taskCard);
        });
    };

    // --- 13. Task CRUD Functions ---
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // NEW: Re-render dashboard every time tasks are saved
        renderDashboard();
    };

    // --- 14. Event Listeners ---
    
    // View Switching Listeners
    navTasksLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('tasks');
    });

    navSettingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('settings');
    });

    navDashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('dashboard');
    });

    // Settings: Profile
    profileSaveBtn.addEventListener('click', () => {
        const profile = {
            name: profileNameInput.value || 'Algonive User',
            email: profileEmailInput.value || 'user@algonive.com',
            avatar: profileAvatarInput.value || 'https://i.pravatar.cc/100?img=12'
        };
        
        localStorage.setItem('userProfile', JSON.stringify(profile));
        loadProfile();
        showToast('Profile updated successfully!', 'success');
    });

    // Settings: Appearance
    darkModeToggle.addEventListener('change', () => {
        const theme = darkModeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });

    colorPickers.forEach(picker => {
        picker.addEventListener('change', (e) => {
            const colorString = e.target.value;
            localStorage.setItem('theme_color', colorString);
            applyThemeColor(colorString);
        });
    });

    // Settings: Danger Zone
    clearAllDataBtn.addEventListener('click', () => {
        clearDataModal.classList.add('show');
    });
    
    clearDataCancelBtn.addEventListener('click', () => {
        clearDataModal.classList.remove('show');
    });
    
    clearDataConfirmBtn.addEventListener('click', () => {
        tasks = [];
        localStorage.removeItem('tasks');
        renderTasks(); // Re-render task list
        saveTasks();   // Re-render dashboard
        clearDataModal.classList.remove('show');
        showToast('All tasks have been deleted.', 'error');
    });

    // Task: Form Submit (Add & Edit)
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const id = taskIdInput.value;
        const title = taskTitleInput.value.trim();
        const description = taskDescInput.value.trim();
        const dueDate = taskDueDateInput.value;

        if (id) {
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex > -1) {
                tasks[taskIndex] = { ...tasks[taskIndex], title, description, dueDate };
                showToast('Task updated successfully!');
            }
        } else {
            const newTask = {
                id: Date.now().toString(),
                title, description, dueDate,
                isCompleted: false
            };
            tasks.push(newTask);
            showToast('Task added successfully!');
        }

        saveTasks();
        renderTasks();
        closeTaskModal();
    });

    // Task: List actions (Edit, Delete, Complete)
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const actionButton = target.closest('.btn-icon');
        if (!actionButton) return;

        const taskCard = target.closest('.task-card');
        const taskId = taskCard.dataset.id;
        
        if (actionButton.classList.contains('delete-btn')) {
            openConfirmModal(taskId); 
        } 
        else if (actionButton.classList.contains('edit-btn')) {
            const task = tasks.find(task => task.id === taskId);
            if (task) openTaskModal(task);
        } 
        else if (actionButton.classList.contains('complete-btn') || actionButton.classList.contains('undo-btn')) {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex > -1) {
                tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;
                if(tasks[taskIndex].isCompleted) {
                    showToast('Task marked as complete!', 'success');
                } else {
                    showToast('Task marked as pending.', 'warning');
                }
                saveTasks();
                renderTasks();
            }
        }
    });

    // Task: Modal buttons
    openModalBtn.addEventListener('click', () => openTaskModal(null));
    closeModalBtn.addEventListener('click', closeTaskModal);
    
    // Task: Confirm Modal buttons
    confirmCancelBtn.addEventListener('click', closeConfirmModal);
    confirmDeleteBtn.addEventListener('click', () => {
        if (taskToDeleteId) {
            tasks = tasks.filter(task => task.id !== taskToDeleteId);
            saveTasks();
            renderTasks();
            closeConfirmModal();
            showToast('Task deleted successfully.', 'error');
        }
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === taskModal) closeTaskModal();
        if (e.target === confirmModal) closeConfirmModal();
        if (e.target === clearDataModal) clearDataModal.classList.remove('show');
    });


    // Task: Filters & Search
    filterSelect.addEventListener('change', renderTasks);
    searchInput.addEventListener('input', renderTasks); 

    // --- 15. Utility & Initializers ---
    const escapeHTML = (str) => {
        if (!str) return '';
        return str.replace(/[&<>"']/g, (match) => {
            const swap = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
            return swap[match];
        });
    };
    
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

    // --- Initial Load ---
    const init = () => {
        loadProfile();
        
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        
        const savedColor = localStorage.getItem('theme_color') || '#4F46E5|#4338CA';
        applyThemeColor(savedColor);

        renderTasks();
        renderDashboard(); // NEW: Render dashboard on load
        checkDeadlinesOnLoad();
        
        switchView('dashboard'); // NEW: Default to dashboard
    };
    
    init(); // Run everything on page load
});