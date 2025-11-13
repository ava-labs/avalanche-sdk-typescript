'use client';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useWalletContext } from '../../wallet/hooks/useWalletContext';
import { useAvalanche } from '../../AvalancheProvider';
import type {
  StakeContextType,
  StakeProviderProps,
  StakeStatus,
  StakeError,
  StakeResult,
  ValidatorCredentials,
  NetworkConfig,
} from '../types';

// Network-specific constants
const DEFAULT_NETWORK_CONFIG = {
  fuji: {
    minStakeAvax: 1,
    minEndSeconds: 24 * 60 * 60, // 24 hours
    defaultDays: 1,
    presets: [
      { label: '1 day', days: 1 },
      { label: '1 week', days: 7 },
      { label: '2 weeks', days: 14 }
    ]
  },
  mainnet: {
    minStakeAvax: 2000,
    minEndSeconds: 14 * 24 * 60 * 60, // 14 days
    defaultDays: 14,
    presets: [
      { label: '2 weeks', days: 14 },
      { label: '1 month', days: 30 },
      { label: '3 months', days: 90 }
    ]
  }
};

const MAX_END_SECONDS = 365 * 24 * 60 * 60; // 1 year
const DEFAULT_DELEGATOR_REWARD_PERCENTAGE = "2";
const BUFFER_MINUTES = 5;

const StakeContext = createContext<StakeContextType | null>(null);

export function useStakeContext(): StakeContextType {
  const context = useContext(StakeContext);
  if (!context) {
    throw new Error('useStakeContext must be used within a StakeProvider');
  }
  return context;
}

