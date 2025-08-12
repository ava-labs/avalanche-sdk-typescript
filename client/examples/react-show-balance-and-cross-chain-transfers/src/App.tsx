import { createAvalancheWalletClient } from '@avalanche-sdk/client'
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains'
import { Alert, Box, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { BalanceCard } from './components/BalanceCard'
import { TransferCard } from './components/TransferCard'
import { WalletConnect } from './components/WalletConnect'

// This app expects the Core browser extension to be installed and available as window.avalanche
// It connects via EIP-1193 provider and uses the wallet client to query balances and perform cross-chain transfers.

export default function App() {
  // State management for the application
  // Controls which network (Fuji testnet or Mainnet) the app is configured for
  const [chain, setChain] = useState<'mainnet' | 'fuji'>('fuji')
  
  // Stores the currently connected wallet address
  // null when no wallet is connected
  const [address, setAddress] = useState<string | null>(null)
  
  // Stores any error messages that occur during wallet operations
  // null when no errors are present
  const [error, setError] = useState<string | null>(null)
  
  // Stores the chain ID that the wallet is currently connected to
  // This helps detect when wallet and app are on different networks
  const [walletChainId, setWalletChainId] = useState<number | null>(null)

  // Derive the actual Chain object based on the selected network
  // This determines which network configuration to use for SDK operations
  const selectedChain = chain === 'fuji' ? avalancheFuji : avalanche

  const switchChainIfNeeded = async () => {
    if (walletChainId !== selectedChain.id) {
      const provider = (window as any).avalanche
      if (provider) {
        try {
          // Create a new wallet client with the selected chain
          const walletClient = createAvalancheWalletClient({
            chain: selectedChain,
            transport: { type: 'custom', provider },
            } as any);
            await walletClient.switchChain({
                id: selectedChain.id,
            }) 
            setWalletChainId(selectedChain.id)
        } catch (e: any) {
          // If switching fails, show an error message
          console.error('Error switching to new selected chain:', e)
          setError(`Failed to switch to ${chain}: ${e.message}`)
        }
      }
    }
  }

  // Handle chain selection changes and switch wallet if needed
  useEffect(() => {
    switchChainIfNeeded();
  }, [chain, selectedChain, walletChainId])

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4 
    }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              borderRadius: 4
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #E84142 0%, #c92a2a 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                🏔️ Avalanche Client SDK Example
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ fontWeight: 400, maxWidth: '600px', mx: 'auto' }}
              >
                Connect your Core browser wallet, view P-Chain and C-Chain balances, and transfer AVAX between chains seamlessly.
              </Typography>
            </Box>
            
            {/* Display current wallet and app chain information when available */}
            {walletChainId && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Chip 
                  label={`Wallet: ${walletChainId}`} 
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  label={`App: ${selectedChain.name} (${selectedChain.id})`} 
                  color="secondary" 
                  variant="outlined"
                  size="small"
                />
              </Box>
            )}
          </Paper>

          {/* Error Alert - Display any error messages from wallet operations */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 3,
                '& .MuiAlert-message': { fontWeight: 500 }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Wallet Connection Component - Handles Core extension connection */}
          <WalletConnect
            chain={selectedChain}
            onConnected={(addr) => setAddress(addr)} // Callback when wallet connects
            onError={(e) => setError(e.message || String(e))} // Callback when errors occur
            onNetworkChange={(net) => setChain(net)} // Callback when user changes network
          />

          {/* Balance Cards Section - Show P-Chain and C-Chain balances when connected */}
          {address && (
            <Box>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                Balance Overview
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                {/* P-Chain Balance Card - Shows Platform Chain AVAX balance */}
                <BalanceCard
                  title="P-Chain Balance"
                  chainAlias="P"
                  chain={selectedChain}
                  address={address}
                  walletChainId={walletChainId}
                />
                {/* C-Chain Balance Card - Shows Contract Chain AVAX balance */}
                <BalanceCard
                  title="C-Chain Balance"
                  chainAlias="C"
                  chain={selectedChain}
                  address={address}
                  walletChainId={walletChainId}
                />
              </Stack>
            </Box>
          )}

          {/* Transfer Cards Section - Enable cross-chain AVAX transfers when connected */}
          {address && (
            <Box>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                Cross-Chain Transfers
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                {/* P → C Transfer Card - Transfer AVAX from Platform to Contract chain */}
                <TransferCard
                  title="P → C Transfer"
                  fromAlias="P"
                  toAlias="C"
                  chain={selectedChain}
                  address={address}
                />
                {/* C → P Transfer Card - Transfer AVAX from Contract to Platform chain */}
                <TransferCard
                  title="C → P Transfer"
                  fromAlias="C"
                  toAlias="P"
                  chain={selectedChain}
                  address={address}
                />
              </Stack>
            </Box>
          )}

          {/* Footer - Attribution and branding */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              borderRadius: 3
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Built with ❤️ using Avalanche SDK TypeScript
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}