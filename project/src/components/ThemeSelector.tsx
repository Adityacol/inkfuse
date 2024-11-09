import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeSelectorProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme }) => {
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`p-2 rounded-full ${
        theme === 'dark'
          ? 'bg-yellow-600 hover:bg-yellow-700'
          : 'bg-gray-200 hover:bg-gray-300'
      } transition-colors`}
    >
      {theme === 'dark' ? (
        <Sun className="h-6 w-6 text-white" />
      ) : (
        <Moon className="h-6 w-6 text-gray-800" />
      )}
    </button>
  );
};

export default ThemeSelector;