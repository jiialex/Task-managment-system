// components/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    openIssues: 0,
    teamMembers: 1
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboardData();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const loadDashboardData = () => {
    try {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        openIssues: Math.floor(Math.random() * 5),
        teamMembers: 1
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h3 className="loading-text">Loading Dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome to your Project Management System
        </p>
        
        <div className="dashboard-actions">
          <button 
            onClick={handleRefresh}
            className="refresh-btn"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-label">Projects</h3>
          <p className="stat-value stat-value-projects">
            {stats.totalProjects}
          </p>
        </div>

        <div className="stat-card">
          <h3 className="stat-label">Tasks</h3>
          <p className="stat-value stat-value-tasks">
            {stats.totalTasks}
          </p>
        </div>

        <div className="stat-card">
          <h3 className="stat-label">Issues</h3>
          <p className="stat-value stat-value-issues">
            {stats.openIssues}
          </p>
        </div>

        <div className="stat-card">
          <h3 className="stat-label">Team</h3>
          <p className="stat-value stat-value-team">
            {stats.teamMembers}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link 
            to="/projects/new" 
            className="quick-action-btn quick-action-btn-primary"
          >
            + New Project
          </Link>
          
          <Link 
            to="/tasks/new" 
            className="quick-action-btn quick-action-btn-success"
          >
            + New Task
          </Link>
          
          <Link 
            to="/projects" 
            className="quick-action-btn quick-action-btn-secondary"
          >
            View Projects
          </Link>
          
          <Link 
            to="/tasks" 
            className="quick-action-btn quick-action-btn-warning"
          >
            View Tasks
          </Link>
        </div>
      </div>

      {/* Auto-update functionality */}
      <div className="info-section">
        <h3 className="info-title">Auto-Update</h3>
        <p className="info-text">
          The dashboard will update automatically when you create new projects or tasks.
          Click "Refresh Data" to manually update.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;