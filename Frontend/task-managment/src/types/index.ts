export interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  deadline: string | null;
  progress: number;
  createdBy: User;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string | null;
  progress: number;
  assignedTo: User;
  project: Project;
  createdBy: User;
  createdAt: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  task: Task;
  reportedBy: User;
  assignedTo: User;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}