import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../../services/api';
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaCheck, 
  FaClock,
  FaUser,
  FaProjectDiagram,
  FaCalendarAlt
} from 'react-icons/fa';
import '../../styles/Tasks.css';

interface Task {
  id: number;
  title: string;
  description: string;
  project: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  createdAt: string;
  progress: number;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await tasksAPI.getAll();
      setTasks(tasksData);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please check if backend is running.');
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        await loadTasks(); 
      } catch (error) {
        console.error('Error deleting task:', error);
        setTasks(tasks.filter(task => task.id !== id));
      }
    }
  };

  const markAsComplete = async (id: number) => {
    try {
      await tasksAPI.markComplete(id);
      await loadTasks(); 
    } catch (error) {
      console.error('Error marking task complete:', error);
      setTasks(tasks.map(task => 
        task.id === id 
          ? { ...task, status: 'completed', progress: 100 }
          : task
      ));
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <FaClock className="icon high" />;
      case 'medium': return <FaClock className="icon medium" />;
      case 'low': return <FaClock className="icon low" />;
      default: return <FaClock className="icon medium" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <FaClock className="icon todo" />;
      case 'in-progress': return <FaEdit className="icon in-progress" />;
      case 'review': return <FaCheck className="icon review" />;
      case 'completed': return <FaCheck className="icon completed" />;
      default: return <FaClock className="icon todo" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'review': return 'In Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleNewTask = () => {
    navigate('/tasks/new');
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return '#10b981';
    if (progress >= 70) return '#3b82f6'; 
    if (progress >= 50) return '#f59e0b'; 
    return '#ef4444'; 
  };

  if (loading) {
    return (
      <div className="tasks-container">
        <div className="loading-state">
          <FaClock className="loading-spinner" />
          <h3>Loading tasks...</h3>
        </div>
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="tasks-container">
        <div className="error-state">
          <h3>Error Loading Tasks</h3>
          <p>{error}</p>
          <button onClick={loadTasks} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">Tasks</h1>
        <div className="header-actions">
          <button onClick={loadTasks} className="refresh-button">
            <FaClock /> Refresh
          </button>
          <button className="new-task-button" onClick={handleNewTask}>
            <FaPlus /> New Task
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error} (Showing cached data)
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks created</h3>
          <p>Create, assign, and track tasks.</p>
          <button className="new-task-button" onClick={handleNewTask}>
            <FaPlus /> Create Your First Task
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`task-priority ${task.priority}`}>
                  {getPriorityIcon(task.priority)}
                  {task.priority}
                </span>
              </div>
              
              <p className="task-description">
                {task.description}
              </p>
              
              <div className="task-meta">
                <div className="task-info">
                  <div className="info-item">
                    <FaProjectDiagram className="info-icon" />
                    <span className="task-project">{task.project}</span>
                  </div>
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <span className="task-assignee">{task.assignee}</span>
                  </div>
                </div>
                
                <div className="task-dates">
                  <div className="date-item">
                    <FaCalendarAlt className="date-icon" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                </div>

                {task.status !== 'completed' && (
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${task.progress}%`,
                          backgroundColor: getProgressColor(task.progress)
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">{task.progress}%</span>
                  </div>
                )}
                
                <span className={`task-status ${task.status}`}>
                  {getStatusIcon(task.status)}
                  {getStatusText(task.status)}
                </span>
              </div>

              <div className="task-actions">
                {task.status !== 'completed' && (
                  <button 
                    className="action-btn complete-btn"
                    onClick={() => markAsComplete(task.id)}
                    title="Mark as complete"
                  >
                    <FaCheck /> Complete
                  </button>
                )}
                <button className="action-btn edit-btn" title="Edit task">
                  <FaEdit /> Edit
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;