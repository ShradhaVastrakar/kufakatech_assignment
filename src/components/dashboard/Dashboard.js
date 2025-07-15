import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatInterface from '../chat/ChatInterface';
import useStore from '../../store/useStore';

const Dashboard = () => {
  const { darkMode } = useStore();

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <ChatInterface />
    </div>
  );
};

export default Dashboard; 