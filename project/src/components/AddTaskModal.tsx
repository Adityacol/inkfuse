import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from '../contexts/ThemeContext';
import { Task, departments } from '../types';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'credits'>) => void;
  department?: string;
  editingTask?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAddTask, department, editingTask }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedDepartment, setSelectedDepartment] = useState(department || '');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [dependencies, setDependencies] = useState<string[]>([]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDate(new Date(editingTask.date));
      setPriority(editingTask.priority);
      setSelectedDepartment(editingTask.department);
      setSelectedTeam(editingTask.team);
      setDeadline(editingTask.deadline ? new Date(editingTask.deadline) : null);
      setDependencies(editingTask.dependencies || []);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Omit<Task, 'id' | 'completed' | 'credits'> = {
      title,
      description,
      date: date.toISOString(),
      priority,
      department: selectedDepartment,
      team: selectedTeam,
      deadline: deadline?.toISOString(),
      dependencies: dependencies.length > 0 ? dependencies : undefined,
    };
    onAddTask(task);
    onClose();
  };

  const handleAddDependency = () => {
    setDependencies([...dependencies, '']);
  };

  const handleRemoveDependency = (index: number) => {
    const newDependencies = dependencies.filter((_, i) => i !== index);
    setDependencies(newDependencies);
  };

  const handleDependencyChange = (index: number, value: string) => {
    const newDependencies = [...dependencies];
    newDependencies[index] = value;
    setDependencies(newDependencies);
  };

  return (
    <AnimatePresence>
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
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              onClick={onClose}
              className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                rows={3}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="date">
                Date
              </label>
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            {!department && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="department">
                  Department
                </label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedTeam('');
                  }}
                  className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                  required
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="team">
                Team
              </label>
              <select
                id="team"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                required
              >
                <option value="">Select a team</option>
                {departments
                  .find((dept) => dept.name === selectedDepartment)
                  ?.teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="deadline">
                Deadline (optional)
              </label>
              <DatePicker
                selected={deadline}
                onChange={(date: Date) => setDeadline(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className={`w-full p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                placeholderText="Select deadline (optional)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Dependencies (optional)
              </label>
              {dependencies.map((dependency, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={dependency}
                    onChange={(e) => handleDependencyChange(index, e.target.value)}
                    className={`flex-grow p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    placeholder={`Dependency ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDependency(index)}
                    className="ml-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDependency}
                className="mt-2 p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`w-full py-2 px-4 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTaskModal;