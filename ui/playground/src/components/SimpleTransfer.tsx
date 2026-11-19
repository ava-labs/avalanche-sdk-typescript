import React from 'react';
import { TransferProvider, useTransferContext, TransferButton, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@avalanche-sdk/ui';

// Internal component that uses the transfer context
function SimpleTransferContent() {
  const { setAmount, setToAddress } = useTransferContext();
  const predefinedAddress = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"; // Example address
  const predefinedAmount = "0.1";

  // Set the predefined values when component mounts
  React.useEffect(() => {
    setToAddress(predefinedAddress);
    setAmount(predefinedAmount);
  }, [setToAddress, setAmount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Payment</CardTitle>
        <CardDescription>Send AVAX on C-Chain with one click</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <strong>To:</strong> {predefinedAddress}
        </div>
        <div className="text-sm">
          <strong>Amount:</strong> {predefinedAmount} AVAX
        </div>
        <TransferButton text={`Send ${predefinedAmount} AVAX`} />
      </CardContent>
    </Card>
  );
}

// Custom Simple Transfer Component using TransferProvider
export function SimpleTransfer() {
  return (
    <TransferProvider
      initialFromChain="C"
      initialToChain="C"
      onSuccess={(result) => {
        console.log('Transfer successful:', result);
      }}
      onError={(error) => {
        console.error('Transfer error:', error);
      }}
    >
      <SimpleTransferContent />
    </TransferProvider>
  );
}
