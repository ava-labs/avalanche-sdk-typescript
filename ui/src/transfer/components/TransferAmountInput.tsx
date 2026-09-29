'use client';
import { useCallback, useMemo } from 'react';
import { useTransferContext } from '../hooks/useTransferContext';
import { useWalletContext } from '../../wallet/hooks/useWalletContext';
import { cn } from '../../styles/theme';
import { AmountInput } from '../../components/ui/amount-input';
import type { TransferAmountInputProps } from '../types';

export function TransferAmountInput({
  className,
  label = 'Amount',
  placeholder = '0.0',
  showMax = true,
  disabled = false,
}: TransferAmountInputProps) {
  const { amount, setAmount, status, fromChain } = useTransferContext();
  const { balances } = useWalletContext();

  const isDisabled = disabled || status === 'preparing' || status === 'pending';

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, [setAmount]);

  // Get the available balance for the selected chain
  const availableBalance = useMemo(() => {
    if (fromChain === 'P') return balances.pChain.avax;
    if (fromChain === 'X') return balances.xChain.avax;
    return balances.cChain.avax;
  }, [fromChain, balances]);

  const handleMaxClick = useCallback(() => {
    // Use 99% of available balance to account for gas fees
    const maxAmount = (parseFloat(availableBalance) * 0.99).toFixed(6);
    setAmount(maxAmount);
  }, [availableBalance, setAmount]);

  // Get USD rate from any chain balance (they should all have the same rate)
  const usdRate = useMemo(() => {
    const balance = balances.cChain;
    if (balance.usd && balance.avax) {
      return parseFloat(balance.usd) / parseFloat(balance.avax);
    }
    return 0;
  }, [balances.cChain]);

  return (
    <AmountInput
      id="transfer-amount"
      label={label}
      placeholder={placeholder}
      value={amount}
      onChange={handleAmountChange}
      disabled={isDisabled}
      showMax={showMax}
      showUSD={true}
      showBalance={true}
      usdRate={usdRate}
      maxValue={availableBalance}
      onMaxClick={handleMaxClick}
      containerClassName={cn(className)}
      data-testid="transfer-amount-input"
    />
  );
}
