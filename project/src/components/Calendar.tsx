import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';

interface CalendarProps {
  year: number;
  month: number;
  tasks: Task[];
  onSelectDate: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ year, month, tasks, onSelectDate }) => {
  const { theme } = useTheme();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = Array(35).fill(null);

  days.forEach((day, index) => {
    calendarDays[index + firstDayOfMonth] = day;
  });

  const getTasksForDay = (day: number) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getFullYear() === year &&
        taskDate.getMonth() === month &&
        taskDate.getDate() === day
      );
    });
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className={`text-center font-bold p-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{day}</div>
      ))}
      {calendarDays.map((day, index) => {
        const tasksForDay = day ? getTasksForDay(day) : [];
        const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

        return (
          <motion.div
            key={index}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-2 h-24 overflow-hidden ${day ? 'cursor-pointer' : 'opacity-50'} ${isToday ? 'border-2 border-blue-500' : ''}`}
            whileHover={day ? { scale: 1.05 } : {}}
            whileTap={day ? { scale: 0.95 } : {}}
            onClick={() => day && onSelectDate(new Date(year, month, day))}
          >
            {day && (
              <>
                <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{day}</div>
                <div className="mt-1">
                  {tasksForDay.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`text-xs truncate ${getPriorityColor(task.priority, theme)} ${task.completed ? 'line-through' : ''}`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasksForDay.length > 3 && (
                    <div className="text-xs text-gray-500">+{tasksForDay.length - 3} more</div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

const getPriorityColor = (priority: string, theme: string) => {
  const darkMode = theme === 'dark';
  switch (priority.toLowerCase()) {
    case 'high':
      return darkMode ? 'text-red-400' : 'text-red-600';
    case 'medium':
      return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    case 'low':
      return darkMode ? 'text-green-400' : 'text-green-600';
    default:
      return darkMode ? 'text-gray-400' : 'text-gray-600';
  }
};

export default Calendar;