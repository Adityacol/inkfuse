import { motion } from 'framer-motion';
import { Code, Heart, Star } from 'lucide-react';
import React from 'react';

const Credits: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mt-20 py-8 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col items-center justify-center text-white"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Code className="w-5 h-5 text-blue-400" />
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Crafted with
          </span>
          <Heart className="w-5 h-5 text-red-400" />
          <span className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            by Aditya
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <motion.a
            href="https://github.com/Adityacol/inkfuse"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center hover:text-blue-400 transition-colors"
          >
            <Star className="w-4 h-4 mr-1" />
            Star on GitHub
          </motion.a>
          <span>•</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © {new Date().getFullYear()} InkFuse
          </motion.span>
          <span>•</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            All rights reserved
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Credits;