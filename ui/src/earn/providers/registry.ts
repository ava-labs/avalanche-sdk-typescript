import type { EarnProviderBase } from './base';
import type { EarnProviderType } from '../types';
import { AaveProvider } from '../../3rd-party/earn/aave';
import { BenqiProvider } from '../../3rd-party/earn/benqi';

/**
 * Provider registry - maps provider IDs to provider instances
 */
const providers: Record<EarnProviderType, EarnProviderBase> = {
  aave: new AaveProvider(),
  benqi: new BenqiProvider(),
};

/**
 * Get a provider instance by ID
 */
export function getProvider(providerId: EarnProviderType): EarnProviderBase {
  const provider = providers[providerId];
  if (!provider) {
    throw new Error(`Provider "${providerId}" not found`);
  }
  return provider;
}

/**
 * Register a new provider
 */
export function registerProvider(providerId: string, provider: EarnProviderBase): void {
  (providers as any)[providerId] = provider;
}

/**
 * Get all registered provider IDs
 */
export function getProviderIds(): EarnProviderType[] {
  return Object.keys(providers) as EarnProviderType[];
}

