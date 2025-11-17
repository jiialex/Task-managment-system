import { api } from './api';

export interface Project {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  created_at: string;
}

export const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id: number, projectData: Partial<Project>): Promise<Project> => {
    const response = await api.patch(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  }
};