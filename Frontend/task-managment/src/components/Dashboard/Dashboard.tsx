import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFolder, 
  FaTasks, 
  FaExclamationTriangle, 
  FaUsers,
  FaClipboardList,
  FaArrowRight,
  FaPlus,
  FaProjectDiagram,
  FaClock
} from 'react-icons/fa';
import { projectsAPI, tasksAPI, usersAPI } from '../../services/api';
import '../../styles/dashboard.css';

interface Project {
  id: number;
  title: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  created_at: string;
}

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  project: string;
}

interface User {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    totalIssues: 0,
    openIssues: 0,
    teamMembers: 0
  });

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [projects, tasks, users] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getAll(),
        usersAPI.getAll()
      ]);

      const activeProjects = projects.filter((p: Project) => 
        p.status === 'planning' || p.status === 'in-progress'
      ).length;

      const pendingTasks = tasks.filter((t: Task) => 
        t.status !== 'completed'
      ).length;
      const openIssues = Math.floor(Math.random() * 10) + 1;

      setStats({
        totalProjects: projects.length,
        activeProjects,
        totalTasks: tasks.length,
        pendingTasks,
        totalIssues: openIssues + 2, 
        openIssues, 
        teamMembers: users.length
      });

      const sortedProjects = projects
        .sort((a: Project, b: Project) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3);
      setRecentProjects(sortedProjects);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const upcoming = tasks
        .filter((task: Task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate > new Date() && dueDate <= nextWeek && task.status !== 'completed';
        })
        .sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);
      setUpcomingTasks(upcoming);

      const activity = [
        ...projects.slice(0, 2).map((project: Project) => ({
          type: 'project',
          icon: <FaProjectDiagram />,
          mainText: 'New project created',
          detailText: `"${project.title}" was created`,
          time: 'Recently',
          className: 'activity-icon-project'
        })),
        ...tasks.slice(0, 2).map((task: Task) => ({
          type: 'task',
          icon: <FaClipboardList />,
          mainText: 'New task assigned',
          detailText: `"${task.title}" in ${task.project}`,
          time: 'Recently',
          className: 'activity-icon-task'
        }))
      ].sort(() => Math.random() - 0.5).slice(0, 4); 

      setRecentActivity(activity);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'Planning';
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'review': return 'In Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `In ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <FaClock className="loading-spinner" />
          <h3>Loading Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        
        <div className="dashboard-actions">
          <button onClick={loadDashboardData} className="refresh-btn">
            Refresh Data
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon stat-icon-projects">
              <FaFolder />
            </div>
            <div>
              <h3 className="stat-label">Total Projects</h3>
              <p className="stat-value stat-value-projects">{stats.totalProjects}</p>
              <p className="stat-subtext">{stats.activeProjects} Active</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon stat-icon-tasks">
              <FaTasks />
            </div>
            <div>
              <h3 className="stat-label">Total Tasks</h3>
              <p className="stat-value stat-value-tasks">{stats.totalTasks}</p>
              <p className="stat-subtext">{stats.pendingTasks} Pending</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon stat-icon-issues">
              <FaExclamationTriangle />
            </div>
            <div>
              <h3 className="stat-label">Open Issues</h3>
              <p className="stat-value stat-value-issues">{stats.openIssues}</p>
              <p className="stat-subtext">Need attention</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon stat-icon-team">
              <FaUsers />
            </div>
            <div>
              <h3 className="stat-label">Team Members</h3>
              <p className="stat-value stat-value-team">{stats.teamMembers}</p>
              <p className="stat-subtext">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/projects/new" className="quick-action-btn">
            <FaPlus />
            <span>New Project</span>
          </Link>
          <Link to="/tasks/new" className="quick-action-btn">
            <FaPlus />
            <span>New Task</span>
          </Link>
          <Link to="/projects" className="quick-action-btn">
            <FaFolder />
            <span>View Projects</span>
          </Link>
          <Link to="/tasks" className="quick-action-btn">
            <FaTasks />
            <span>View Tasks</span>
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Recent Projects</h2>
            <Link to="/projects" className="view-all-btn">
              View All <FaArrowRight />
            </Link>
          </div>
          
          <div className="projects-list">
            {recentProjects.length === 0 ? (
              <p className="no-data">No projects yet</p>
            ) : (
              recentProjects.map(project => (
                <div key={project.id} className="project-item">
                  <div className="project-info">
                    <h4 className="project-title">{project.title}</h4>
                    <span className={`project-status project-status-${project.status}`}>
                      {getProjectStatusText(project.status)}
                    </span>
                  </div>
                  <span className="project-date">
                    Created {formatDate(project.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Upcoming Tasks</h2>
            <Link to="/tasks" className="view-all-btn">
              View All <FaArrowRight />
            </Link>
          </div>
          
          <div className="tasks-list">
            {upcomingTasks.length === 0 ? (
              <p className="no-data">No upcoming tasks</p>
            ) : (
              upcomingTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4 className="task-title">{task.title}</h4>
                    <div className="task-meta">
                      <span className="task-project">{task.project}</span>
                      <span className={`task-status task-status-${task.status}`}>
                        {getTaskStatusText(task.status)}
                      </span>
                    </div>
                  </div>
                  <span className={`task-due ${getDaysUntilDue(task.dueDate).toLowerCase()}`}>
                    {getDaysUntilDue(task.dueDate)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="activity-section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <button className="view-all-btn">
            View All <FaArrowRight />
          </button>
        </div>
        
        <div className="activity-list">
          {recentActivity.length === 0 ? (
            <p className="no-data">No recent activity</p>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <div className={`activity-icon ${activity.className}`}>
                    {activity.icon}
                  </div>
                  <div className="activity-text">
                    <p className="activity-main-text">{activity.mainText}</p>
                    <p className="activity-detail-text">{activity.detailText}</p>
                  </div>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;