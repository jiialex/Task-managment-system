export class CreateProjectDto {
  title: string;
  description?: string;
  deadline: string; 
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  created_by: number; 
}