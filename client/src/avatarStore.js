// Har bir kasb uchun foydalanuvchi qo'ygan rasm manzili (URL) shu brauzerda saqlanadi.
const KEY = 'avatarUrls';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

export const getAvatarUrl = (fieldId) => read()[fieldId] || '';
export function setAvatarUrl(fieldId, url) {
  const all = read();
  if (url) all[fieldId] = url; else delete all[fieldId];
  localStorage.setItem(KEY, JSON.stringify(all));
}
export const isImageUrl = (u) => /^https?:\/\/\S+$/i.test(u);
