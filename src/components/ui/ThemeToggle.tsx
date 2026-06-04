import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface ThemeToggleProps {
  className?: string;
}

// Sun/moon button that flips between light and dark themes.
export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const theme = useThemeStore(s => s.theme);
  const toggleTheme = useThemeStore(s => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
