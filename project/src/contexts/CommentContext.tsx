import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
  id: string;
  taskId: string;
  user: string;
  content: string;
  timestamp: Date;
}

interface CommentContextType {
  comments: Comment[];
  addComment: (taskId: string, content: string) => void;
  getCommentsByTaskId: (taskId: string) => Comment[];
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = (taskId: string, content: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      taskId,
      user: 'Current User', // Replace with actual user management
      content,
      timestamp: new Date(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  const getCommentsByTaskId = (taskId: string) => {
    return comments.filter((comment) => comment.taskId === taskId);
  };

  return (
    <CommentContext.Provider value={{ comments, addComment, getCommentsByTaskId }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};