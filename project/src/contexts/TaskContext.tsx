import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, createTask, departments } from '../types';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'credits'>) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updatedTask: Partial<Task>) => void;
  completeTask: (id: string) => void;
  getTasksByDateRange: (startDate: Date, endDate: Date) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'credits'>) => {
    const newTask = createTask(task);
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const editTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const completeTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTasksByDateRange = (startDate: Date, endDate: Date): Task[] => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate >= startDate && taskDate <= endDate;
    });
  };

  // Generate tasks for the next 3 months if there are no tasks
  useEffect(() => {
    if (tasks.length === 0) {
      const newTasks: Task[] = [];
      const startDate = new Date();
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);

      // InkFuse 3-Month Marketing Plan
      const marketingPlan = [
        {
          title: "Launch Social Media Campaign",
          description: "Kickoff a multi-platform social media campaign to increase brand awareness",
          date: new Date(startDate.getFullYear(), startDate.getMonth(), 15).toISOString(),
          priority: "high",
          team: "Social Media",
          department: "Marketing",
          instructions: [
            "Develop campaign concept and messaging",
            "Create visual assets for each platform",
            "Schedule posts for the next 30 days",
            "Set up tracking for engagement metrics"
          ]
        },
        {
          title: "Implement SEO Optimization",
          description: "Optimize website content for search engines to improve organic traffic",
          date: new Date(startDate.getFullYear(), startDate.getMonth(), 25).toISOString(),
          priority: "medium",
          team: "Content",
          department: "Marketing",
          instructions: [
            "Conduct keyword research",
            "Update meta tags and descriptions",
            "Optimize existing content for target keywords",
            "Implement internal linking strategy"
          ]
        },
        {
          title: "Launch Email Marketing Series",
          description: "Create and launch a series of targeted email campaigns",
          date: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 5).toISOString(),
          priority: "high",
          team: "Content",
          department: "Marketing",
          instructions: [
            "Segment email list based on user behavior",
            "Design email templates",
            "Write copy for each email in the series",
            "Set up automated email flows"
          ]
        },
        {
          title: "Conduct Market Research",
          description: "Gather insights on customer preferences and market trends",
          date: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 20).toISOString(),
          priority: "medium",
          team: "Analytics",
          department: "Marketing",
          instructions: [
            "Design survey questions",
            "Distribute survey to target audience",
            "Analyze survey results",
            "Prepare report with actionable insights"
          ]
        },
        {
          title: "Launch Referral Program",
          description: "Implement a customer referral program to drive organic growth",
          date: new Date(startDate.getFullYear(), startDate.getMonth() + 2, 1).toISOString(),
          priority: "high",
          team: "Marketing",
          department: "Marketing",
          instructions: [
            "Design referral program structure and rewards",
            "Develop tracking system for referrals",
            "Create promotional materials",
            "Train customer support on program details"
          ]
        },
        {
          title: "Content Marketing Push",
          description: "Create and distribute high-value content to establish thought leadership",
          date: new Date(startDate.getFullYear(), startDate.getMonth() + 2, 15).toISOString(),
          priority: "medium",
          team: "Content",
          department: "Marketing",
          instructions: [
            "Identify key topics and themes",
            "Create editorial calendar",
            "Produce blog posts, whitepapers, and infographics",
            "Distribute content through various channels"
          ]
        }
      ];

      marketingPlan.forEach(task => {
        newTasks.push(createTask(task));
      });

      // Generate regular tasks for all departments
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        departments.forEach((dept) => {
          dept.teams.forEach((team) => {
            if (Math.random() < 0.3) { // Reduce the number of generated tasks
              const task = createTask({
                title: `${dept.name} - ${team} Task`,
                description: `Daily task for ${team} team in ${dept.name} department`,
                date: new Date(d).toISOString(),
                priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
                department: dept.name,
                team: team,
                instructions: ["Complete daily responsibilities", "Report progress to team lead"]
              });
              newTasks.push(task);
            }
          });
        });
      }

      setTasks(newTasks);
    }
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, editTask, completeTask, getTasksByDateRange }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};