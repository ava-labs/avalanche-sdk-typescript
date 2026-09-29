import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn, text } from "../../styles/theme"
import { Button } from "./button"
import { useAvalanche } from "../../AvalancheProvider"
import { avalanche, avalancheFuji } from "@avalanche-sdk/client/chains"

export interface AvalancheChainOverlayProps {
  children: React.ReactNode
  className?: string
  showOverlay?: boolean
  /** If true (default), only allows Mainnet. If false, allows both Mainnet and Fuji. */
  onlyMainnet?: boolean
}

const AvalancheChainOverlay = React.forwardRef<HTMLDivElement, AvalancheChainOverlayProps>(
  ({ children, className, showOverlay: forceShowOverlay, onlyMainnet, ...props }, ref) => {
    const { chain: currentChain, switchChain, availableChains } = useAvalanche()
    
    // Check if current chain is Avalanche Mainnet or Fuji (if allowed)
    const isAvalancheMainnet = currentChain.id === avalanche.id
    const isAvalancheFuji = currentChain.id === avalancheFuji.id
    const isAllowedChain = isAvalancheMainnet || (!onlyMainnet && isAvalancheFuji)
    
    // Show overlay if not on allowed Avalanche chain or if explicitly forced
    const shouldShowOverlay = forceShowOverlay !== undefined ? forceShowOverlay : !isAllowedChain

    const handleSwitchToFuji = async () => {
      try {
        const fujiChain = availableChains.find(c => c.id === avalancheFuji.id)
        if (fujiChain && switchChain) {
          await switchChain(fujiChain)
        }
      } catch (error) {
        console.error('Failed to switch to Fuji:', error)
      }
    }

    const handleSwitchToMainnet = async () => {
      try {
        const mainnetChain = availableChains.find(c => c.id === avalanche.id)
        if (mainnetChain && switchChain) {
          await switchChain(mainnetChain)
        }
      } catch (error) {
        console.error('Failed to switch to Mainnet:', error)
      }
    }

    // If not on Avalanche chain, show the overlay
    if (shouldShowOverlay) {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <div className="flex flex-col items-center justify-center gap-6 p-8 text-center min-h-[400px]">
            {/* Alert Icon */}
            <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h3 className={cn(text.title3, "font-semibold text-foreground")}>
                Wrong Network
              </h3>
              <p className={cn(text.body, "text-muted-foreground max-w-md")}>
                This feature is only available on Avalanche C-Chain{onlyMainnet ? ' (Mainnet)' : ' (Mainnet or Fuji Testnet)'}. You're currently on{" "}
                <span className="font-semibold text-foreground">{currentChain.name}</span>.
              </p>
            </div>

            {/* Switch Network Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!onlyMainnet && (
                <Button 
                  onClick={handleSwitchToFuji}
                  size="lg"
                  variant="default"
                  className="px-8"
                >
                  Switch to Fuji Testnet
                </Button>
              )}
              <Button 
                onClick={handleSwitchToMainnet}
                size="lg"
                variant={!onlyMainnet ? "outline" : "default"}
                className="px-8"
              >
                Switch to Mainnet
              </Button>
            </div>

            {/* Help Text */}
            <p className={cn(text.legal, "text-muted-foreground max-w-sm")}>
              Please switch to Avalanche C-Chain {onlyMainnet ? '(Mainnet)' : '(Mainnet or Fuji Testnet)'} to use this feature.
            </p>
          </div>
        </div>
      )
    }

    // If on Avalanche chain, show the children normally
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    )
  }
)
AvalancheChainOverlay.displayName = "AvalancheChainOverlay"

export { AvalancheChainOverlay }

