import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Issues.css';

interface Issue {
  id: number;
  title: string;
  description: string;
  project: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reporter: string;
  assignee: string;
  createdAt: string;
  dueDate: string;
}

const Issues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const savedIssues = localStorage.getItem('issues');
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('issues', JSON.stringify(issues));
  }, [issues]);

  const deleteIssue = (id: number) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      setIssues(issues.filter(issue => issue.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="issues-container">
      <div className="issues-header">
        <h1 className="issues-title">Issues</h1>
        <Link to="/issues/new" className="new-issue-button">
          + New Issue
        </Link>
      </div>

      {issues.length === 0 ? (
        <div className="empty-state">
          <h3>No issues reported</h3>
          <p>Report and track project issues to keep your projects on track</p>
          <Link to="/issues/new" className="new-issue-button" style={{ marginTop: '1rem' }}>
            Report First Issue
          </Link>
        </div>
      ) : (
        <div className="issues-table">
          <div className="table-header">
            <span>Issue</span>
            <span>Project</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {issues.map(issue => (
            <div key={issue.id} className="table-row">
              <div>
                <div className="issue-title">{issue.title}</div>
                <div className="issue-date">Created: {formatDate(issue.createdAt)}</div>
              </div>
              <div className="issue-project">{issue.project}</div>
              <span className={`issue-priority priority-${issue.priority}`}>
                {issue.priority}
              </span>
              <span className={`issue-status status-${issue.status}`}>
                {issue.status.replace('-', ' ')}
              </span>
              <div className="action-buttons">
                <button className="action-btn edit-btn">Edit</button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteIssue(issue.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Issues;