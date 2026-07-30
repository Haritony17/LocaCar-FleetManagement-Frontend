import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">🌙</span>
      <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
    </div>
  );
}