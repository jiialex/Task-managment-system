import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/newproject.css';

interface ProjectForm {
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
}

interface StoredProject extends ProjectForm {
  id: number;
  created_at: string;
}

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    status: 'planning'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const existingProjectsJSON = localStorage.getItem('projects');
      const existingProjects: StoredProject[] = existingProjectsJSON ? JSON.parse(existingProjectsJSON) : [];

      const newProject: StoredProject = {
        id: Math.max(0, ...existingProjects.map((p: StoredProject) => p.id)) + 1,
        ...formData,
        created_at: new Date().toISOString().split('T')[0]
      };

      const updatedProjects = [...existingProjects, newProject];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      window.dispatchEvent(new Event('storage'));
      navigate('/projects');
      
    } catch (error) {
      alert('Failed to create project. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div className="new-project-container">
      <div className="new-project-header">
        <h1 className="new-project-title">Create New Project</h1>
        <p className="new-project-subtitle">Add a new project to your workspace</p>
      </div>
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label className="form-label">Project Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter project title"
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the project..."
            disabled={loading}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Deadline *</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="form-select"
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.deadline}
            className="submit-btn"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;