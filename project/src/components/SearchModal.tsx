import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Task } from '../types';
import { Link } from 'react-router-dom';

interface SearchModalProps {
  onClose: () => void;
  tasks: Task[];
  theme: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, tasks, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Task[]>([]);

  useEffect(() => {
    const results = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, tasks]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Search Tasks</h2>
          <button
            onClick={onClose}
            className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-grow p-2 border rounded-l-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
            placeholder="Search tasks..."
          />
          <button
            className={`p-2 rounded-r-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {searchResults.map((task, index) => (
            <Link
              key={index}
              to={`/department/${task.department.toLowerCase()}?taskId=${task.id}`}
              onClick={onClose}
              className="block mb-4 p-3 border rounded-md hover:bg-opacity-10 hover:bg-blue-500 transition-colors"
            >
              <p className="font-semibold">{task.title}</p>
              <p className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{task.department} - {task.team}</p>
              <p className="text-sm truncate">{task.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm px-2 py-1 rounded ${getPriorityColor(task.priority, theme)}`}>{task.priority}</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(task.date).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {searchResults.length === 0 && searchTerm && <p>No results found.</p>}
        </div>
      </motion.div>
    </motion.div>
  );
};

const getPriorityColor = (priority: string, theme: string) => {
  const darkMode = theme === 'dark';
  switch (priority.toLowerCase()) {
    case 'high':
      return darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800';
    case 'medium':
      return darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
    case 'low':
      return darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
    default:
      return darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
  }
};

export default SearchModal;