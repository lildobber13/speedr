import { Moon, Sun, BookOpen } from 'lucide-react';

interface ThemeSwitcherProps {
  theme: 'dark' | 'light' | 'sepia';
  onThemeChange: (theme: 'dark' | 'light' | 'sepia') => void;
}

const themes = [
  { id: 'dark' as const, label: 'Dark', icon: Moon },
  { id: 'light' as const, label: 'Light', icon: Sun },
  { id: 'sepia' as const, label: 'Sepia', icon: BookOpen },
];

const ThemeSwitcher = ({ theme, onThemeChange }: ThemeSwitcherProps) => {
  return (
    <div className="rounded-xl bg-card border border-border p-4 space-y-3">
      <span className="text-sm text-muted-foreground font-body">Theme</span>
      <div className="flex gap-2">
        {themes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onThemeChange(id)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-body transition-all
              ${theme === id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
