'use client';
import { useState } from 'react';
import { cn } from '../../styles/theme';
import { Button } from '../../components/ui/button';
import { List, Home } from 'lucide-react';
import { ICTTTokenSelector } from './ICTTTokenSelector';
import { ICTTHomeTokenAddressInput } from './ICTTHomeTokenAddressInput';
import { ICTTRemoteTokenAddressInput } from './ICTTRemoteTokenAddressInput';
import { useICTTContext } from './ICTTProvider';

export type TokenInputMode = 'selector' | 'manual';

export interface ICTTTokenModeToggleProps {
  className?: string;
  defaultMode?: TokenInputMode;
  allowManualMode?: boolean;
}

export function ICTTTokenModeToggle({
  className,
  defaultMode = 'selector',
  allowManualMode = false
}: ICTTTokenModeToggleProps) {
  const [mode, setMode] = useState<TokenInputMode>(defaultMode);
  const { setTokenRemoteContract } = useICTTContext();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Toggle Buttons - only show if manual mode is allowed */}
      {allowManualMode ? (
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={mode === 'selector' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('selector')}
            className="flex-1 h-8"
          >
            <List className="h-4 w-4 mr-1" />
            Select
          </Button>
          <Button
            variant={mode === 'manual' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('manual')}
            className="flex-1 h-8"
          >
            <Home className="h-4 w-4 mr-1" />
            Manual
          </Button>
        </div>
      ) : null}

      {/* Token Input Component */}
      {mode === 'selector' || !allowManualMode ? (
        <ICTTTokenSelector label="Select Token" />
      ) : (
        <div className="space-y-4">
          <ICTTHomeTokenAddressInput label="ICTT Home Contract Address (Source)" />
          <ICTTRemoteTokenAddressInput 
            label="ICTT Remote Contract Address (Destination)" 
            onRemoteContractChange={setTokenRemoteContract}
          />
        </div>
      )}
    </div>
  );
}
