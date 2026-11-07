export const getToken = () => localStorage.getItem('token');

async function req(path, { method = 'GET', body } = {}) {
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: 'Bearer ' + getToken() } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi');
  return data;
}
export const api = {
  get: (p) => req(p),
  post: (p, b) => req(p, { method: 'POST', body: b }),
  patch: (p, b) => req(p, { method: 'PATCH', body: b }),
  del: (p) => req(p, { method: 'DELETE' }),
};
