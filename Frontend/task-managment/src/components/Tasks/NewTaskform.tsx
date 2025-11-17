import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaSave, FaCalendar, FaUser, FaProjectDiagram, FaFlag, FaTasks, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/Newtask.css';

interface FormData {
  title: string;
  description: string;
  project: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  progress: number;
}
const createTask = async (taskData: any) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) throw new Error('API not available');
    return await response.json();
  } catch (error) {
    console.log('API not available, using localStorage fallback');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = [...existingTasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    return newTask;
  }
};

const NewTask: React.FC = () => {
  const navigate = useNavigate();
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    project: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    progress: 0
  });

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        handleCancel();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [loading]);

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.project.trim()) errors.push('Project is required');
    if (!formData.assignee.trim()) errors.push('Assignee is required');
    if (!formData.dueDate) errors.push('Due date is required');
    
    const dueDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (formData.dueDate && dueDate < today) {
      errors.push('Due date cannot be in the past');
    }
    
    if (formData.progress < 0 || formData.progress > 100) {
      errors.push('Progress must be between 0 and 100');
    }
    
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'progress' ? parseInt(value) || 0 : value
      };
            if (name === 'status') {
        switch (value) {
          case 'todo':
            newData.progress = 0;
            break;
          case 'in-progress':
            newData.progress = 25;
            break;
          case 'review':
            newData.progress = 75;
            break;
          case 'completed':
            newData.progress = 100;
            break;
        }
      }
      
      return newData;
    });
    
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        project: formData.project.trim(),
        assignee: formData.assignee.trim(),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        progress: formData.progress
      };

      console.log('Creating task:', taskData);
      const result = await createTask(taskData);
      console.log('Task created successfully:', result);
      
      setSuccess(true);
      setUsingFallback(true); 
      
      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      navigate('/tasks');
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim().length > 0 &&
      formData.project.trim().length > 0 &&
      formData.assignee.trim().length > 0 &&
      formData.dueDate.length > 0
    );
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="new-task-container">
      <div className="new-task-card">
        <div className="new-task-header">
          <h1>Create New Task</h1>
          <p>Add a new task to track and manage</p>
        </div>

        {usingFallback && (
          <div className="warning-message">
            <FaExclamationTriangle /> Using local storage (backend not available)
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <FaCheckCircle /> Task created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">
              <FaTasks className="label-icon" />
              Task Title *
            </label>
            <input
              ref={titleInputRef}
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <FaTasks className="label-icon" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the task..."
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="project">
                <FaProjectDiagram className="label-icon" />
                Project *
              </label>
              <input
                type="text"
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                placeholder="Enter project name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="assignee">
                <FaUser className="label-icon" />
                Assignee *
              </label>
              <input
                type="text"
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                required
                placeholder="Enter assignee name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">
                <FaCalendar className="label-icon" />
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={getMinDate()}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">
                <FaFlag className="label-icon" />
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">
                <FaTasks className="label-icon" />
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="progress">
                <FaTasks className="label-icon" />
                Progress (%)
              </label>
              <input
                type="number"
                id="progress"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                min="0"
                max="100"
                disabled={loading}
                className="progress-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              <FaTimes /> Cancel
            </button>
            
            <button
              type="submit"
              className="create-btn"
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <>Creating Task...</>
              ) : (
                <><FaSave /> Create Task</>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NewTask;