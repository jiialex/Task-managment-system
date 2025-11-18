import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  created_at: string;
}

interface DailyProgress {
  date: string;
  hours: number;
  description: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    description: ''
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects));
        } else {
          const initialProjects: Project[] = [
            {
              id: 1,
              title: 'Website Redesign',
              description: 'Complete overhaul of company website',
              deadline: '2024-12-31',
              priority: 'high',
              status: 'in-progress',
              created_at: '2024-01-15'
            },
            {
              id: 2,
              title: 'Mobile App Development',
              description: 'Build cross-platform mobile application',
              deadline: '2025-03-31',
              priority: 'high',
              status: 'planning',
              created_at: '2024-01-10'
            }
          ];
          setProjects(initialProjects);
          localStorage.setItem('projects', JSON.stringify(initialProjects));
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  const handleDeleteProject = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingId(project.id);
  };

  const handleSaveEdit = (id: number) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, ...getEditFormData(id) } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleTrackProgress = (id: number) => {
    setTrackingId(id);
  };

  const handleSaveProgress = () => {
    if (trackingId && dailyProgress.hours > 0) {
      const progressKey = `project_progress_${trackingId}`;
      const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '[]');
      const updatedProgress = [...existingProgress, dailyProgress];
      localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
      
      alert(`Tracked ${dailyProgress.hours} hours for ${getProjectTitle(trackingId)}`);
      setTrackingId(null);
      setDailyProgress({
        date: new Date().toISOString().split('T')[0],
        hours: 0,
        description: ''
      });
    }
  };

  const handleCancelProgress = () => {
    setTrackingId(null);
    setDailyProgress({
      date: new Date().toISOString().split('T')[0],
      hours: 0,
      description: ''
    });
  };

  const getEditFormData = (id: number) => {
    const project = projects.find(p => p.id === id);
    if (!project) return {};
    
    return {
      title: (document.getElementById(`edit-title-${id}`) as HTMLInputElement)?.value || project.title,
      description: (document.getElementById(`edit-desc-${id}`) as HTMLTextAreaElement)?.value || project.description,
      priority: (document.getElementById(`edit-priority-${id}`) as HTMLSelectElement)?.value as 'low' | 'medium' | 'high' || project.priority,
      status: (document.getElementById(`edit-status-${id}`) as HTMLSelectElement)?.value as 'planning' | 'in-progress' | 'on-hold' | 'completed' || project.status
    };
  };

  const getProjectTitle = (id: number) => {
    return projects.find(p => p.id === id)?.title || 'Project';
  };

  const getProgressSummary = (id: number) => {
    const progressKey = `project_progress_${id}`;
    const progress: DailyProgress[] = JSON.parse(localStorage.getItem(progressKey) || '[]');
    const totalHours = progress.reduce((sum, day) => sum + day.hours, 0);
    return { totalHours, days: progress.length };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa94d';
      case 'low': return '#51cf66';
      default: return '#868e96';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#51cf66';
      case 'in-progress': return '#339af0';
      case 'on-hold': return '#ffa94d';
      case 'planning': return '#868e96';
      default: return '#868e96';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Loading projects...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h1>Projects ({projects.length})</h1>
        <button 
          onClick={handleNewProject}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4dabf7',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(77, 171, 247, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#339af0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4dabf7'}
        >
          + New Project
        </button>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {projects.map(project => {
          const progress = getProgressSummary(project.id);
          
          return (
            <div 
              key={project.id} 
              style={{
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'}
            >
              {editingId === project.id ? (
                <div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input
                      id={`edit-title-${project.id}`}
                      defaultValue={project.title}
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        border: '1px solid #dee2e6', 
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="Project title"
                    />
                    <select
                      id={`edit-priority-${project.id}`}
                      defaultValue={project.priority}
                      style={{ 
                        padding: '10px', 
                        border: '1px solid #dee2e6', 
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <textarea
                    id={`edit-desc-${project.id}`}
                    defaultValue={project.description}
                    rows={3}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #dee2e6', 
                      borderRadius: '6px', 
                      marginBottom: '15px',
                      fontSize: '14px'
                    }}
                    placeholder="Project description"
                  />
                  
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <select
                      id={`edit-status-${project.id}`}
                      defaultValue={project.status}
                      style={{ 
                        padding: '10px', 
                        border: '1px solid #dee2e6', 
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleSaveEdit(project.id)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#51cf66',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#40c057'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#51cf66'}
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#868e96',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#868e96'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#2b2d42' }}>{project.title}</h3>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '20px', 
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: getPriorityColor(project.priority),
                      color: 'white',
                      textTransform: 'uppercase'
                    }}>
                      {project.priority}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 15px 0', color: '#6c757d', lineHeight: '1.5' }}>
                    {project.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#6c757d', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <span><strong>Due:</strong> {formatDate(project.deadline)}</span>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(project.status),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {project.status}
                    </span>
                    <span><strong>Created:</strong> {formatDate(project.created_at)}</span>
                  </div>

                  {trackingId === project.id ? (
                    <div style={{ 
                      backgroundColor: '#e7f5ff', 
                      padding: '15px', 
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #a5d8ff'
                    }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#1864ab' }}>Track Daily Progress</h4>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <input
                          type="date"
                          value={dailyProgress.date}
                          onChange={(e) => setDailyProgress({...dailyProgress, date: e.target.value})}
                          style={{ 
                            padding: '8px', 
                            border: '1px solid #a5d8ff', 
                            borderRadius: '6px',
                            backgroundColor: 'white'
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Hours"
                          value={dailyProgress.hours || ''}
                          onChange={(e) => setDailyProgress({...dailyProgress, hours: Number(e.target.value)})}
                          style={{ 
                            width: '80px', 
                            padding: '8px', 
                            border: '1px solid #a5d8ff', 
                            borderRadius: '6px',
                            backgroundColor: 'white'
                          }}
                        />
                      </div>
                      <textarea
                        placeholder="What did you work on today?"
                        value={dailyProgress.description}
                        onChange={(e) => setDailyProgress({...dailyProgress, description: e.target.value})}
                        rows={2}
                        style={{ 
                          width: '100%', 
                          padding: '8px', 
                          border: '1px solid #a5d8ff', 
                          borderRadius: '6px', 
                          marginBottom: '10px',
                          backgroundColor: 'white'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={handleSaveProgress}
                          disabled={dailyProgress.hours <= 0}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#339af0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: dailyProgress.hours > 0 ? 'pointer' : 'not-allowed',
                            fontWeight: '600',
                            fontSize: '14px',
                            opacity: dailyProgress.hours > 0 ? 1 : 0.6,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            if (dailyProgress.hours > 0) {
                              e.currentTarget.style.backgroundColor = '#dfe2e5ff';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (dailyProgress.hours > 0) {
                              e.currentTarget.style.backgroundColor = '#cbd4dbff';
                            }
                          }}
                        >
                          Save Progress
                        </button>
                        <button 
                          onClick={handleCancelProgress}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#868e96',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#868e96'}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #e9ecef'
                    }}>
                      <span style={{ color: '#495057', fontWeight: '500' }}>
                        <strong>Progress:</strong> {progress.totalHours} hours over {progress.days} day{progress.days !== 1 ? 's' : ''}
                      </span>
                      <button 
                        onClick={() => handleTrackProgress(project.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#339af0',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#36414aff'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#717f8bff'}
                      >
                        + Add Time
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleEditProject(project)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ffa94d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff922b'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffa94d'}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fa5252'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No projects found</h3>
          <button 
            onClick={handleNewProject}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4dabf7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              marginTop: '10px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#339af0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4dabf7'}
          >
            Create First Project
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;