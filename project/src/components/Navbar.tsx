import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, LogOut, Menu, X, Bell, Search } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { useTasks } from '../contexts/TaskContext';
import SearchModal from './SearchModal';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, logout } = useAuth();
  const { tasks } = useTasks();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              InkFuse
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/team-collaboration" className={`${isActive('/team-collaboration') ? 'text-blue-500' : theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}>
              Team Collaboration
            </Link>
            <Link to="/analytics" className={`${isActive('/analytics') ? 'text-blue-500' : theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}>
              Analytics
            </Link>
            <button
              onClick={() => setShowSearch(true)}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setShowNotifications(true)}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            >
              <Bell size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`${isActive('/admin/dashboard') ? 'text-blue-500' : theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}
              >
                Admin Dashboard
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={logout}
                className={`flex items-center ${theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}
              >
                <LogOut size={20} className="mr-1" />
                Logout
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <Link to="/team-collaboration" className={`block px-3 py-2 rounded-md ${isActive('/team-collaboration') ? 'bg-blue-500 text-white' : theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              Team Collaboration
            </Link>
            <Link to="/analytics" className={`block px-3 py-2 rounded-md ${isActive('/analytics') ? 'bg-blue-500 text-white' : theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              Analytics
            </Link>
            <button
              onClick={() => {
                setShowSearch(true);
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Search
            </button>
            <button
              onClick={() => {
                setShowNotifications(true);
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Notifications
            </button>
            {isAdmin && (
              <Link to="/admin/dashboard" className={`block px-3 py-2 rounded-md ${isActive('/admin/dashboard') ? 'bg-blue-500 text-white' : theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                Admin Dashboard
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={logout}
                className={`w-full text-left flex items-center px-3 py-2 rounded-md ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <LogOut size={20} className="mr-1" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
      {showNotifications && (
        <NotificationCenter
          onClose={() => setShowNotifications(false)}
          tasks={tasks}
          theme={theme}
        />
      )}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          tasks={tasks}
          theme={theme}
        />
      )}
    </nav>
  );
};

export default Navbar;