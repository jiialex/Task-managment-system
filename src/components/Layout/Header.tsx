import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../../Notifications/NotificationBell'; 
import '../../styles/Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div>
        <h1 className="header-title">
          Task Management
        </h1>
      </div>
      
      <div className="header-right">
        <NotificationBell />
        
        <div className="user-info">
          <span className="user-greeting">
            Hello, {user?.name}
          </span>
          <button 
            onClick={logout} 
            className="logout-button"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;