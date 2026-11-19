import type { Chain } from '@avalanche-sdk/client/chains';

/**
 * Types of explorer resources
 */
export type ExplorerResourceType = 'address' | 'tx' | 'transaction' | 'token' | 'block';

/**
 * Explorer URL parameters
 */
export interface ExplorerUrlParams {
  /** Resource type (address, tx, token, etc.) */
  type: ExplorerResourceType;
  /** Resource identifier (address, tx hash, token address, block number) */
  value: string;
  /** Additional query parameters */
  params?: Record<string, string | number | boolean>;
}

/**
 * Get the explorer URL for a given chain
 * Falls back to Snowtrace (Avalanche Mainnet) if not available
 */
export function getExplorerUrl(chain?: Chain | null): string {
  return chain?.blockExplorers?.default?.url || 'https://snowtrace.io';
}

/**
 * Build explorer URL with pattern-based approach
 * Supports different resource types and additional parameters
 */
export function buildExplorerUrl(
  chain: Chain | null | undefined,
  params: ExplorerUrlParams
): string {
  const baseUrl = getExplorerUrl(chain);
  const { type, value, params: queryParams } = params;

  // Map resource types to URL patterns
  const typeMap: Record<ExplorerResourceType, string> = {
    address: 'address',
    tx: 'tx',
    transaction: 'tx',
    token: 'token',
    block: 'block',
  };

  const pathSegment = typeMap[type] || type;
  let url = `${baseUrl}/${pathSegment}/${value}`;

  // Add query parameters if provided
  if (queryParams && Object.keys(queryParams).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      searchParams.append(key, String(val));
    });
    url += `?${searchParams.toString()}`;
  }

  return url;
}

/**
 * Open an explorer URL in a new window
 */
export function openExplorerUrl(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Open an explorer resource in a new window (pattern-based)
 */
export function openExplorer(
  chain: Chain | null | undefined,
  params: ExplorerUrlParams
): void {
  openExplorerUrl(buildExplorerUrl(chain, params));
}

