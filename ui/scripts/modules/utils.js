const escapeHTML = (str) => {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (match) => {
    const swap = {'&': '&amp;', '<': '<', '>': '>', '"': '&quot;', "'": '&#39;'};
    return swap[match];
  });
};

const formatRelativeTime = (isoString) => {
  if (!isoString) return 'just now';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'just now';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60000) return 'just now';
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  const diffWeeks = Math.round(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
  const diffYears = Math.round(diffDays / 365);
  return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
};

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  const display = value.toFixed(value >= 10 || i === 0 ? 0 : 1);
  return `${display} ${sizes[i]}`;
};

const formatPriority = (priority = 'medium') => {
  const normalized = typeof priority === 'string' ? priority.toLowerCase() : 'medium';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const parseTagsInput = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
};

const stringifyTags = (tags = []) => {
  if (!Array.isArray(tags) || tags.length === 0) return '';
  return tags.join(', ');
};

const sanitizeFileName = (value) => {
  if (!value) return 'task';
  return value.replace(/[^a-z0-9\-_.]+/gi, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'task';
};

const getFileName = (task, extension) => {
  const safeTitle = sanitizeFileName(task.title || 'task');
  return `${safeTitle}-${task.id || Date.now()}.${extension}`;
};

export {
  escapeHTML,
  formatRelativeTime,
  formatFileSize,
  formatPriority,
  parseTagsInput,
  stringifyTags,
  sanitizeFileName,
  getFileName
};