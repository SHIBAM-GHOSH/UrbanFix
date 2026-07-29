import api from './api';

export async function getAdminDashboardStatistics() {
  const { data } = await api.get('/admin/dashboard');
  return data;
}

export async function getCategoryAnalytics() {
  const { data } = await api.get('/admin/dashboard/categories');
  return data;
}

export async function getMonthlyAnalytics() {
  const { data } = await api.get('/admin/dashboard/monthly');
  return data;
}

export async function getAdminComplaints(params) {
  const { data } = await api.get('/admin/complaints', { params });
  return data;
}
