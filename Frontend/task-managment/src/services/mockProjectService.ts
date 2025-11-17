import { Project } from '../types';

const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    status: 'in-progress',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    owner: 'John Doe',
    teamMembers: ['John Doe', 'Jane Smith'],
    progress: 65
  },
  {
    id: 2,
    name: 'Mobile App',
    description: 'New cross-platform mobile application',
    status: 'planning',
    startDate: '2024-12-01',
    endDate: '2025-03-31',
    owner: 'Jane Smith',
    teamMembers: ['Jane Smith', 'Mike Johnson'],
    progress: 15
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockProjectService = {
  getAllProjects: async (): Promise<Project[]> => {
    await delay(1000);
    const storedProjects = localStorage.getItem('mockProjects');
    if (storedProjects) {
      return JSON.parse(storedProjects);
    }
    localStorage.setItem('mockProjects', JSON.stringify(mockProjects));
    return mockProjects;
  },

  getProject: async (id: number): Promise<Project> => {
    await delay(600);
    const storedProjects = localStorage.getItem('mockProjects');
    const projects: Project[] = storedProjects ? JSON.parse(storedProjects) : mockProjects;
    const project = projects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  }
};