import { Task } from '../types';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Design Homepage',
    description: 'Create new homepage design',
    project: 'Website Redesign',
    assignee: 'John Doe',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-12-15',
    progress: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Fix Login Bug',
    description: 'Resolve authentication issue',
    project: 'Mobile App',
    assignee: 'Jane Smith',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-12-10',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTaskService = {
  getAllTasks: async (): Promise<Task[]> => {
    await delay(800);
    const storedTasks = localStorage.getItem('mockTasks');
    if (storedTasks) {
      return JSON.parse(storedTasks);
    }
    localStorage.setItem('mockTasks', JSON.stringify(mockTasks));
    return mockTasks;
  },

  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    await delay(1000);
    const storedTasks = localStorage.getItem('mockTasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : mockTasks;
    
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title || '',
      description: taskData.description || '',
      project: taskData.project || '',
      assignee: taskData.assignee || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      dueDate: taskData.dueDate || '',
      progress: taskData.progress || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem('mockTasks', JSON.stringify(updatedTasks));
    return newTask;
  },

  getTask: async (id: number): Promise<Task> => {
    await delay(500);
    const storedTasks = localStorage.getItem('mockTasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : mockTasks;
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return task;
  },

  updateTask: async (id: number, taskData: Partial<Task>): Promise<Task> => {
    await delay(600);
    const storedTasks = localStorage.getItem('mockTasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : mockTasks;
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) throw new Error('Task not found');
    
    const updatedTask = { ...tasks[taskIndex], ...taskData, updatedAt: new Date().toISOString() };
    tasks[taskIndex] = updatedTask;
    localStorage.setItem('mockTasks', JSON.stringify(tasks));
    return updatedTask;
  },

  deleteTask: async (id: number): Promise<void> => {
    await delay(400);
    const storedTasks = localStorage.getItem('mockTasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : mockTasks;
    const filteredTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('mockTasks', JSON.stringify(filteredTasks));
  }
};