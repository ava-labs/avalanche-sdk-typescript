'use client';
import { useWalletContext } from '../hooks/useWalletContext';
import { cn } from '../../styles/theme';
import { Button } from '../../components/ui/button';
import { Loader2, Check, Lock } from 'lucide-react';
import type { WalletConnectProps } from '../types';

export function WalletConnect({
  className,
  connectText = 'Connect Wallet',
  connectedText = 'Connected',
  showLoading = true,
}: WalletConnectProps) {
  const { status, connect } = useWalletContext();

  const isConnecting = status === 'connecting';
  const isConnected = status === 'connected';
  const isDisabled = isConnecting; // Only disable while connecting, not when connected

  const handleClick = () => {
    if (!isDisabled && !isConnected) {
      connect();
    }
  };

  const getButtonText = () => {
    if (isConnecting && showLoading) return 'Connecting...';
    if (isConnected) return connectedText;
    return connectText;
  };

  const getButtonIcon = () => {
    if (isConnecting && showLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    if (isConnected) {
      return <Check className="h-4 w-4" />;
    }

    return <Lock className="h-4 w-4" />;
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      variant={isConnected ? "ghost" : "default"}
      className={cn(
        'flex items-center gap-2',
        isConnected && '!bg-green-600 hover:!bg-green-700 !border-green-600 !text-white shadow-sm',
        !isConnected && 'hover:bg-primary/90',
        className,
      )}
      data-testid="wallet-connect"
    >
      <div className="flex items-center gap-2">
        {getButtonIcon()}
        <span className="font-medium">{getButtonText()}</span>
      </div>
    </Button>
  );
}