export function StakeProvider({
  children,
  onSuccess,
  onError,
  networkConfig: customNetworkConfig,
}: StakeProviderProps) {
  const { pAddress: pChainAddress } = useWalletContext();
  const { walletClient } = useAvalanche();
  
  // State
  const [status, setStatus] = useState<StakeStatus>('idle');
  const [validator, setValidator] = useState<ValidatorCredentials | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [delegatorRewardPercentage, setDelegatorRewardPercentage] = useState<string>(DEFAULT_DELEGATOR_REWARD_PERCENTAGE);
  const [error, setError] = useState<StakeError | undefined>();
  const [result, setResult] = useState<StakeResult | undefined>();

  // Determine network configuration from actual chain
  const { chain } = useAvalanche();
  const isTestnet = useMemo(() => {
    // Check if chain has testnet property
    return chain.testnet ?? false;
  }, [chain]);

  const networkConfig = useMemo((): NetworkConfig => {
    const baseConfig = isTestnet ? DEFAULT_NETWORK_CONFIG.fuji : DEFAULT_NETWORK_CONFIG.mainnet;
    return { ...baseConfig, ...customNetworkConfig };
  }, [isTestnet, customNetworkConfig]);

  // Initialize defaults
  const initializeDefaults = useCallback(() => {
    if (!stakeAmount) {
      setStakeAmount(String(networkConfig.minStakeAvax));
    }

    if (!endTime) {
      const d = new Date();
      d.setDate(d.getDate() + networkConfig.defaultDays);
      d.setMinutes(d.getMinutes() + BUFFER_MINUTES);
      const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setEndTime(iso);
    }
  }, [stakeAmount, endTime, networkConfig]);

  // Initialize defaults on mount
  React.useEffect(() => {
    initializeDefaults();
  }, [initializeDefaults]);

  const setEndInDays = useCallback((days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setMinutes(d.getMinutes() + BUFFER_MINUTES);
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setEndTime(iso);
  }, []);

  const validateForm = useCallback((): string | null => {
    // Wallet validation
    if (!pChainAddress) {
      return 'Connect wallet to get your P-Chain address';
    }

    // Validator validation
    if (!validator) {
      return 'Please provide validator credentials';
    }

    if (!validator.nodeID?.startsWith('NodeID-')) {
      return 'Invalid NodeID format - must start with "NodeID-"';
    }

    // More thorough NodeID validation
    if (validator.nodeID.length < 15 || validator.nodeID.length > 60) {
      return 'Invalid NodeID format - incorrect length';
    }

    // BLS Public Key validation
    if (!validator.nodePOP.publicKey?.startsWith('0x')) {
      return 'Invalid BLS Public Key format - must start with "0x"';
    }

    if (validator.nodePOP.publicKey.length !== 98) {
      return 'Invalid BLS Public Key format - must be 98 characters (0x + 96 hex chars)';
    }

    // Check if public key is valid hex
    const publicKeyHex = validator.nodePOP.publicKey.slice(2);
    if (!/^[0-9a-fA-F]+$/.test(publicKeyHex)) {
      return 'Invalid BLS Public Key - contains non-hexadecimal characters';
    }

    if (publicKeyHex === '0'.repeat(96)) {
      return 'Invalid BLS Public Key - cannot be all zeros';
    }

    // BLS Proof of Possession validation
    if (!validator.nodePOP.proofOfPossession?.startsWith('0x')) {
      return 'Invalid BLS Proof of Possession format - must start with "0x"';
    }

    if (validator.nodePOP.proofOfPossession.length !== 194) {
      return 'Invalid BLS Proof of Possession format - must be 194 characters (0x + 192 hex chars)';
    }

    // Check if proof of possession is valid hex
    const proofHex = validator.nodePOP.proofOfPossession.slice(2);
    if (!/^[0-9a-fA-F]+$/.test(proofHex)) {
      return 'Invalid BLS Proof of Possession - contains non-hexadecimal characters';
    }

    if (proofHex === '0'.repeat(192)) {
      return 'Invalid BLS Proof of Possession - cannot be all zeros';
    }

    // Stake amount validation
    if (!stakeAmount || stakeAmount.trim() === '') {
      return 'Stake amount is required';
    }

    const stakeNum = Number(stakeAmount);
    if (!Number.isFinite(stakeNum)) {
      return 'Please enter a valid stake amount';
    }

    if (stakeNum <= 0) {
      return 'Stake amount must be greater than 0';
    }

    if (stakeNum < networkConfig.minStakeAvax) {
      const networkName = isTestnet ? 'Fuji' : 'Mainnet';
      return `Minimum stake is ${networkConfig.minStakeAvax.toLocaleString()} AVAX on ${networkName}`;
    }

    // Check for reasonable maximum
    if (stakeNum > 1000000) {
      return 'Stake amount seems unusually high. Please verify the amount.';
    }

    // Check decimal places
    const decimalPlaces = (stakeAmount.split('.')[1] || '').length;
    if (decimalPlaces > 9) {
      return 'Maximum 9 decimal places allowed for stake amount';
    }

    // End time validation
    if (!endTime) {
      return 'End time is required';
    }

    const selectedDate = new Date(endTime);
    if (isNaN(selectedDate.getTime())) {
      return 'Please enter a valid end date and time';
    }

    const endUnix = Math.floor(selectedDate.getTime() / 1000);
    const nowUnix = Math.floor(Date.now() / 1000);
    const duration = endUnix - nowUnix;

    if (duration <= 0) {
      return 'End time must be in the future';
    }

    if (duration < networkConfig.minEndSeconds) {
      const minDuration = isTestnet ? '24 hours' : '2 weeks';
      return `End time must be at least ${minDuration} from now`;
    }

    if (duration > MAX_END_SECONDS) {
      return 'End time must be within 1 year';
    }

    // Delegator reward percentage validation
    if (!delegatorRewardPercentage || delegatorRewardPercentage.trim() === '') {
      return 'Delegator reward percentage is required';
    }

    const drp = Number(delegatorRewardPercentage);
    if (!Number.isFinite(drp)) {
      return 'Please enter a valid delegator reward percentage';
    }

    if (drp < 2) {
      return 'Minimum delegator reward percentage is 2%';
    }

    if (drp > 100) {
      return 'Maximum delegator reward percentage is 100%';
    }

    // Check decimal places for percentage
    const percentageDecimalPlaces = (delegatorRewardPercentage.split('.')[1] || '').length;
    if (percentageDecimalPlaces > 2) {
      return 'Maximum 2 decimal places allowed for delegator reward percentage';
    }

    return null;
  }, [pChainAddress, validator, stakeAmount, endTime, delegatorRewardPercentage, networkConfig, isTestnet]);

  // Compute form validity reactively
  const isFormValid = useMemo(() => {
    return validateForm() === null;
  }, [validateForm]);

  const submitStake = useCallback(async () => {
    setError(undefined);
    setResult(undefined);

    const validationError = validateForm();
    if (validationError) {
      const error = { message: validationError };
      setError(error);
      onError?.(error);
      return;
    }

    if (!walletClient) {
      const error = { message: "Wallet client not found" };
      setError(error);
      onError?.(error);
      return;
    }

    try {
      setStatus('preparing');

      const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
      
      const { tx } = await walletClient.pChain.prepareAddPermissionlessValidatorTxn({
        nodeId: validator!.nodeID,
        stakeInAvax: Number(stakeAmount),
        end: endUnix,
        rewardAddresses: [pChainAddress!],
        delegatorRewardAddresses: [pChainAddress!],
        delegatorRewardPercentage: Number(delegatorRewardPercentage),
        threshold: 1,
        locktime: 0,
        publicKey: validator!.nodePOP.publicKey,
        signature: validator!.nodePOP.proofOfPossession,
      });

      setStatus('pending');

      const { txHash } = await walletClient.sendXPTransaction({
        tx: tx,
        chainAlias: 'P',
      });

      const stakeResult: StakeResult = {
        txHash,
        nodeId: validator!.nodeID,
        stakeAmount,
        endTime: endUnix,
      };

      setResult(stakeResult);
      setStatus('success');
      onSuccess?.(stakeResult);
    } catch (e: any) {
      console.error(e);
      const error = { message: e.message };
      setError(error);
      setStatus('error');
      onError?.(error);
    }
  }, [
    validateForm,
    walletClient,
    endTime,
    validator,
    stakeAmount,
    pChainAddress,
    delegatorRewardPercentage,
    onSuccess,
    onError,
  ]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setValidator(null);
    setStakeAmount('');
    setEndTime('');
    setDelegatorRewardPercentage(DEFAULT_DELEGATOR_REWARD_PERCENTAGE);
    setError(undefined);
    setResult(undefined);
    initializeDefaults();
  }, [initializeDefaults]);

  const contextValue = useMemo((): StakeContextType => ({
    status,
    validator,
    stakeAmount,
    endTime,
    delegatorRewardPercentage,
    error,
    result,
    networkConfig,
    isTestnet,
    isFormValid,
    setValidator,
    setStakeAmount,
    setEndTime,
    setDelegatorRewardPercentage,
    setEndInDays,
    submitStake,
    clearError,
    reset,
  }), [
    status,
    validator,
    stakeAmount,
    endTime,
    delegatorRewardPercentage,
    error,
    result,
    networkConfig,
    isTestnet,
    isFormValid,
    setEndInDays,
    submitStake,
    clearError,
    reset,
  ]);

  return (
    <StakeContext.Provider value={contextValue}>
      {children}
    </StakeContext.Provider>
  );
}
