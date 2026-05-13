'use client';
import { useMemo } from 'react';
import { cn } from '../../styles/theme';
import { TokenSelectDropdown } from '../../token';
import type { Token } from '../../token/types';
import { useICTTContext } from './ICTTProvider';
import type { ICTTToken } from '../types';

export interface ICTTTokenSelectorProps {
  label?: string;
  className?: string;
}

// Convert ICTTToken to Token for the TokenSelectDropdown component
function convertICTTTokenToToken(icttToken: ICTTToken): Token {
  return {
    symbol: icttToken.symbol,
    name: icttToken.name,
    address: icttToken.address,
    decimals: icttToken.decimals,
    image: icttToken.logoUrl || null,
    chainId: parseInt(icttToken.chainId),
  };
}

export function ICTTTokenSelector({ 
  label = "Select Token", 
  className 
}: ICTTTokenSelectorProps) {
  const { 
    selectedToken, 
    setSelectedToken, 
    availableTokens,
    fromChain,
    toChain
  } = useICTTContext();

  // Filter tokens that are on the source chain and have a mirror on the destination chain
  const filteredTokens = useMemo(() => {
    return availableTokens.filter(token => {
      // Check if token is on the source chain
      const isOnSourceChain = token.chainId === fromChain;
      
      // Check if token has a mirror on the destination chain
      const hasMirrorOnDestination = token.ictt && token.ictt.mirrors.some(
        mirror => mirror.chainId === toChain
      );
      
      return isOnSourceChain && hasMirrorOnDestination;
    });
  }, [availableTokens, fromChain, toChain]);

  // Convert filtered ICTTToken[] to Token[] for TokenSelectDropdown
  const convertedTokens = useMemo(() => {
    return filteredTokens.map(convertICTTTokenToToken);
  }, [filteredTokens]);

  const handleTokenChange = (token: Token) => {
      // Find the original ICTTToken that matches the selected Token from filtered tokens
      const originalToken = filteredTokens.find(t => t.symbol === token.symbol && t.address === token.address);
      setSelectedToken(originalToken || null);
  };

  const selectedConvertedToken = selectedToken ? convertICTTTokenToToken(selectedToken) : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      <TokenSelectDropdown
        options={convertedTokens}
        token={selectedConvertedToken}
        setToken={handleTokenChange}
      />
    </div>
  );
}