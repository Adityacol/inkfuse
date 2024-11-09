import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { motion } from 'framer-motion';
import { Users, MessageSquare, CheckSquare, PlusCircle, ArrowLeft } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import { Link } from 'react-router-dom';

const TeamCollaboration: React.FC = () => {
  const { theme } = useTheme();
  const { tasks, addTask, completeTask } = useTasks();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const handleAddTask = (newTask: any) => {
    addTask(newTask);
    setShowAddTaskModal(false);
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-8`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link to="/" className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8"
      >
        Team Collaboration
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
            onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
          >
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{task.description}</p>
            <div className="flex justify-between items-center">
              <span className={`text-sm px-2 py-1 rounded ${getPriorityColor(task.priority, theme)}`}>
                {task.priority}
              </span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date(task.date).toLocaleDateString()}
              </span>
            </div>
            {selectedTask === task.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <h4 className="font-semibold mb-2">Instructions:</h4>
                <ul className="list-disc list-inside">
                  {task.instructions?.map((instruction, index) => (
                    <li key={index} className="text-sm">{instruction}</li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between">
                  <button className={`flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                    <MessageSquare size={16} className="mr-1" />
                    Comment
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteTask(task.id);
                    }}
                    className={`flex items-center ${
                      task.completed
                        ? theme === 'dark'
                          ? 'text-green-400 hover:text-green-300'
                          : 'text-green-600 hover:text-green-500'
                        : theme === 'dark'
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-yellow-600 hover:text-yellow-500'
                    }`}
                  >
                    <CheckSquare size={16} className="mr-1" />
                    {task.completed ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddTaskModal(true)}
        className="fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <PlusCircle size={24} />
      </motion.button>
      {showAddTaskModal && (
        <AddTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onAddTask={handleAddTask}
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

export default TeamCollaboration;