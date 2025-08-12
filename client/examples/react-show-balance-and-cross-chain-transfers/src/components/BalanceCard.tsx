import { Address, createAvalancheWalletClient, formatEther } from "@avalanche-sdk/client";
import { publicKeyToXPAddress } from "@avalanche-sdk/client/accounts";
import type { Chain } from "@avalanche-sdk/client/chains";
import { getBalance as getCChainBalance } from "@avalanche-sdk/client/methods";
import { getBalance as getPChainBalance } from "@avalanche-sdk/client/methods/pChain";
import { AccountBalance, CurrencyExchange, Refresh } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    LinearProgress,
    Stack,
    Typography
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * BalanceCard component
 * - For P-Chain: derives P bech32 address from wallet public key, then calls pChain.getBalance
 * - For C-Chain: uses evm getBalance via wallet client
 * - Automatically refreshes balance every 20 seconds
 * - Shows loading states and error handling
 */
export function BalanceCard({
  title,
  chainAlias,
  chain,
  address,
  walletChainId,
}: {
  title: string;
  chainAlias: "P" | "C";
  chain: Chain;
  address: string;
  walletChainId: number | null;
}) {
  // State management for balance display
  // Stores the current balance as a string (formatted for display)
  const [balance, setBalance] = useState<string>("0");
  
  // Tracks whether a balance fetch operation is currently in progress
  // Used to show loading indicators and disable refresh button
  const [loading, setLoading] = useState<boolean>(false);
  
  // Stores the derived address for the specific chain
  // For P-Chain: this will be the bech32 address
  // For C-Chain: this will be the same as the input address
  const [addr, setAddr] = useState<string>(address);
  
  // Memoize the client creation to prevent infinite re-renders
  // The client is only recreated when the chain changes
  const client = useMemo(() => {
    const provider = (window as any).avalanche;
    if (!provider) return null;

    return createAvalancheWalletClient({
      chain,
      transport: { type: "custom", provider },
    } as any);
  }, [chain]); // Only recreate when chain changes

  // Memoize the fetch function to prevent recreation on every render
  // This function handles fetching balance for both P-Chain and C-Chain
  const fetchBalance = useCallback(async () => {
    if (!client || !address) return;

    try {
      setLoading(true);
      
      if (chainAlias === "P") {
        // P-Chain balance fetching logic
        // First, get the public key from the connected wallet
        const { xp } = await client.getAccountPubKey();
        
        // Determine the correct HRP (Human Readable Part) based on network
        // 'fuji' for testnet, 'avax' for mainnet
        const hrp = chain.name?.includes("Fuji") ? "fuji" : "avax";
        
        // Derive the bech32 XP address from the public key
        const xpBech32 = publicKeyToXPAddress(xp, hrp);
        
        // Use the pChain sub-client's getBalance method to fetch balance
        // The balance is returned in nano-AVAX (1e9 units)
        const res = await getPChainBalance(client.pChainClient, {
          addresses: [`P-${xpBech32}`],
        });
        
        // Convert nano-AVAX to AVAX and format for display
        setBalance(formatEther(res.balance * BigInt(1e+9)));
        
        // Update the displayed address to show the derived P-Chain address
        setAddr(`P-${xpBech32}`);
      } else {
        // C-Chain balance fetching logic
        // Use the cChain sub-client's getBalance method
        // The balance is returned in wei (1e18 units)
        const wei = await getCChainBalance(client, {
          address: address as Address,
        });
        
        // Convert wei to AVAX and format for display
        setBalance(Number(formatEther(wei)).toString());
      }
    } catch (e) {
      // If any error occurs during balance fetching, log it and reset balance
      console.error("Error fetching balance:", e);
      setBalance("0");
    } finally {
      // Always ensure loading state is reset, regardless of success/failure
      setLoading(false);
    }
  }, [client, chainAlias, chain, walletChainId]);

  // Effect to set up automatic balance fetching
  // This runs when the component mounts and when the client changes
  useEffect(() => {
    if (client) {
      // Fetch balance immediately when component mounts or client changes
      console.log("fetching balance", walletChainId);
      fetchBalance();

      // Set up interval to fetch balance every 20 seconds
      // This keeps the balance up-to-date without manual refresh
      const intervalId = setInterval(() => {
        fetchBalance();
      }, 20000);

      // Clean up interval on unmount to prevent memory leaks
      // This is important for preventing multiple intervals from running
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [client, walletChainId]); // Only depend on client and walletChainId

  // Helper function to get the appropriate icon for the chain
  // P-Chain uses AccountBalance icon, C-Chain uses CurrencyExchange icon
  const getChainIcon = () => {
    return chainAlias === "P" ? <AccountBalance /> : <CurrencyExchange />;
  };

  // Helper function to get the appropriate color for the chain
  // P-Chain uses primary color, C-Chain uses secondary color
  const getChainColor = () => {
    return chainAlias === "P" ? "primary" : "secondary";
  };

  // Helper function to get the human-readable description for the chain
  // P-Chain is "Platform Chain", C-Chain is "Contract Chain"
  const getChainDescription = () => {
    return chainAlias === "P" ? "Platform Chain" : "Contract Chain";
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
      {/* Loading Progress Bar - Shows at the top of the card during balance fetch */}
      {loading && (
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
          {/* Header Section - Shows chain info and status */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            pb: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            {/* Chain Icon Avatar - Color-coded based on chain type */}
            <Avatar 
              sx={{ 
                bgcolor: `${getChainColor()}.main`,
                width: 48,
                height: 48
              }}
            >
              {getChainIcon()}
            </Avatar>
            
            {/* Chain Information */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getChainDescription()}
              </Typography>
            </Box>
            
            {/* Chain Alias Chip - Shows P or C */}
            <Chip 
              label={chainAlias} 
              color={getChainColor()} 
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Address Display Section - Shows the relevant address for the chain */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(0, 0, 0, 0.02)', 
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Address
            </Typography>
            {/* Monospace font for better address readability */}
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                fontSize: '0.75rem'
              }}
            >
              {addr}
            </Typography>
          </Box>

          {/* Balance Display Section - Shows current balance or loading state */}
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {loading ? (
              // Loading state with spinner and message
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={40} color={getChainColor()} />
                <Typography variant="body2" color="text.secondary">
                  Fetching balance...
                </Typography>
              </Box>
            ) : (
              // Balance display with large text
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  {parseFloat(balance).toFixed(4)} AVAX
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Balance
                </Typography>
              </Box>
            )}
          </Box>

          {/* Refresh Button - Allows manual balance refresh */}
          <Button
            variant="outlined"
            onClick={fetchBalance}
            disabled={loading} // Disable during fetch to prevent multiple requests
            startIcon={<Refresh />}
            fullWidth
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Balance'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
