// src/contexts/dashboardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  refreshDashboard: () => void;
  lastUpdated: Date;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshDashboard = () => {
    setLastUpdated(new Date());
  };

  const value = {
    refreshDashboard,
    lastUpdated
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};