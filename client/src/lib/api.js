/**
 * Thin fetch wrapper. URLs stay relative so the Vite proxy handles dev and a
 * single origin handles production with no change.
 */

const ADMIN_KEY_STORAGE = 'iwt.adminKey';

export const getAdminKey = () => sessionStorage.getItem(ADMIN_KEY_STORAGE) || '';
export const setAdminKey = (key) => sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
export const clearAdminKey = () => sessionStorage.removeItem(ADMIN_KEY_STORAGE);

export class ApiError extends Error {
  constructor({ message, code, fields, status }) {
    super(message || 'Something went wrong.');
    this.code = code;
    this.fields = fields || null;
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, admin = false, isFormData = false } = {}) {
  const headers = {};
  if (!isFormData && body !== undefined) headers['Content-Type'] = 'application/json';
  if (admin) headers['x-admin-key'] = getAdminKey();

  const res = await fetch(path, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError({ ...(payload.error || {}), status: res.status });
  }
  return payload;
}

export const api = {
  // Email verification. Rate limits, expiry and attempt caps all live on the
  // server; these just carry the request.
  sendEmailCode: (email) =>
    request('/api/registrations/verify/send', { method: 'POST', body: { email } }),
  checkEmailCode: (email, code) =>
    request('/api/registrations/verify/check', { method: 'POST', body: { email, code } }),

  submitRegistration: (formData) =>
    request('/api/registrations', { method: 'POST', body: formData, isFormData: true }),

  checkStatus: (email, registrationId) =>
    request(
      `/api/registrations/status?email=${encodeURIComponent(email)}&registrationId=${encodeURIComponent(registrationId)}`,
    ),

  // Badge verification is STAFF ONLY — both calls carry the admin key, so a
  // scanned QR reveals nothing to anyone who is not signed in.
  verifyPass: (token) => request(`/api/verify/${encodeURIComponent(token)}`, { admin: true }),
  checkinPass: (token) =>
    request(`/api/verify/${encodeURIComponent(token)}/checkin`, { method: 'POST', admin: true }),

  adminLogin: (password) => request('/api/admin/login', { method: 'POST', body: { password } }),

  adminList: (params) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null),
    );
    return request(`/api/admin/registrations?${qs}`, { admin: true });
  },

  adminCheckins: () => request('/api/admin/checkins', { admin: true }),

  adminDetail: (id) => request(`/api/admin/registrations/${encodeURIComponent(id)}`, { admin: true }),

  adminReview: (id) =>
    request(`/api/admin/registrations/${encodeURIComponent(id)}/review`, { method: 'POST', admin: true }),

  adminApprove: (id) =>
    request(`/api/admin/registrations/${encodeURIComponent(id)}/approve`, { method: 'POST', admin: true }),

  adminReject: (id, reason) =>
    request(`/api/admin/registrations/${encodeURIComponent(id)}/reject`, {
      method: 'POST',
      body: { reason },
      admin: true,
    }),
};
