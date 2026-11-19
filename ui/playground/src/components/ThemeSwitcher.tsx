import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTheme, Theme, AvalancheLogo } from '@avalanche-sdk/ui';
import { cn, text, pressable } from '@avalanche-sdk/ui';

export function ThemeSwitcher() {
  const { theme, mode, setTheme, toggleMode } = useTheme();
  const [open, setOpen] = useState(false);

  const themes: { value: Theme; label: string; emoji: string }[] = [
    { value: 'avalanche', label: 'Avalanche', emoji: '🏔️' },
    { value: 'cyber', label: 'Cyber', emoji: '🤖' },
    { value: 'matrix', label: 'Matrix', emoji: '🟢' },
    { value: 'amber', label: 'Amber', emoji: '🟤' },
    { value: 'amethyst', label: 'Amethyst', emoji: '💜' },
  ];

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <div className="flex items-center gap-2">
      {/* Theme Dropdown */}
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 h-10 rounded-md border border-border',
              pressable.default,
            )}
            aria-label="Theme settings"
          >
            {currentTheme?.value === 'avalanche' ? (
              <AvalancheLogo size={16} className="text-primary" />
            ) : (
              <span>{currentTheme?.emoji}</span>
            )}
            <span className={cn(text.label2)}>
              {currentTheme?.label}
            </span>
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={cn(
              'min-w-[200px] bg-popover rounded-md border border-border shadow-md p-1 z-[100]',
            )}
            sideOffset={5}
          >
            {/* Theme Selection */}
            <div className="px-2 py-1.5">
              <div className={cn(text.caption, 'text-muted-foreground mb-2')}>
                Theme
              </div>
              <div className="space-y-1">
                {themes.map((t) => (
                  <DropdownMenu.Item asChild key={t.value}>
                    <button
            onClick={() => setTheme(t.value)}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-sm transition-colors',
              theme === t.value
                ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground',
                      )}
            aria-label={`Switch to ${t.label} theme`}
          >
                      {t.value === 'avalanche' ? (
                        <AvalancheLogo size={16} className="text-current" />
                      ) : (
                        <span>{t.emoji}</span>
                      )}
                      <span className={cn(text.label2)}>{t.label}</span>
                      {theme === t.value && (
                        <svg
                          className="w-4 h-4 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
          </button>
                  </DropdownMenu.Item>
        ))}
      </div>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Mode Toggle Button */}
    <button
        onClick={toggleMode}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-3 py-2 h-10 rounded-md border border-border',
          pressable.default,
        )}
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
        {mode === 'light' ? (
        // Moon icon for dark mode
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Sun icon for light mode
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
        <span className={cn(text.label2)}>
          {mode === 'light' ? 'Dark' : 'Light'}
      </span>
    </button>
    </div>
  );
}