import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Flag, CheckSquare, Users, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';

interface TaskCardProps {
  tasks: Task[];
  onClose: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ tasks, onClose }) => {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const { completeTask } = useTasks();

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Tasks for {new Date(tasks[0]?.date).toLocaleDateString()}
          </h2>
          <button
            onClick={onClose}
            className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {tasks.map((task) => (
          <div key={task.id} className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{task.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Calendar size={14} className="mr-1" />
              {new Date(task.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock size={14} className="mr-1" />
              {new Date(task.date).toLocaleTimeString()}
            </div>
            <div className="flex items-center mb-2">
              <Flag size={14} className="mr-2" />
              <span className={`text-sm px-2 py-1 rounded ${getPriorityColor(task.priority, theme)}`}>
                {task.priority}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <Briefcase size={14} className="mr-2" />
              <span className={`text-sm px-2 py-1 rounded ${getDepartmentColor(task.department, theme)}`}>
                {task.department}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <Users size={14} className="mr-2" />
              <span className={`text-sm px-2 py-1 rounded ${getTeamColor(task.team, theme)}`}>
                {task.team}
              </span>
            </div>
            <div className={`mb-2 p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
              <h4 className="font-semibold mb-1">Credits:</h4>
              <span className="text-sm">{task.credits}</span>
            </div>
            {task.deadline && (
              <div className={`mb-2 p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <h4 className="font-semibold mb-1">Deadline:</h4>
                <span className="text-sm">{new Date(task.deadline).toLocaleString()}</span>
              </div>
            )}
            {isAdmin && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className={`flex items-center px-3 py-1 rounded ${
                    task.completed
                      ? theme === 'dark'
                        ? 'bg-green-700 text-green-200'
                        : 'bg-green-200 text-green-800'
                      : theme === 'dark'
                      ? 'bg-blue-700 text-blue-200'
                      : 'bg-blue-200 text-blue-800'
                  } transition-colors`}
                >
                  <CheckSquare size={16} className="mr-2" />
                  {task.completed ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>
            )}
          </div>
        ))}
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
      return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800';
  }
};

const getDepartmentColor = (department: string, theme: string) => {
  const darkMode = theme === 'dark';
  switch (department.toLowerCase()) {
    case 'marketing':
      return darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800';
    case 'sales':
      return darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800';
    case 'development':
      return darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
    case 'operations':
      return darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
    default:
      return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800';
  }
};

const getTeamColor = (team: string, theme: string) => {
  const darkMode = theme === 'dark';
  switch (team.toLowerCase()) {
    case 'content':
    case 'inside sales':
    case 'frontend':
    case 'hr':
      return darkMode ? 'bg-indigo-800 text-indigo-200' : 'bg-indigo-100 text-indigo-800';
    case 'social media':
    case 'field sales':
    case 'backend':
    case 'finance':
      return darkMode ? 'bg-pink-800 text-pink-200' : 'bg-pink-100 text-pink-800';
    case 'analytics':
    case 'customer success':
    case 'qa':
    case 'facilities':
      return darkMode ? 'bg-teal-800 text-teal-200' : 'bg-teal-100 text-teal-800';
    default:
      return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800';
  }
};

export default TaskCard;