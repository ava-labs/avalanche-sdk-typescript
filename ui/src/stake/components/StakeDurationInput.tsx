'use client';
import { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { cn } from '../../styles/theme';
import { useStakeContext } from './StakeProvider';
import type { StakeDurationInputProps } from '../types';

export function StakeDurationInput({
  className,
  label = "Staking Duration",
  disabled = false,
  showPresets = true,
}: StakeDurationInputProps) {
  const {
    endTime,
    setEndTime,
    setEndInDays,
    networkConfig,
    isTestnet,
  } = useStakeContext();

  const [durationError, setDurationError] = useState<string | null>(null);

  const isDateButtonActive = (days: number) => {
    if (!endTime) return false;
    const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const selectedDate = new Date(endTime);
    return Math.abs(targetDate.getTime() - selectedDate.getTime()) < 24 * 60 * 60 * 1000;
  };

  // Real-time validation for end time
  useEffect(() => {
    if (!endTime) {
      setDurationError(null);
      return;
    }

    const selectedDate = new Date(endTime);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(selectedDate.getTime())) {
      setDurationError('Please enter a valid date and time');
      return;
    }

    // Check if the date is in the past
    if (selectedDate <= now) {
      setDurationError('End time must be in the future');
      return;
    }

    const duration = Math.floor(selectedDate.getTime() / 1000) - Math.floor(now.getTime() / 1000);

    // Check minimum duration
    if (duration < networkConfig.minEndSeconds) {
      const minDuration = isTestnet ? '24 hours' : '2 weeks';
      setDurationError(`Must be at least ${minDuration} from now`);
      return;
    }

    // Check maximum duration (1 year)
    const maxDuration = 365 * 24 * 60 * 60;
    if (duration > maxDuration) {
      setDurationError('Must be within 1 year from now');
      return;
    }

    // Check if it's too close to minimum (warn about buffer time)
    const bufferTime = 5 * 60; // 5 minutes buffer
    if (duration < networkConfig.minEndSeconds + bufferTime) {
      setDurationError(`Consider adding a few minutes buffer to ensure the transaction is processed in time`);
      return;
    }

    // Maximum is already enforced above at 1 year, no need for additional check

    setDurationError(null);
  }, [endTime, networkConfig.minEndSeconds, isTestnet]);

  return (
    <div className={cn('space-y-4', className)}>
      <Label>{label}</Label>

      {showPresets && (
        <div className="grid grid-cols-3 gap-2">
          {networkConfig.presets.map((preset) => (
            <Button
              key={preset.days}
              onClick={() => setEndInDays(preset.days)}
              variant={isDateButtonActive(preset.days) ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              className="text-sm"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="end-date">Custom End Date</Label>
        <div className="relative">
          <Input
            id="end-date"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            type="datetime-local"
            disabled={disabled}
            min={new Date().toISOString().slice(0, 16)}
            max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
            className={cn(
              "pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:brightness-0 dark:[&::-webkit-calendar-picker-indicator]:brightness-100",
              durationError ? 'border-destructive focus:border-destructive' : ''
            )}
            style={{
              colorScheme: 'light'
            }}
          />
        </div>
        {durationError ? (
          <div className="text-xs text-destructive">
            {durationError}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Min: {isTestnet ? '24 hours' : '2 weeks'} • Max: 1 year
          </div>
        )}
      </div>
    </div>
  );
}
