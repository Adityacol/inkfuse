import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, TrendingUp, Calendar, CheckSquare, Clock, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Analytics: React.FC = () => {
  const { theme } = useTheme();
  const { tasks } = useTasks();

  const analytics = useMemo(() => {
    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tasksByDepartment = tasks.reduce((acc, task) => {
      acc[task.department] = (acc[task.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tasksByTeam = tasks.reduce((acc, task) => {
      acc[task.team] = (acc[task.team] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalCredits = tasks.reduce((sum, task) => sum + task.credits, 0);
    const earnedCredits = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.credits, 0);

    const upcomingDeadlines = tasks.filter(task => 
      task.deadline && new Date(task.deadline) > new Date() && !task.completed
    ).length;

    return {
      tasksByPriority,
      tasksByDepartment,
      tasksByTeam,
      totalTasks,
      completedTasks,
      completionRate,
      totalCredits,
      earnedCredits,
      upcomingDeadlines
    };
  }, [tasks]);

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
        Analytics Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" />
            Total Tasks
          </h2>
          <p className="text-3xl font-bold">{analytics.totalTasks}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckSquare className="mr-2" />
            Completed Tasks
          </h2>
          <p className="text-3xl font-bold">{analytics.completedTasks}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2" />
            Completion Rate
          </h2>
          <p className="text-3xl font-bold">{analytics.completionRate.toFixed(2)}%</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2" />
            Upcoming Deadlines
          </h2>
          <p className="text-3xl font-bold">{analytics.upcomingDeadlines}</p>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart2 className="mr-2" />
            Tasks by Priority
          </h2>
          <div className="space-y-2">
            {Object.entries(analytics.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center">
                <span className="w-20">{priority}</span>
                <div className="flex-grow bg-gray-200 rounded-full h-2.5 ml-2">
                  <div
                    className={`h-2.5 rounded-full ${getPriorityColor(priority, theme)}`}
                    style={{ width: `${(count / analytics.totalTasks) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Briefcase className="mr-2" />
            Tasks by Department
          </h2>
          <div className="space-y-2">
            {Object.entries(analytics.tasksByDepartment).map(([department, count]) => (
              <div key={department} className="flex items-center">
                <span className="w-24">{department}</span>
                <div className="flex-grow bg-gray-200 rounded-full h-2.5 ml-2">
                  <div
                    className={`h-2.5 rounded-full ${getDepartmentColor(department, theme)}`}
                    style={{ width: `${(count / analytics.totalTasks) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2" />
            Tasks by Team
          </h2>
          <div className="space-y-2">
            {Object.entries(analytics.tasksByTeam).map(([team, count]) => (
              <div key={team} className="flex items-center">
                <span className="w-24">{team}</span>
                <div className="flex-grow bg-gray-200 rounded-full h-2.5 ml-2">
                  <div
                    className={`h-2.5 rounded-full ${getTeamColor(team, theme)}`}
                    style={{ width: `${(count / analytics.totalTasks) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <PieChart className="mr-2" />
            Credits Overview
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-lg">Total Credits: {analytics.totalCredits}</p>
              <p className="text-lg">Earned Credits: {analytics.earnedCredits}</p>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    Credit Completion
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-teal-600">
                    {((analytics.earnedCredits / analytics.totalCredits) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                <div
                  style={{ width: `${(analytics.earnedCredits / analytics.totalCredits) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const getPriorityColor = (priority: string, theme: string) => {
  const darkMode = theme === 'dark';
  switch (priority.toLowerCase()) {
    case 'high':
      return darkMode ? 'bg-red-600' : 'bg-red-500';
    case 'medium':
      return darkMode ? 'bg-yellow-600' : 'bg-yellow-500';
    case 'low':
      return darkMode ? 'bg-green-600' : 'bg-green-500';
    default:
      return darkMode ? 'bg-gray-600' : 'bg-gray-500';
  }
};

const getDepartmentColor = (department: string, theme: string) => {
  const darkMode = theme === 'dark';
  switch (department.toLowerCase()) {
    case 'marketing':
      return darkMode ? 'bg-purple-600' : 'bg-purple-500';
    case 'sales':
      return darkMode ? 'bg-blue-600' : 'bg-blue-500';
    case 'development':
      return darkMode ? 'bg-green-600' : 'bg-green-500';
    case 'operations':
      return darkMode ? 'bg-yellow-600' : 'bg-yellow-500';
    default:
      return darkMode ? 'bg-gray-600' : 'bg-gray-500';
  }
};

const getTeamColor = (team: string, theme: string) => {
  const darkMode = theme === 'dark';
  switch (team.toLowerCase()) {
    case 'content':
    case 'inside sales':
    case 'frontend':
    case 'hr':
      return darkMode ? 'bg-indigo-600' : 'bg-indigo-500';
    case 'social media':
    case 'field sales':
    case 'backend':
    case 'finance':
      return darkMode ? 'bg-pink-600' : 'bg-pink-500';
    case 'analytics':
    case 'customer success':
    case 'qa':
    case 'facilities':
      return darkMode ? 'bg-teal-600' : 'bg-teal-500';
    default:
      return darkMode ? 'bg-gray-600' : 'bg-gray-500';
  }
};

export default Analytics;