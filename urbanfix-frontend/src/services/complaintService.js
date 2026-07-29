import api from './api';
import { cleanParams } from '../utils/apiParams';

export async function createComplaint(complaint, image) {
  const formData = new FormData();

  formData.append(
    'request',
    new Blob([JSON.stringify(cleanParams(complaint))], { type: 'application/json' }),
  );

  if (image) {
    formData.append('image', image);
  }

  const { data } = await api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getComplaints(params) {
  const { data } = await api.get('/complaints', { params: cleanParams(params) });
  return data;
}

export async function getMyComplaints(params) {
  const { data } = await api.get('/complaints/my', { params: cleanParams(params) });
  return data;
}

export async function getComplaintById(complaintId) {
  const { data } = await api.get(`/complaints/${complaintId}`);
  return data;
}

export async function updateComplaint(complaintId, complaint) {
  const { data } = await api.put(`/complaints/${complaintId}`, complaint);
  return data;
}

export async function deleteComplaint(complaintId) {
  const { data } = await api.delete(`/complaints/${complaintId}`);
  return data;
}

export async function searchComplaints(keyword, params) {
  const { data } = await api.get('/complaints/search', { params: cleanParams({ keyword, ...params }) });
  return data;
}

// The backend authorizes this operation for administrators only.
export async function updateComplaintStatus(complaintId, status) {
  const { data } = await api.patch(`/complaints/${complaintId}/status`, { status });
  return data;
}
