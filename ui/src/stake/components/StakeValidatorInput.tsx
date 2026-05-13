'use client';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { cn } from '../../styles/theme';
import { useStakeContext } from './StakeProvider';
import type { StakeValidatorInputProps, ValidatorCredentials } from '../types';

export function StakeValidatorInput({
  className,
  label = "Node Credentials",
  disabled = false,
}: StakeValidatorInputProps) {
  const { setValidator } = useStakeContext();
  const [nodeEndpoint, setNodeEndpoint] = useState('127.0.0.1:9650');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedFromRPC, setFetchedFromRPC] = useState(false);
  
  // Manual input states
  const [manualNodeID, setManualNodeID] = useState('');
  const [manualPublicKey, setManualPublicKey] = useState('');
  const [manualProofOfPossession, setManualProofOfPossession] = useState('');
  
  // Validation states for real-time border colors
  const [nodeIDError, setNodeIDError] = useState<string | null>(null);
  const [publicKeyError, setPublicKeyError] = useState<string | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);

  const fetchNodeInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://${nodeEndpoint}/ext/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'info.getNodeID',
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Validate the response structure
      if (!data.result?.nodeID) {
        throw new Error('Invalid response: missing nodeID');
      }

      if (!data.result?.nodePOP?.publicKey || !data.result?.nodePOP?.proofOfPossession) {
        throw new Error('Invalid response: missing BLS credentials (nodePOP)');
      }

      const credentials: ValidatorCredentials = {
        nodeID: data.result.nodeID,
        nodePOP: {
          publicKey: data.result.nodePOP.publicKey,
          proofOfPossession: data.result.nodePOP.proofOfPossession,
        },
      };

      // Populate the manual input fields with fetched data
      setManualNodeID(credentials.nodeID);
      setManualPublicKey(credentials.nodePOP.publicKey);
      setManualProofOfPossession(credentials.nodePOP.proofOfPossession);
      setFetchedFromRPC(true);
      setValidator(credentials);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch node information');
    } finally {
      setIsLoading(false);
    }
  };

  const clearValidator = () => {
    setValidator(null);
    setError(null);
    setFetchedFromRPC(false);
    // Clear manual inputs
    setManualNodeID('');
    setManualPublicKey('');
    setManualProofOfPossession('');
  };

  const validateHexString = (value: string, expectedLength: number): boolean => {
    if (!value.startsWith('0x')) return false;
    const hexPart = value.slice(2);
    if (hexPart.length !== expectedLength - 2) return false;
    return /^[0-9a-fA-F]+$/.test(hexPart);
  };

  // Real-time validation functions
  const validateNodeID = (value: string): string | null => {
    if (!value.trim()) return null; // Empty is not an error, just not complete
    
    if (!value.startsWith('NodeID-')) {
      return 'Node ID must start with "NodeID-"';
    }

    if (value.length < 15 || value.length > 60) {
      return 'Node ID format appears invalid. Expected format: NodeID-[base58string]';
    }

    const nodeIdPart = value.slice(7);
    if (!/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(nodeIdPart)) {
      return 'Node ID contains invalid characters. Must use base58 encoding.';
    }

    return null;
  };

  const validatePublicKey = (value: string): string | null => {
    if (!value.trim()) return null;
    
    if (!validateHexString(value, 98)) {
      return 'BLS Public Key must be a 98-character hex string starting with "0x"';
    }

    const publicKeyHex = value.slice(2);
    if (publicKeyHex === '0'.repeat(96)) {
      return 'BLS Public Key cannot be all zeros';
    }

    return null;
  };

  const validateProofOfPossession = (value: string): string | null => {
    if (!value.trim()) return null;
    
    if (!validateHexString(value, 194)) {
      return 'Proof of Possession must be a 194-character hex string starting with "0x"';
    }

    const proofHex = value.slice(2);
    if (proofHex === '0'.repeat(192)) {
      return 'Proof of Possession cannot be all zeros';
    }

    return null;
  };

  // Real-time validation effects
  useEffect(() => {
    setNodeIDError(validateNodeID(manualNodeID));
  }, [manualNodeID]);

  useEffect(() => {
    setPublicKeyError(validatePublicKey(manualPublicKey));
  }, [manualPublicKey]);

  useEffect(() => {
    setProofError(validateProofOfPossession(manualProofOfPossession));
  }, [manualProofOfPossession]);

  // Auto-submit when all fields are valid and not empty
  useEffect(() => {
    if (manualNodeID && manualPublicKey && manualProofOfPossession && 
        !nodeIDError && !publicKeyError && !proofError && !fetchedFromRPC) {
      const credentials: ValidatorCredentials = {
        nodeID: manualNodeID.trim(),
        nodePOP: {
          publicKey: manualPublicKey.trim(),
          proofOfPossession: manualProofOfPossession.trim(),
        },
      };
      setValidator(credentials);
    } else if (!manualNodeID && !manualPublicKey && !manualProofOfPossession) {
      // Clear validator if all fields are empty
      setValidator(null);
    }
  }, [manualNodeID, manualPublicKey, manualProofOfPossession, nodeIDError, publicKeyError, proofError, fetchedFromRPC, setValidator]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        
        {/* RPC Fetch Section - always show */}
        <div className="space-y-3">
          <div className="flex items-stretch gap-2">
            <Input
              id="node-endpoint"
              value={nodeEndpoint}
              onChange={(e) => setNodeEndpoint(e.target.value)}
              placeholder="127.0.0.1:9650"
              disabled={disabled || isLoading}
              className="flex-1 h-10 min-h-[2.5rem] max-h-[2.5rem]"
            />
            <Button
              onClick={fetchNodeInfo}
              disabled={disabled || isLoading || !nodeEndpoint}
              variant="outline"
              className="h-10 min-h-[2.5rem] max-h-[2.5rem] px-3 shrink-0"
            >
              {isLoading ? 'Fetching...' : 'Fetch from URL'}
            </Button>
            <Button
              onClick={clearValidator}
              disabled={disabled}
              variant="outline"
              className="h-10 min-h-[2.5rem] max-h-[2.5rem] px-3 shrink-0"
            >
              Clear
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <strong>Note:</strong> This queries your node's <code>info.getNodeID</code> API endpoint 
            to retrieve the NodeID and BLS credentials. Ensure your AvalancheGo node is running 
            and accessible at the specified endpoint.
          </div>
        </div>

        {/* Manual Input Fields - always show */}
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="manual-node-id">Node ID</Label>
            <Input
              id="manual-node-id"
              value={manualNodeID}
              onChange={(e) => setManualNodeID(e.target.value)}
              placeholder="NodeID-..."
              disabled={disabled || fetchedFromRPC}
              className={cn("font-mono", nodeIDError ? "border-destructive" : "")}
            />
            {nodeIDError ? (
              <div className="text-xs text-destructive">
                {nodeIDError}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Must start with "NodeID-"
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="manual-public-key">BLS Public Key</Label>
            <Input
              id="manual-public-key"
              value={manualPublicKey}
              onChange={(e) => setManualPublicKey(e.target.value)}
              placeholder="0x..."
              disabled={disabled || fetchedFromRPC}
              className={cn("font-mono", publicKeyError ? "border-destructive" : "")}
            />
            {publicKeyError ? (
              <div className="text-xs text-destructive">
                {publicKeyError}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                BLS public key: 98-character hex string starting with "0x" (96 hex chars + 0x prefix)
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="manual-proof-of-possession">Proof of Possession</Label>
            <Input
              id="manual-proof-of-possession"
              value={manualProofOfPossession}
              onChange={(e) => setManualProofOfPossession(e.target.value)}
              placeholder="0x..."
              disabled={disabled || fetchedFromRPC}
              className={cn("font-mono", proofError ? "border-destructive" : "")}
            />
            {proofError ? (
              <div className="text-xs text-destructive">
                {proofError}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                BLS proof of possession: 194-character hex string starting with "0x" (192 hex chars + 0x prefix)
              </div>
            )}
          </div>

          {/* Show fetch source info */}
          {fetchedFromRPC && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              <strong>Fetched from RPC:</strong> {nodeEndpoint}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive mt-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
