'use client';
import { cn } from '../../styles/theme';
import { Button } from '../../components/ui/button';
import { LoaderCircle, Send, CheckCircle, RefreshCw } from 'lucide-react';
import { useICTTContext } from './ICTTProvider';
import { useAvalanche } from '../../AvalancheProvider';

export interface ICTTButtonsProps {
  className?: string;
}

export function ICTTButtons({ className }: ICTTButtonsProps) {
  const { 
    approveToken,
    sendToken,
    isApproving,
    isSending,
    isApproved,
    isCheckingAllowance,
    isValidForApproval,
    isValidForSending,
    validationErrors,
    isOnCorrectChain,
    isSwitchingChain,
    switchToSourceChain,
    fromChain,
    selectedToken,
    amount,
  } = useICTTContext();
  
  const { availableChains } = useAvalanche();

  const getChainName = (chainId: string) => {
    const chain = availableChains.find(c => c.id.toString() === chainId);
    return chain?.name || `Chain ${chainId}`;
  };

  const getSwitchChainButtonText = () => {
    if (isSwitchingChain) return 'Switching Chain...';
    return `Switch to ${getChainName(fromChain)}`;
  };

  const getApproveButtonText = () => {
    if (isApproving) return 'Approving...';
    if (isCheckingAllowance) return 'Checking Allowance...';
    if (isApproved) return 'Approved';
    if (!isValidForApproval && validationErrors.length > 0) {
      return validationErrors[0];
    }
    
    // Show amount and token symbol if available
    if (selectedToken && amount) {
      return `Approve ${amount} ${selectedToken.symbol}`;
    }
    
    return 'Approve Token';
  };

  const getSendButtonText = () => {
    if (isSending) return 'Sending...';
    if (!isApproved) return 'Approve First';
    if (!isValidForSending && validationErrors.length > 0) {
      return validationErrors[0];
    }
    
    // Show amount and token symbol if available
    if (selectedToken && amount) {
      return `Send ${amount} ${selectedToken.symbol}`;
    }
    
    return 'Send Token';
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Switch Chain Button - only show when not on correct chain */}
      {!isOnCorrectChain && (
        <Button
          onClick={switchToSourceChain}
          disabled={isSwitchingChain}
          className="w-full text-white"
          size="lg"
          variant="destructive"
        >
          {isSwitchingChain ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {getSwitchChainButtonText()}
        </Button>
      )}

      {/* Approve Button */}
      <Button
        onClick={approveToken}
        disabled={!isOnCorrectChain || !isValidForApproval || isApproving || isCheckingAllowance || isApproved}
        className="w-full"
        size="lg"
        variant={isApproved ? "outline" : "default"}
      >
        {isApproving || isCheckingAllowance ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : isApproved ? (
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        {getApproveButtonText()}
      </Button>

      {/* Send Button */}
      <Button
        onClick={sendToken}
        disabled={!isOnCorrectChain || !isValidForSending || isSending || !isApproved}
        className="w-full"
        size="lg"
      >
        {isSending ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {getSendButtonText()}
      </Button>

      {/* Chain Status Info */}
      {!isOnCorrectChain && (
        <div className="text-xs text-destructive text-center">
          Please switch to {getChainName(fromChain)} to continue
        </div>
      )}
    </div>
  );
}
