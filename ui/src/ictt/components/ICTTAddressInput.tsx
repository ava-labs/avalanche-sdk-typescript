'use client';
import React from 'react';
import { cn, text } from '../../styles/theme';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useICTTContext } from './ICTTProvider';
import { useAvalanche } from '../../AvalancheProvider';
import { validateAddress } from '../../utils/addressValidation';

export interface ICTTAddressInputProps {
  className?: string;
}

export function ICTTAddressInput({ className }: ICTTAddressInputProps) {
  const { 
    recipientAddress, 
    setRecipientAddress, 
    toChain 
  } = useICTTContext();
  
  const { walletAddress, isWalletConnected, availableChains } = useAvalanche();

  const getChainName = (chainId: string): string => {
    const chain = availableChains.find(c => c.id.toString() === chainId);
    return chain?.name || 'Chain';
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
  };

  const handleUseMyAddress = () => {
    if (walletAddress) {
      setRecipientAddress(walletAddress);
    }
  };

  // Validate the current address
  const validation = validateAddress(recipientAddress, 'C');
  const shouldShowError = recipientAddress && !validation.isValid;

  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn(text.label1, 'text-foreground')}>
        Recipient Address
        <span className={cn(text.legal, 'text-muted-foreground ml-2')}>
          ({getChainName(toChain)})
        </span>
      </Label>
      
      <div className="relative">
        <Input
          type="text"
          value={recipientAddress}
          onChange={handleAddressChange}
          placeholder={`Enter recipient address on ${getChainName(toChain)}`}
          className={cn(
            "h-12 pr-32 font-mono",
            shouldShowError && "border-destructive focus:border-destructive"
          )}
        />
        
        {/* Use My Address Button */}
        {isWalletConnected && walletAddress && (
          <Button
            type="button"
            onClick={handleUseMyAddress}
            variant="default"
            className="absolute right-0 top-0 h-12 px-4 text-xs font-semibold rounded-l-none border-l-0 rounded-r-md !h-12"
          >
            Use My Address
          </Button>
        )}
        
        {/* Validation indicator - only show red circle for invalid addresses */}
        {recipientAddress && !validation.isValid && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ right: isWalletConnected && walletAddress ? '140px' : '12px' }}>
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
        )}
      </div>

      {/* Error message */}
      {shouldShowError && (
        <p className={cn(text.legal, 'text-destructive')}>
          {validation.error}
        </p>
      )}
      
      {!isWalletConnected && (
        <p className={cn(text.legal, 'text-muted-foreground')}>
          Connect wallet to use your address
        </p>
      )}
    </div>
  );
}