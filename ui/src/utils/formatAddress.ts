/**
 * Abbreviate an Ethereum address to show first 6 and last 4 characters
 * 
 * @example
 * ```ts
 * abbreviateAddress('0x1234567890abcdef1234567890abcdef12345678')
 * Returns: "0x1234...5678"
 * ```
 * 
 * @param address - Full Ethereum address string
 * @returns Abbreviated address string (e.g., "0x1234...5678") or "N/A" if address is empty
 */
export function abbreviateAddress(address: string | null | undefined): string {
  if (!address) return 'N/A';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

