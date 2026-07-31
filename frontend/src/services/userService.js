import api from './api';

export async function getCurrentUser() {
  const { data } = await api.get('/users/me');
  return data;
}

export async function getUserDashboardStatistics() {
  const { data } = await api.get('/users/me/dashboard');
  return data;
}
