import { Address, createAvalancheWalletClient } from '@avalanche-sdk/client'
import type { Chain } from '@avalanche-sdk/client/chains'
import { ArrowForward, CheckCircle, Error as ErrorIcon, Send } from '@mui/icons-material'
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, LinearProgress, Stack, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

/**
 * TransferCard component
 * - Uses wallet transfer utilities to move AVAX between P and C chains
 * - Supports P → C and C → P transfer directions
 * - Requires Core extension and the currently selected account
 * - Shows real-time transfer status and processing states
 */
export function TransferCard({
  title,
  fromAlias,
  toAlias,
  chain,
  address,
}: {
  title: string
  fromAlias: 'P' | 'C'  // Source chain (Platform or Contract)
  toAlias: 'P' | 'C'    // Destination chain (Platform or Contract)
  chain: Chain           // Current network configuration
  address: string        // Source wallet address
}) {
  // State management for transfer form and status
  // Stores the destination address entered by the user
  const [toAddress, setToAddress] = useState('')
  
  // Stores the AVAX amount to transfer (as string for input handling)
  const [amount, setAmount] = useState('')
  
  // Stores the current status message (success, error, or processing)
  const [status, setStatus] = useState<string>('')
  
  // Tracks whether a transfer operation is currently in progress
  // Used to show loading states and disable form inputs
  const [isProcessing, setIsProcessing] = useState(false)

  // Memoize the wallet client to prevent recreation on every render
  // The client is only recreated when the chain changes
  const client = useMemo(() => {
    const provider = (window as any).avalanche
    return createAvalancheWalletClient({
      chain,
      transport: { type: 'custom', provider },
    } as any)
  }, [chain])

  // Main transfer function that handles the cross-chain transfer
  // This function orchestrates the entire transfer process
  const onTransfer = async () => {
    try {
      // Set processing state to show loading indicators
      setIsProcessing(true)
      setStatus('Processing...')
      
      // Parse and validate the amount input
      const value = Number(amount)
      if (!value || value <= 0) throw new Error('Enter a valid amount')

      if (fromAlias === 'P' && toAlias === 'C') {
        // P → C transfer logic (Platform Chain to Contract Chain)
        // This requires specifying both source and destination chains
        const res = await client.send({
          to: toAddress as Address,
          amount: value, // AVAX amount (SDK utils handle conversion)
          sourceChain: "P",      // Source: Platform Chain
          destinationChain: "C", // Destination: Contract Chain
        })
        
        // Show success message with transaction hashes
        setStatus(`Submitted: ${JSON.stringify(res.txHashes, null, 2)}`)
      } else if (fromAlias === 'C' && toAlias === 'P') {
        // C → P transfer logic (Contract Chain to Platform Chain)
        // For C → P, we only need to specify the destination chain
        const res = await client.send({
          to: toAddress,
          amount: value,
          destinationChain: "P", // Destination: Platform Chain
        })
        
        // Show success message with transaction hashes
        setStatus(`Submitted: ${JSON.stringify(res.txHashes, null, 2)}`)
      } else {
        // Handle unsupported transfer directions
        throw new Error('Unsupported direction')
      }
    } catch (e: any) {
      // If any error occurs, show it in the status
      setStatus(`Error: ${e.message || String(e)}`)
    } finally {
      // Always reset processing state, regardless of success/failure
      setIsProcessing(false)
    }
  }

  // Helper function to get the appropriate icon for the transfer direction
  // Currently uses ArrowForward for all directions
  const getDirectionIcon = () => {
    return <ArrowForward />;
  };

  // Helper function to get the appropriate color for the transfer direction
  // P-Chain transfers use primary color, C-Chain transfers use secondary color
  const getDirectionColor = () => {
    return fromAlias === 'P' ? 'primary' : 'secondary';
  };

  // Helper function to get the human-readable description for the transfer
  // Shows the source and destination chains in a user-friendly format
  const getDirectionDescription = () => {
    return `Transfer AVAX from ${fromAlias}-Chain to ${toAlias}-Chain`;
  };

  // Form validation - checks if all required fields are filled and valid
  // This determines whether the transfer button should be enabled
  const isFormValid = toAddress.trim() && amount.trim() && Number(amount) > 0;

  // Helper function to get the appropriate icon for the status alert
  // Shows different icons based on the current status
  const getStatusIcon = () => {
    if (isProcessing) return null; // No icon during processing
    if (status.includes('Error')) return <ErrorIcon color="error" />;
    if (status.includes('Submitted')) return <CheckCircle color="success" />;
    return null;
  };

  // Helper function to get the appropriate severity for the status alert
  // Maps different status types to Material-UI alert severities
  const getStatusColor = () => {
    if (isProcessing) return 'info';
    if (status.includes('Error')) return 'error';
    if (status.includes('Submitted')) return 'success';
    return 'default';
  };

  return (
    <Card sx={{ 
      flex: 1,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      borderRadius: 4,
      position: 'relative',
      overflow: 'visible'
    }}>
      {/* Processing Progress Bar - Shows at the top during transfer */}
      {isProcessing && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0,
            height: 3,
            borderRadius: '4px 4px 0 0'
          }} 
        />
      )}
      
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header Section - Shows transfer direction and chain info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            pb: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            {/* Direction Icon Avatar - Color-coded based on source chain */}
            <Avatar 
              sx={{ 
                bgcolor: `${getDirectionColor()}.main`,
                width: 48,
                height: 48
              }}
            >
              {getDirectionIcon()}
            </Avatar>
            
            {/* Transfer Information */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getDirectionDescription()}
              </Typography>
            </Box>
            
            {/* Direction Chips - Show source → destination chain flow */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={fromAlias} 
                color={getDirectionColor()} 
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <ArrowForward sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Chip 
                label={toAlias} 
                color={getDirectionColor()} 
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>

          {/* Form Fields Section - Destination address and amount inputs */}
          <Stack spacing={2}>
            {/* Destination Address Input */}
            <TextField
              label={toAlias === 'C' ? 'To (C-Chain EVM Address)' : 'To (P-Chain Address)'}
              placeholder={toAlias === 'C' ? '0x...' : 'P-avax1...'}
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              fullWidth
              disabled={isProcessing} // Disable during transfer
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            {/* Amount Input */}
            <TextField
              label="Amount (AVAX)"
              placeholder="1.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              disabled={isProcessing} // Disable during transfer
              type="number"
              inputProps={{ 
                min: 0, 
                step: 0.0001, // Allow 4 decimal places for precision
                style: { textAlign: 'right' } // Right-align for better number readability
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Stack>

          {/* Transfer Button - Initiates the cross-chain transfer */}
          <Button 
            variant="contained" 
            onClick={onTransfer}
            disabled={!isFormValid || isProcessing} // Disable if form invalid or processing
            startIcon={isProcessing ? null : <Send />} // Show send icon only when not processing
            fullWidth
            sx={{ 
              height: 48,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            {isProcessing ? 'Processing...' : 'Transfer AVAX'}
          </Button>

          {/* Status Display - Shows transfer results or errors */}
          {status && (
            <Alert 
              severity={getStatusColor() as any}
              icon={getStatusIcon()}
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': { fontWeight: 500 }
              }}
            >
              {status}
            </Alert>
          )}

          {/* Info Box - Shows source address and network information */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(232, 65, 66, 0.05)', 
            borderRadius: 2,
            border: '1px solid rgba(232, 65, 66, 0.1)'
          }}>
            {/* Source Address - Shows where the transfer is coming from */}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              <strong>From:</strong> {address.slice(0, 8)}...{address.slice(-6)}
            </Typography>
            
            {/* Network Information - Shows current network and chain ID */}
            <Typography variant="caption" color="text.secondary">
              <strong>Network:</strong> {chain.name} ({chain.id})
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}