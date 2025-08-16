import React from 'react';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      <main className={isAuthenticated ? 'pt-0' : ''}>
        {children}
      </main>
    </div>
  );
};

export default Layout;