export class CreateTaskDto {
  title: string;
  description: string; 
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  progress: number; 
  projectId: number;
  assignedUserId: number;
}