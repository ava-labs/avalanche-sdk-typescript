'use client';

import { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../components/ui/select';
import { cn, text } from '../../styles/theme';
import type { ChainOption, ChainSelectDropdownProps } from '../types';
import { ChainRow } from './ChainRow';

const toValue = (id: ChainOption['id']): string => id.toString();

export function ChainSelectDropdown({
  options,
  value,
  onValueChange,
  onSelect,
  placeholder = 'Select chain',
  disabled,
  disabledOptions,
  label,
  className,
  triggerClassName,
  contentClassName,
  emptyStateLabel = 'Select Chain',
}: ChainSelectDropdownProps) {
  const disabledSet = useMemo(() => {
    if (!disabledOptions?.length) {
      return new Set<string>();
    }
    const values = disabledOptions
      .filter((option): option is ChainOption['id'] => option !== undefined && option !== null)
      .map((option) => option.toString());
    return new Set(values);
  }, [disabledOptions]);

  const selectedValue = value !== undefined ? value.toString() : undefined;
  const selectedChain = selectedValue
    ? options.find((option) => toValue(option.id) === selectedValue)
    : undefined;

  const handleValueChange = (selected: string) => {
    const chain = options.find((option) => toValue(option.id) === selected);
    if (!chain) {
      return;
    }
    onValueChange?.(selected, chain);
    onSelect?.(chain);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className={cn(text.label1)}>
          {label}
        </label>
      )}

      <Select
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled || options.length === 0}
      >
        <SelectTrigger
          className={cn(
            '!h-auto items-center gap-3 px-4 py-4',
            triggerClassName,
          )}
        >
          {selectedChain ? (
            <ChainRow
              chain={selectedChain}
              showDescription
              iconSize={32}
              className="w-full"
            />
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </SelectTrigger>

        <SelectContent className={cn('min-w-[280px]', contentClassName)}>
          {options.length ? (
            <div className="py-2">
              {emptyStateLabel && (
                <div className="px-3 py-1.5 border-b border-border mb-2">
                  <span className={cn(text.caption, 'text-muted-foreground uppercase tracking-wide')}>
                    {emptyStateLabel}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                {options.map((option) => {
                  const valueString = toValue(option.id);
                  const isDisabledBySet = disabledSet.has(valueString);
                  const isOptionDisabled = option.disabled || isDisabledBySet;
                  const disabledReason = option.disabledReason ?? (isDisabledBySet ? 'Same as source' : undefined);
                  const descriptionOverride = disabledReason
                    ? `${option.description ?? ''}${option.description ? ' • ' : ''}${disabledReason}`
                    : undefined;

                  return (
                    <SelectItem
                      key={valueString}
                      value={valueString}
                      disabled={isOptionDisabled}
                      className="cursor-pointer rounded-md"
                    >
                      <ChainRow
                        chain={option}
                        className="w-full"
                        showDescription
                        iconSize={32}
                        descriptionOverride={descriptionOverride}
                        disabled={isOptionDisabled}
                      />
                    </SelectItem>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              No chains available
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
