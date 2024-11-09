import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Calendar from './Calendar';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import TaskStatistics from './TaskStatistics';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, PlusCircle, ArrowLeft, BarChart2 } from 'lucide-react';
import { Task, departments } from '../types';

const DepartmentCalendar: React.FC = () => {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const { tasks, addTask } = useTasks();
  const { name } = useParams<{ name: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [showTaskCard, setShowTaskCard] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [filter, setFilter] = useState('all');

  const departmentTasks = tasks.filter(
    (task) => task.department.toLowerCase() === name?.toLowerCase()
  );

  const filteredTasks = filter === 'all'
    ? departmentTasks
    : departmentTasks.filter((task) => task.team.toLowerCase() === filter.toLowerCase());

  const handleDateSelect = (date: Date) => {
    const tasksForDate = filteredTasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
    
    if (tasksForDate.length > 0) {
      setSelectedTasks(tasksForDate);
      setShowTaskCard(true);
    }
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed' | 'credits'>) => {
    addTask({ ...newTask, department: name || '' });
    setShowAddTaskModal(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className={`relative z-10 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-8`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-center"
      >
        <Link to="/" className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <button
          onClick={() => setShowStatistics(!showStatistics)}
          className={`flex items-center px-4 py-2 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } hover:bg-opacity-80 transition-colors`}
        >
          <BarChart2 className="mr-2" />
          {showStatistics ? 'Hide Statistics' : 'Show Statistics'}
        </button>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8"
      >
        {name?.charAt(0).toUpperCase() + name?.slice(1)} Department Calendar
      </motion.h1>

      {showStatistics && <TaskStatistics tasks={filteredTasks} theme={theme} />}

      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full bg-blue-500 text-white">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full bg-blue-500 text-white">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">
          Filter by Team:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`p-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <option value="all">All Teams</option>
          {departments
            .find((dept) => dept.name.toLowerCase() === name?.toLowerCase())
            ?.teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
        </select>
      </div>

      <Calendar
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        tasks={filteredTasks}
        onSelectDate={handleDateSelect}
      />

      {showTaskCard && selectedTasks.length > 0 && (
        <TaskCard tasks={selectedTasks} onClose={() => setShowTaskCard(false)} />
      )}

      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddTaskModal(true)}
          className="fixed bottom-8 right-8 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <PlusCircle size={24} />
        </motion.button>
      )}

      {showAddTaskModal && (
        <AddTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onAddTask={handleAddTask}
          department={name}
        />
      )}
    </div>
  );
};

export default DepartmentCalendar;