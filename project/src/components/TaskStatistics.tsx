import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart2, TrendingUp, CheckCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskStatisticsProps {
  tasks: Task[];
  theme: string;
}

const TaskStatistics: React.FC<TaskStatisticsProps> = ({ tasks, theme }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tasksByTeam = tasks.reduce((acc, task) => {
    acc[task.team] = (acc[task.team] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}
    >
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Completion Rate</h3>
          <PieChart className="h-5 w-5 text-blue-500" />
        </div>
        <div className="text-3xl font-bold text-blue-500">{completionRate.toFixed(1)}%</div>
        <div className="text-sm text-gray-500">{completedTasks} of {totalTasks} tasks completed</div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Priority Distribution</h3>
          <BarChart2 className="h-5 w-5 text-green-500" />
        </div>
        {Object.entries(tasksByPriority).map(([priority, count]) => (
          <div key={priority} className="mb-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{priority}</span>
              <span>{((count / totalTasks) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                style={{ width: `${(count / totalTasks) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Team Performance</h3>
          <TrendingUp className="h-5 w-5 text-purple-500" />
        </div>
        {Object.entries(tasksByTeam).map(([team, count]) => (
          <div key={team} className="mb-2">
            <div className="flex justify-between text-sm">
              <span>{team}</span>
              <span>{count} tasks</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <CheckCircle className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="space-y-2">
          {tasks
            .filter(task => task.completed)
            .slice(0, 3)
            .map(task => (
              <div key={task.id} className="text-sm">
                <div className="font-medium">{task.title}</div>
                <div className="text-gray-500">Completed on {new Date(task.date).toLocaleDateString()}</div>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export default TaskStatistics;