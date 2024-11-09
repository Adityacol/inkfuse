import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
  tasks: {[key: string]: {category: string, task: string, instructions: string[], priority: string, recurring: string}};
  theme: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, tasks, theme }) => {
  const today = new Date();
  const upcomingTasks = Object.entries(tasks)
    .filter(([date, task]) => {
      const taskDate = new Date(date);
      const diffTime = Math.abs(taskDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3; // Show tasks for the next 3 days
    })
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());

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
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <Bell className="inline-block mr-2 h-6 w-6" />
            Upcoming Tasks
          </h2>
          <button
            onClick={onClose}
            className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <AnimatePresence>
          {upcomingTasks.map(([date, task], index) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`mb-4 p-3 border rounded-md ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <p className="font-semibold">{new Date(date).toLocaleDateString()}</p>
              <p className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{task.category}</p>
              <p>{task.task}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm px-2 py-1 rounded ${getPriorityColor(task.priority, theme)}`}>{task.priority}</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{task.recurring}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {upcomingTasks.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            No upcoming tasks for the next 3 days.
          </motion.p>
        )}
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

export default NotificationCenter;