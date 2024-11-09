import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { useNotification } from '../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, Plus, Filter, Search, CheckSquare, BarChart2, Users, Calendar, Settings, Download } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import { Task } from '../types';

const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const { tasks, deleteTask, editTask, addTask, completeTask } = useTasks();
  const { addNotification } = useNotification();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'tasks' | 'analytics' | 'users' | 'settings'>('tasks');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      addNotification('Analytics data updated', 'success');
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      addNotification('Task deleted successfully', 'success');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTaskModal(true);
  };

  const handleAddOrEditTask = (taskData: Omit<Task, 'id' | 'completed' | 'credits'>) => {
    if (editingTask) {
      editTask(editingTask.id, taskData);
      addNotification('Task updated successfully', 'success');
    } else {
      addTask(taskData);
      addNotification('Task added successfully', 'success');
    }
    setShowAddTaskModal(false);
    setEditingTask(null);
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    addNotification('Task status updated', 'success');
  };

  const handleExportData = () => {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification('Data exported successfully', 'success');
  };

  const filteredTasks = tasks
    .filter(task => filter === 'all' || task.department.toLowerCase() === filter)
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const completionRate = (tasks.filter(t => t.completed).length / tasks.length) * 100;
  const tasksByDepartment = tasks.reduce((acc, task) => {
    acc[task.department] = (acc[task.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-8`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-center justify-between gap-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>
        <div className="flex space-x-4">
          {(['tasks', 'analytics', 'users', 'settings'] as const).map((v) => (
            <motion.button
              key={v}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                view === v
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-white text-gray-700'
              } transition-colors`}
            >
              {v === 'tasks' && <Calendar className="w-4 h-4 mr-2" />}
              {v === 'analytics' && <BarChart2 className="w-4 h-4 mr-2" />}
              {v === 'users' && <Users className="w-4 h-4 mr-2" />}
              {v === 'settings' && <Settings className="w-4 h-4 mr-2" />}
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className={`pl-10 pr-4 py-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="development">Development</option>
                  <option value="operations">Operations</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportData}
                  className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="h-6 w-6" />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddTaskModal(true)}
                className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-6 w-6" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{task.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority, theme)}`}>
                      {task.priority}
                    </span>
                    <span className="ml-2">{task.department} - {task.team}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{new Date(task.date).toLocaleDateString()}</span>
                    {task.deadline && (
                      <span className="ml-2">Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditTask(task)}
                        className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTask(task.id)}
                        className={`p-2 rounded-full ${theme === 'dark' ? 'bg-red-800 hover:bg-red-700' : 'bg-red-200 hover:bg-red-300'} transition-colors`}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4">Task Completion Rate</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {completionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4">Tasks by Department</h3>
              {Object.entries(tasksByDepartment).map(([dept, count]) => (
                <div key={dept} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">{dept}</span>
                    <span className="text-sm">{count} tasks</span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / tasks.length) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'users' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Placeholder for user management */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              <p>Coming soon...</p>
            </div>
          </motion.div>
        )}

        {view === 'settings' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Placeholder for settings */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4">System Settings</h3>
              <p>Coming soon...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAddTaskModal && (
        <AddTaskModal
          onClose={() => {
            setShowAddTaskModal(false);
            setEditingTask(null);
          }}
          onAddTask={handleAddOrEditTask}
          editingTask={editingTask}
        />
      )}
    </div>
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

export default AdminDashboard;