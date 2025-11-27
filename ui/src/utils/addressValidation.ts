import { isAddress } from 'viem';

export type ChainType = 'P' | 'C' | 'X';

export interface AddressValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

/**
 * Validates an address for a specific chain type
 */
export function validateAddress(address: string, chainType: ChainType): AddressValidationResult {
  if (!address || address.trim() === '') {
    return {
      isValid: false,
      error: 'Address is required'
    };
  }

  const trimmedAddress = address.trim();

  switch (chainType) {
    case 'C':
      return validateCChainAddress(trimmedAddress);
    case 'P':
      return validatePChainAddress(trimmedAddress);
    case 'X':
      return validateXChainAddress(trimmedAddress);
    default:
      return {
        isValid: false,
        error: 'Invalid chain type'
      };
  }
}

/**
 * Validates C-Chain (EVM) addresses
 */
function validateCChainAddress(address: string): AddressValidationResult {
  // Check if it's a valid EVM address (0x format)
  if (isAddress(address)) {
    return { isValid: true };
  }

  // Check if user provided P-Chain or X-Chain address by mistake
  if (address.startsWith('P-')) {
    return {
      isValid: false,
      error: 'Invalid address format for C-Chain',
      suggestion: 'You provided a P-Chain address. C-Chain addresses start with "0x" and are 42 characters long.'
    };
  }

  if (address.startsWith('X-')) {
    return {
      isValid: false,
      error: 'Invalid address format for C-Chain',
      suggestion: 'You provided an X-Chain address. C-Chain addresses start with "0x" and are 42 characters long.'
    };
  }

  // Check if it looks like it should be a hex address but missing 0x
  if (/^[a-fA-F0-9]{40}$/.test(address)) {
    return {
      isValid: false,
      error: 'Invalid address format',
      suggestion: 'Did you mean "0x' + address + '"? C-Chain addresses must start with "0x".'
    };
  }

  return {
    isValid: false,
    error: 'Invalid C-Chain address format. Expected format: 0x followed by 40 hexadecimal characters.'
  };
}

/**
 * Validates P-Chain addresses
 */
function validatePChainAddress(address: string): AddressValidationResult {
  // P-Chain addresses should start with P- and be bech32 encoded
  if (!address.startsWith('P-')) {
    // Check if user provided C-Chain address by mistake
    if (isAddress(address)) {
      return {
        isValid: false,
        error: 'Invalid address format for P-Chain',
        suggestion: 'You provided a C-Chain address. P-Chain addresses start with "P-" followed by bech32 encoded data.'
      };
    }

    // Check if user provided X-Chain address by mistake
    if (address.startsWith('X-')) {
      return {
        isValid: false,
        error: 'Invalid address format for P-Chain',
        suggestion: 'You provided an X-Chain address. P-Chain addresses start with "P-" not "X-".'
      };
    }

    return {
      isValid: false,
      error: 'P-Chain addresses must start with "P-"'
    };
  }

  // Basic validation for bech32 format after P-
  const bech32Part = address.slice(2); // Remove "P-"
  
  // Bech32 addresses should be at least 39 characters and contain only valid bech32 characters
  if (bech32Part.length < 39) {
    return {
      isValid: false,
      error: 'P-Chain address is too short'
    };
  }

  // Check for valid bech32 characters (a-z, 0-9, excluding 1, b, i, o)
  if (!/^[ac-hj-np-z02-9]+$/.test(bech32Part)) {
    return {
      isValid: false,
      error: 'P-Chain address contains invalid characters'
    };
  }

  return { isValid: true };
}

/**
 * Validates X-Chain addresses
 */
function validateXChainAddress(address: string): AddressValidationResult {
  // X-Chain addresses should start with X- and be bech32 encoded
  if (!address.startsWith('X-')) {
    // Check if user provided C-Chain address by mistake
    if (isAddress(address)) {
      return {
        isValid: false,
        error: 'Invalid address format for X-Chain',
        suggestion: 'You provided a C-Chain address. X-Chain addresses start with "X-" followed by bech32 encoded data.'
      };
    }

    // Check if user provided P-Chain address by mistake
    if (address.startsWith('P-')) {
      return {
        isValid: false,
        error: 'Invalid address format for X-Chain',
        suggestion: 'You provided a P-Chain address. X-Chain addresses start with "X-" not "P-".'
      };
    }

    return {
      isValid: false,
      error: 'X-Chain addresses must start with "X-"'
    };
  }

  // Basic validation for bech32 format after X-
  const bech32Part = address.slice(2); // Remove "X-"
  
  // Bech32 addresses should be at least 39 characters and contain only valid bech32 characters
  if (bech32Part.length < 39) {
    return {
      isValid: false,
      error: 'X-Chain address is too short'
    };
  }

  // Check for valid bech32 characters (a-z, 0-9, excluding 1, b, i, o)
  if (!/^[ac-hj-np-z02-9]+$/.test(bech32Part)) {
    return {
      isValid: false,
      error: 'X-Chain address contains invalid characters'
    };
  }

  return { isValid: true };
}

/**
 * Detects the likely chain type from an address
 */
export function detectChainType(address: string): ChainType | null {
  if (!address) return null;

  const trimmedAddress = address.trim();

  if (isAddress(trimmedAddress)) {
    return 'C';
  }

  if (trimmedAddress.startsWith('P-')) {
    return 'P';
  }

  if (trimmedAddress.startsWith('X-')) {
    return 'X';
  }

  return null;
}

