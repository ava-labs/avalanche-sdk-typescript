import { createAvalancheWalletClient } from '@avalanche-sdk/client'
import type { Chain } from '@avalanche-sdk/client/chains'
import { AccountBalanceWallet, CheckCircle, PowerSettingsNew } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useCallback, useState } from 'react'

/**
 * WalletConnect component
 * - Connects to Core browser extension via EIP-1193 provider (window.avalanche)
 * - Requests accounts and sets the current address
 * - Allows toggling between Fuji and Mainnet chains
 */
export function WalletConnect({
  chain,
  onConnected,
  onError,
  onNetworkChange,
}: {
  chain: Chain
  onConnected: (address: string) => void
  onError: (err: Error) => void
  onNetworkChange: (net: 'mainnet' | 'fuji') => void
}) {
  // State management for wallet connection
  // Tracks whether the wallet is currently connected to the Core extension
  const [connected, setConnected] = useState(false)
  
  // Stores the connected wallet address
  // null when no wallet is connected
  const [address, setAddress] = useState<string | null>(null)
  
  // Tracks which network the user has selected in the UI
  // Defaults to 'fuji' (testnet) for safety
  const [network, setNetwork] = useState<'mainnet' | 'fuji'>('fuji')

  // Connect to Core extension and get current account
  // This function handles the entire connection flow
  const connect = useCallback(async () => {
    try {
      // Ensure the Core extension provider exists in the window object
      // This is the EIP-1193 provider that allows communication with the wallet
      const provider = (window as any).avalanche
      if (!provider) throw new Error('Core extension not found. Please install Core. https://core.app')
      
      // Create an Avalanche wallet client using the provider
      // This client handles all wallet operations (signing, account requests, etc.)
      const client = createAvalancheWalletClient({
        chain,
        transport: { type: 'custom', provider },
      } as any)

      // Request accounts using EIP-1193 standard
      // This prompts the user to connect their wallet if not already connected
      const accounts: string[] = await client.requestAddresses()
      const addr = accounts[0] // Get the first (and usually only) account
      
      // Update local state to reflect successful connection
      setAddress(addr)
      setConnected(true)
      
      // Notify parent component about successful connection
      onConnected(addr)
    } catch (e: any) {
      // If any error occurs during connection, notify the parent component
      onError(e)
    }
  }, [onConnected, onError])

  // Handle network selection changes from the UI toggle buttons
  // This function is called when user clicks Fuji or Mainnet buttons
  const handleNetworkChange = (_: any, value: 'mainnet' | 'fuji' | null) => {
    // Ignore null values (when no button is selected)
    if (!value) return
    
    // Update local network state
    setNetwork(value)
    
    // Notify parent component about network change
    // This will trigger chain switching logic in the parent
    onNetworkChange(value)
  }

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      borderRadius: 4
    }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header Section - Shows connection status and wallet info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            pb: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            {/* Avatar that changes based on connection status */}
            <Avatar 
              sx={{ 
                bgcolor: connected ? 'success.main' : 'primary.main',
                width: 48,
                height: 48
              }}
            >
              {/* Show checkmark when connected, wallet icon when disconnected */}
              {connected ? <CheckCircle /> : <AccountBalanceWallet />}
            </Avatar>
            
            {/* Text content that changes based on connection status */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {connected ? 'Wallet Connected' : 'Connect Wallet'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {connected ? 'Your Core wallet is ready to use' : 'Connect your Core browser extension'}
              </Typography>
            </Box>
          </Box>

          {/* Connection Status and Controls Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'stretch', sm: 'center' }, 
            justifyContent: 'space-between',
            gap: 2
          }}>
            {/* Left side - Connection status display */}
            <Box sx={{ flex: 1 }}>
              {connected ? (
                // Show connected status with address
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Connected
                    </Typography>
                    {/* Display truncated address for better UX */}
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                // Show disconnected status
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PowerSettingsNew color="action" />
                  <Typography variant="body1" color="text.secondary">
                    Not connected
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Right side - Network toggle and connect button */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              {/* Network Toggle - Allows user to switch between Fuji and Mainnet */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Network
                </Typography>
                <ToggleButtonGroup 
                  exclusive 
                  value={network} 
                  onChange={handleNetworkChange} 
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 2,
                      py: 1,
                      minWidth: 80
                    }
                  }}
                >
                  {/* Fuji Testnet Button */}
                  <ToggleButton value="fuji">
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                        Fuji
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Testnet
                      </Typography>
                    </Box>
                  </ToggleButton>
                  
                  {/* Mainnet Button */}
                  <ToggleButton value="mainnet">
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                        Mainnet
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Production
                      </Typography>
                    </Box>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Connect Button - Changes appearance based on connection status */}
              <Button 
                variant={connected ? "outlined" : "contained"} 
                onClick={connect} 
                disabled={connected} // Disable when already connected
                startIcon={connected ? <CheckCircle /> : <PowerSettingsNew />}
                sx={{ 
                  minWidth: 140,
                  height: 48,
                  borderRadius: 3
                }}
              >
                {connected ? 'Connected' : 'Connect Core'}
              </Button>
            </Stack>
          </Box>

          {/* Network Info Section - Shows current chain details */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(232, 65, 66, 0.05)', 
            borderRadius: 2,
            border: '1px solid rgba(232, 65, 66, 0.1)'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              <strong>Current Network:</strong> {chain.name} (ID: {chain.id})
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}