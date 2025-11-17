import { mockTaskService } from './mockTaskService';
import { mockProjectService } from './mockProjectService';

export const mockApi = {
  tasks: mockTaskService,
  projects: mockProjectService
};