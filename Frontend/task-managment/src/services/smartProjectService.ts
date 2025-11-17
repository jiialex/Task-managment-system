import { Project } from '../types';
import { mockProjectService } from './mockProjectService';

class SmartProjectService {
  private useMock = false;

  async getAllProjects(): Promise<Project[]> {
    if (!this.useMock) {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          return await response.json();
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        console.warn('Real projects API failed, using mock data');
        this.useMock = true;
      }
    }
    
    return mockProjectService.getAllProjects();
  }

}

export const smartProjectService = new SmartProjectService();