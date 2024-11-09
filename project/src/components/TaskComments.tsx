import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User } from 'lucide-react';

interface Comment {
  id: string;
  taskId: string;
  user: string;
  content: string;
  timestamp: Date;
}

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  onAddComment: (taskId: string, content: string) => void;
  theme: string;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments, onAddComment, theme }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(taskId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className={`mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center mb-4">
        <MessageSquare className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-semibold">Comments</h3>
      </div>

      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            } p-3 rounded-lg`}
          >
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{comment.user}</span>
              <span className="text-sm text-gray-500 ml-2">
                {new Date(comment.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={`flex-grow p-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-800'
          } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Send className="h-5 w-5" />
        </motion.button>
      </form>
    </div>
  );
};

export default TaskComments;