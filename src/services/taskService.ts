import { api } from './api';
import { Task } from '../types';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: number, taskData: Partial<Task>): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  getUserTasks: async (userId: number): Promise<Task[]> => {
    const response = await api.get(`/tasks/user/${userId}`);
    return response.data;
  },

  updateProgress: async (id: number, progress: number): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/progress`, { progress });
    return response.data;
  },
};