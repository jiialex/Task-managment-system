import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Projects.css';

import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaEye, 
  FaSync, 
  FaCalendarAlt,
  FaFlag,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { 
  MdLowPriority,
  MdInbox,
  MdPlayCircle,
  MdPauseCircle,
  MdCheckCircle
} from 'react-icons/md';

interface Project {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  created_at: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const mockProjects: Project[] = [
    {
      id: 1,
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      deadline: '2024-12-31',
      priority: 'high',
      status: 'in-progress',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile application for iOS and Android',
      deadline: '2025-03-31',
      priority: 'high',
      status: 'planning',
      created_at: '2024-01-10'
    },
    {
      id: 3,
      title: 'API Integration',
      description: 'Integrate third-party payment and authentication APIs',
      deadline: '2024-11-30',
      priority: 'medium',
      status: 'completed',
      created_at: '2024-01-05'
    },
    {
      id: 4,
      title: 'Database Migration',
      description: 'Migrate from MySQL to PostgreSQL for better performance',
      deadline: '2024-10-15',
      priority: 'medium',
      status: 'on-hold',
      created_at: '2024-01-20'
    }
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProjects(mockProjects);
      
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Using demo data instead.');
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProjects(projects.filter(project => project.id !== id));
        
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <FaExclamationTriangle className="icon high" />;
      case 'medium': return <FaFlag className="icon medium" />;
      case 'low': return <MdLowPriority className="icon low" />;
      default: return <MdLowPriority className="icon medium" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <MdInbox className="icon planning" />;
      case 'in-progress': return <MdPlayCircle className="icon in-progress" />;
      case 'on-hold': return <MdPauseCircle className="icon on-hold" />;
      case 'completed': return <MdCheckCircle className="icon completed" />;
      default: return <MdInbox className="icon planning" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="loading-state">
          <FaSync className="loading-spinner" />
          <h3>Loading projects...</h3>
          <p>Please wait while we fetch your projects</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <div className="error-state">
          <FaExclamationTriangle className="error-icon" />
          <h3>Demo Mode Active</h3>
          <p>{error}</p>
          <div className="projects-grid">
            {mockProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <span className={`project-priority ${project.priority}`}>
                    {getPriorityIcon(project.priority)}
                    {project.priority}
                  </span>
                </div>
                
                <p className="project-description">
                  {project.description || 'No description provided.'}
                </p>
                
                <div className="project-meta">
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <strong>Due:</strong> 
                    <span>{formatDate(project.deadline)}</span>
                  </div>
                  <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <strong>Status:</strong> 
                    <span className={`project-status ${project.status}`}>
                      {getStatusIcon(project.status)}
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FaCheckCircle className="meta-icon" />
                    <strong>Created:</strong> 
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                </div>

                <div className="project-actions">
                  <button className="action-btn view-btn" title="View project">
                    <FaEye /> View
                  </button>
                  <button className="action-btn edit-btn" title="Edit project">
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteProject(project.id)}
                    title="Delete project"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={loadProjects} className="retry-button">
            <FaSync /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1 className="projects-title">Projects</h1>
        <div className="header-actions">
          <button 
            onClick={loadProjects}
            className="refresh-button"
            title="Refresh projects"
          >
            Refresh
          </button>
          <button 
            className="new-project-button"
            onClick={handleNewProject}
          >
            <FaPlus /> New Project
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <FaInfoCircle className="empty-icon" />
          <h3>No projects yet</h3>
          <p>Create your first project to get started!</p>
          <button 
            className="new-project-button" 
            onClick={handleNewProject}
          >
            <FaPlus /> Create Your First Project
          </button>
        </div>
      ) : (
        <>
          <div className="projects-stats">
            <FaInfoCircle /> Total Projects: {projects.length}
          </div>
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <span className={`project-priority ${project.priority}`}>
                    {getPriorityIcon(project.priority)}
                    {project.priority}
                  </span>
                </div>
                
                <p className="project-description">
                  {project.description || 'No description provided.'}
                </p>
                
                <div className="project-meta">
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <strong>Due:</strong> 
                    <span>{formatDate(project.deadline)}</span>
                  </div>
                  <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <strong>Status:</strong> 
                    <span className={`project-status ${project.status}`}>
                      {getStatusIcon(project.status)}
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FaCheckCircle className="meta-icon" />
                    <strong>Created:</strong> 
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                </div>

                <div className="project-actions">
                  <button className="action-btn view-btn" title="View project">
                    <FaEye /> View
                  </button>
                  <button className="action-btn edit-btn" title="Edit project">
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteProject(project.id)}
                    title="Delete project"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;