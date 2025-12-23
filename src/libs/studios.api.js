import { apiClient } from './apiClient'

const BASE_URL = process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL

export const updateStudioStatus = (studioId, status, token) => {
  return apiClient(`${BASE_URL}/studios/${studioId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
}

export const getStudioById = (studioId, token) => {
  return apiClient(`${BASE_URL}/studio/${studioId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const updateStudio = (id, payload, token) => {
  return apiClient(`${BASE_URL}/studios/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

export const deleteStudio = (studioId, token) => {
  return apiClient(`${BASE_URL}/studios/${studioId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getPlanHistoryById = (studioId, token) => {
  return apiClient(`${BASE_URL}/studioPlanHistory/${studioId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
