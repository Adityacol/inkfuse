import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, Settings, Briefcase, Users, BarChart2, Lock, TrendingUp, Star } from 'lucide-react';
import Confetti from 'react-confetti';
import Credits from './Credits';

const departments = [
  { name: 'Tech', icon: <Settings className="w-12 h-12 mb-4" />, color: 'from-blue-500 to-blue-600' },
  { name: 'Financial', icon: <DollarSign className="w-12 h-12 mb-4" />, color: 'from-green-500 to-green-600' },
  { name: 'Operations', icon: <Briefcase className="w-12 h-12 mb-4" />, color: 'from-yellow-500 to-yellow-600' },
  { name: 'Marketing', icon: <TrendingUp className="w-12 h-12 mb-4" />, color: 'from-purple-500 to-purple-600' },
];

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAdminAccess = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`relative z-10 min-h-screen ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <div className="p-8">
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
        >
          InkFuse Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
                onHoverStart={() => setSelectedCard(dept.name)}
                onHoverEnd={() => setSelectedCard(null)}
              >
                <Link to={`/department/${dept.name.toLowerCase()}`}>
                  <div className={`relative bg-gradient-to-br ${dept.color} p-8 rounded-lg shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-white overflow-hidden group`}>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <motion.div
                      animate={{
                        scale: selectedCard === dept.name ? 1.1 : 1,
                        rotate: selectedCard === dept.name ? 360 : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {dept.icon}
                    </motion.div>
                    <h2 className="text-2xl font-semibold">{dept.name} Department</h2>
                    <div className="mt-4 flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm">Click to view calendar</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
          >
            <Link to="/team-collaboration">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 rounded-lg shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-white group">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <Users className="w-12 h-12 mb-4" />
                <h2 className="text-2xl font-semibold">Team Collaboration</h2>
                <div className="mt-4 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-sm">Work together</span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
          >
            <Link to="/analytics">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-8 rounded-lg shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-white group">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <BarChart2 className="w-12 h-12 mb-4" />
                <h2 className="text-2xl font-semibold">Analytics</h2>
                <div className="mt-4 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-sm">View insights</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdminAccess}
            className="flex items-center justify-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
          >
            <Lock className="w-6 h-6 mr-2" />
            {isAdmin ? 'Access Admin Dashboard' : 'Admin Login'}
          </motion.button>
        </motion.div>
      </div>
      <Credits />
    </div>
  );
};

export default HomePage;