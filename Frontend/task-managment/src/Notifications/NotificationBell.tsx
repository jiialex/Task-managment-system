import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotificationBell.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'task' | 'project' | 'issue';
  relatedId: number;
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const notifications: Notification[] = [
    { 
      id: 1, 
      title: 'New Task Assigned', 
      message: 'You have been assigned a new task: "Design Homepage"', 
      isRead: false, 
      createdAt: new Date().toISOString(),
      type: 'task',
      relatedId: 1
    },
    { 
      id: 2, 
      title: 'Project Update', 
      message: 'Project "Website Redesign" deadline has been updated', 
      isRead: true, 
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'project',
      relatedId: 2
    },
    { 
      id: 3, 
      title: 'Issue Reported', 
      message: 'New issue reported in "Mobile App Development"', 
      isRead: false, 
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'issue',
      relatedId: 3
    },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
   
    switch (notification.type) {
      case 'task':
        navigate('/tasks', { state: { highlightTask: notification.relatedId } });
        break;
      case 'project':
        navigate('/projects', { state: { highlightProject: notification.relatedId } });
        break;
      case 'issue':
        navigate('/issues', { state: { highlightIssue: notification.relatedId } });
        break;
      default:
        navigate('/');
    }
    
    setIsOpen(false);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="notification-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell"
      >
        <svg className="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3 className="notification-title">Notifications</h3>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <h4 className="notification-item-title">
                    {notification.title}
                  </h4>
                  <p className="notification-item-message">
                    {notification.message}
                  </p>
                  <span className="notification-item-time">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;