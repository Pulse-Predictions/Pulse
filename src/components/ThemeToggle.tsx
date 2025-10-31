'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Clock } from 'lucide-react';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'auto') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('auto');
    }
  };

  const getIcon = () => {
    if (theme === 'auto') {
      return <Clock className="h-5 w-5" />;
    }
    return resolvedTheme === 'dark' ? (
      <Moon className="h-5 w-5" />
    ) : (
      <Sun className="h-5 w-5" />
    );
  };

  const getLabel = () => {
    if (theme === 'auto') {
      return `Auto (${resolvedTheme === 'dark' ? 'Night' : 'Day'})`;
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="gap-2"
      title={`Current: ${getLabel()}. Click to cycle themes.`}
    >
      {getIcon()}
      <span className="hidden sm:inline text-xs">{getLabel()}</span>
    </Button>
  );
}
