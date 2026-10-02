import { VISIBILITY } from '../content.js';

const ALL_ON = Object.fromEntries(Object.keys(VISIBILITY).map((k) => [k, true]));
let preview = false;
try {
  const p = new URLSearchParams(window.location.search).get('show');
  if (p === 'all') sessionStorage.setItem('nycatan-show', 'all');
  if (p === 'default') sessionStorage.removeItem('nycatan-show');
  preview = sessionStorage.getItem('nycatan-show') === 'all';
} catch {
  preview = new URLSearchParams(window.location.search).get('show') === 'all';
}

export const IS_PREVIEW = preview;
export const VIS = preview ? ALL_ON : VISIBILITY;
