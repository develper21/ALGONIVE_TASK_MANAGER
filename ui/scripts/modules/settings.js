// settings.js
import { showToast } from './notifications.js';

// Profile functions
export const loadProfile = () => {
  const profile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Algonive User',
    email: 'user@algonive.com',
    avatar: 'https://i.pravatar.cc/100?img=12'
  };

  // Update UI elements
  const sidebarName = document.getElementById('sidebar-name');
  const topbarGreetingName = document.getElementById('topbar-greeting-name');
  const sidebarEmail = document.getElementById('sidebar-email');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const profileNameInput = document.getElementById('profile-name-input');
  const profileEmailInput = document.getElementById('profile-email-input');
  const profileAvatarInput = document.getElementById('profile-avatar-input');

  if (sidebarName) sidebarName.textContent = profile.name;
  if (topbarGreetingName) topbarGreetingName.textContent = `Welcome Back, ${profile.name}!`;
  if (sidebarEmail) sidebarEmail.textContent = profile.email;
  if (sidebarAvatar) sidebarAvatar.src = profile.avatar;
  if (profileNameInput) profileNameInput.value = profile.name;
  if (profileEmailInput) profileEmailInput.value = profile.email;
  if (profileAvatarInput) profileAvatarInput.value = profile.avatar;
};

export const saveProfile = () => {
  const profileNameInput = document.getElementById('profile-name-input');
  const profileEmailInput = document.getElementById('profile-email-input');
  const profileAvatarInput = document.getElementById('profile-avatar-input');

  const profile = {
    name: profileNameInput?.value || 'Algonive User',
    email: profileEmailInput?.value || 'user@algonive.com',
    avatar: profileAvatarInput?.value || 'https://i.pravatar.cc/100?img=12'
  };

  localStorage.setItem('userProfile', JSON.stringify(profile));
  loadProfile(); // Refresh UI
  showToast('Profile updated successfully!', 'success');
};

// Theme functions
export const applyTheme = (theme) => {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (darkModeToggle) darkModeToggle.checked = true;
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (darkModeToggle) darkModeToggle.checked = false;
  }
};

export const applyThemeColor = (colorString) => {
  if (!colorString) return;
  const [color, hover] = colorString.split('|');
  document.documentElement.style.setProperty('--primary-color', color);
  document.documentElement.style.setProperty('--primary-hover', hover);
  
  // Auto-check the first theme color radio button
  const radioToCheck = document.querySelector('input[name="theme-color"]');
  if (radioToCheck) radioToCheck.checked = true;
};

// Clear data function
export const clearAllData = () => {
  localStorage.removeItem('tasks');
  showToast('All tasks have been deleted.', 'error');
};

// Initialize settings event listeners
export const initSettings = () => {
  // Profile save button
  const profileSaveBtn = document.getElementById('profile-save-btn');
  if (profileSaveBtn) {
    profileSaveBtn.addEventListener('click', saveProfile);
  }

  // Dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      const theme = darkModeToggle.checked ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Theme color pickers
  const colorPickers = document.querySelectorAll('input[name="theme-color"]');
  colorPickers.forEach(picker => {
    picker.addEventListener('change', (e) => {
      const colorString = e.target.value;
      localStorage.setItem('theme_color', colorString);
      applyThemeColor(colorString);
    });
  });

  // Clear data button
  const clearAllDataBtn = document.getElementById('clear-all-data-btn');
  if (clearAllDataBtn) {
    clearAllDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
        clearAllData();
      }
    });
  }
};