import { initApp } from './modules/init.js';
import './modules/events.js';
import { initSettings } from './modules/settings.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initSettings();
});