const API_BASE = 'http://localhost:3000';

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api', // or your backend URL
  timeout: 10000,
});

export const projectsAPI = {
  getAll: () => fetch(`${API_BASE}/projects`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE}/projects/${id}`).then(res => res.json()),
  create: (project: any) => fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  }).then(res => res.json()),
  update: (id: number, project: any) => fetch(`${API_BASE}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  }).then(res => res.json()),
  delete: (id: number) => fetch(`${API_BASE}/projects/${id}`, { 
    method: 'DELETE' 
  }).then(res => res.json())
};

export const tasksAPI = {
  getAll: () => fetch(`${API_BASE}/tasks`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE}/tasks/${id}`).then(res => res.json()),
  create: (task: any) => fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then(res => res.json()),
  update: (id: number, task: any) => fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then(res => res.json()),
  delete: (id: number) => fetch(`${API_BASE}/tasks/${id}`, { 
    method: 'DELETE' 
  }).then(res => res.json()),
  markComplete: (id: number) => fetch(`${API_BASE}/tasks/${id}/complete`, {
    method: 'PATCH'
  }).then(res => res.json())
};

export const usersAPI = {
  getAll: () => fetch(`${API_BASE}/users`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE}/users/${id}`).then(res => res.json()),
  create: (user: any) => fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }).then(res => res.json()),
  update: (id: number, user: any) => fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }).then(res => res.json()),
  delete: (id: number) => fetch(`${API_BASE}/users/${id}`, { 
    method: 'DELETE' 
  }).then(res => res.json())
};