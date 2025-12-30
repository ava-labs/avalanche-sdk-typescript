'use client';
import { cn, pressable } from '../../styles/theme';

export interface DirectionToggleProps {
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  'data-testid'?: string;
}

export function DirectionToggle({
  className,
  disabled = false,
  onClick,
  'data-testid': testId,
}: DirectionToggleProps) {
  return (
    <div className="flex justify-center my-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'p-2 rounded-full border-2 border-line bg-background transition-all duration-200',
          'hover:border-primary hover:bg-primary-washed hover:rotate-180',
          'focus:outline-none',
          disabled && pressable.disabled,
          className,
        )}
        data-testid={testId}
      >
        <svg
          className="w-5 h-5 text-foreground-muted transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </button>
    </div>
  );
}
