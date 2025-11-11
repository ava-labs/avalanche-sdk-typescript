'use client';
import { useState, useEffect } from 'react';
import { AmountInput } from '../../components/ui/amount-input';
import { Label } from '../../components/ui/label';
import { cn } from '../../styles/theme';
import { useStakeContext } from './StakeProvider';
import { useWalletContext } from '../../wallet/hooks/useWalletContext';
import type { StakeAmountInputProps } from '../types';

export function StakeAmountInput({
  className,
  label = "Stake Configuration",
  disabled = false,
}: StakeAmountInputProps) {
  const {
    stakeAmount,
    setStakeAmount,
    delegatorRewardPercentage,
    setDelegatorRewardPercentage,
    networkConfig,
    isTestnet,
  } = useStakeContext();

  const { status, balances, currentChain } = useWalletContext();
  const [stakeError, setStakeError] = useState<string | null>(null);
  const [feeError, setFeeError] = useState<string | null>(null);

  // Determine minimum stake and network name based on connected chain
  const getMinStakeAndNetwork = () => {
    const chainId = currentChain?.id;
    
    if (chainId === 43113) {
      // Fuji Testnet
      return { minStake: 1, networkName: 'Fuji' };
    } else if (chainId === 43114) {
      // Avalanche Mainnet
      return { minStake: 2000, networkName: 'Mainnet' };
    } else {
      // Fallback to config values
      return { 
        minStake: networkConfig.minStakeAvax, 
        networkName: isTestnet ? 'Fuji' : 'Mainnet' 
      };
    }
  };
  
  const { minStake, networkName } = getMinStakeAndNetwork();
  
  // Get P-Chain balance for staking
  const pChainBalance = balances.pChain;
  const isWalletConnected = status === 'connected';
  
  // Handle MAX button click - use P-Chain balance minus small buffer for transaction fees
  const handleMaxClick = () => {
    if (pChainBalance && pChainBalance.avax) {
      const balance = parseFloat(pChainBalance.avax);
      // Leave 0.01 AVAX for transaction fees
      const maxAmount = Math.max(0, balance - 0.01);
      setStakeAmount(maxAmount.toString());
    }
  };

  // Real-time validation for stake amount
  useEffect(() => {
    if (!stakeAmount) {
      setStakeError(null);
      return;
    }

    const amount = Number(stakeAmount);
    if (isNaN(amount)) {
      setStakeError('Please enter a valid number');
      return;
    }

    if (amount <= 0) {
      setStakeError('Stake amount must be greater than 0');
      return;
    }

    if (amount < minStake) {
      setStakeError(`Minimum stake is ${minStake.toLocaleString()} AVAX on ${networkName}`);
      return;
    }

    // Check wallet balance if connected
    if (isWalletConnected && pChainBalance && pChainBalance.avax) {
      const availableBalance = parseFloat(pChainBalance.avax);
      if (amount > availableBalance) {
        setStakeError(`Insufficient balance. Available: ${availableBalance.toFixed(4)} AVAX`);
        return;
      }
      
      // Warn if trying to stake almost all balance (less than 0.01 AVAX left for fees)
      if (amount > availableBalance - 0.01) {
        setStakeError('Leave some AVAX for transaction fees. Try using the MAX button.');
        return;
      }
    }

    // Check for reasonable maximum (e.g., 1 million AVAX)
    if (amount > 1000000) {
      setStakeError('Stake amount seems unusually high. Please verify.');
      return;
    }

    // Check for too many decimal places
    const decimalPlaces = (stakeAmount.split('.')[1] || '').length;
    if (decimalPlaces > 9) {
      setStakeError('Maximum 9 decimal places allowed');
      return;
    }

    setStakeError(null);
  }, [stakeAmount, minStake, networkName, isWalletConnected, pChainBalance, currentChain]);

  // Real-time validation for delegator reward percentage
  useEffect(() => {
    if (!delegatorRewardPercentage) {
      setFeeError(null);
      return;
    }

    const percentage = Number(delegatorRewardPercentage);
    if (isNaN(percentage)) {
      setFeeError('Please enter a valid percentage');
      return;
    }

    if (percentage < 2) {
      setFeeError('Minimum delegator fee is 2%');
      return;
    }

    if (percentage > 100) {
      setFeeError('Maximum delegator fee is 100%');
      return;
    }

    // Check for too many decimal places
    const decimalPlaces = (delegatorRewardPercentage.split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      setFeeError('Maximum 2 decimal places allowed for percentage');
      return;
    }

    setFeeError(null);
  }, [delegatorRewardPercentage]);

  return (
    <div className={cn('space-y-4', className)}>
      <Label>{label}</Label>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <AmountInput
            label="Stake Amount"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            symbol="AVAX"
            placeholder="0.00"
            disabled={disabled}
            min={minStake}
            step={0.001}
            showMax={isWalletConnected}
            showBalance={isWalletConnected}
            maxValue={pChainBalance?.avax}
            onMaxClick={handleMaxClick}
            className={stakeError ? 'border-destructive focus:border-destructive' : ''}
          />
          {stakeError ? (
            <div className="text-xs text-destructive">
              {stakeError}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Minimum: {minStake.toLocaleString()} AVAX ({networkName})
            </div>
          )}
        </div>

        <div className="space-y-2">
          <AmountInput
            label="Delegator Fee"
            value={delegatorRewardPercentage}
            onChange={(e) => setDelegatorRewardPercentage(e.target.value)}
            symbol="%"
            placeholder="2.0"
            disabled={disabled}
            min={2}
            max={100}
            step={0.1}
            className={feeError ? 'border-destructive focus:border-destructive' : ''}
          />
          {feeError ? (
            <div className="text-xs text-destructive">
              {feeError}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Your fee from delegators (2-100%)
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
        <ul className="space-y-1">
          <li>• Stake will be locked for the entire duration</li>
          <li>• Maintain &gt;80% uptime to receive rewards</li>
          <li>• Transaction fees apply</li>
        </ul>
      </div>
    </div>
  );
}
