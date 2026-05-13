import * as React from "react"
import { Lock } from "lucide-react"
import { cn, text } from "../../styles/theme"
import { Button } from "./button"
import { useAvalanche } from "../../AvalancheProvider"

export interface WalletConnectionOverlayProps {
  children: React.ReactNode
  className?: string
  showOverlay?: boolean
}

const WalletConnectionOverlay = React.forwardRef<HTMLDivElement, WalletConnectionOverlayProps>(
  ({ children, className, showOverlay: forceShowOverlay, ...props }, ref) => {
    const { isWalletConnected, connectWallet } = useAvalanche()
    
    // Show overlay if wallet is not connected or if explicitly forced
    const shouldShowOverlay = forceShowOverlay || !isWalletConnected

    const handleConnectWallet = async () => {
      try {
        await connectWallet()
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    }

    // If wallet is not connected, show the connection state inline
    if (shouldShowOverlay) {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <div className="flex flex-col items-center justify-center gap-6 p-8 text-center min-h-[400px]">
            {/* Lock Icon */}
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h3 className={cn(text.title3, "font-semibold text-foreground")}>
                Wallet Not Connected
              </h3>
              <p className={cn(text.body, "text-muted-foreground max-w-md")}>
                Connect your wallet to start making transfers on the Avalanche network.
              </p>
            </div>

            {/* Connect Button */}
            <Button 
              onClick={handleConnectWallet}
              size="lg"
              className="px-8"
            >
              Connect Wallet
            </Button>

            {/* Help Text */}
            <p className={cn(text.legal, "text-muted-foreground max-w-sm")}>
              Make sure you have Core Wallet or another compatible wallet installed.
            </p>
          </div>
        </div>
      )
    }

    // If wallet is connected, show the children normally
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    )
  }
)
WalletConnectionOverlay.displayName = "WalletConnectionOverlay"

export { WalletConnectionOverlay }
