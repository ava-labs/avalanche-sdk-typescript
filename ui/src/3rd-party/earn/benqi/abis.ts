import { parseAbi } from 'viem';

/**
 * Benqi Unitroller (Comptroller) ABI
 * Used for fetching markets and claiming rewards
 */
export const UNITROLLER_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'getAllMarkets',
    outputs: [
      {
        internalType: 'contract QiToken[]',
        name: '',
        type: 'address[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'markets',
    outputs: [
      { internalType: 'bool', name: 'isListed', type: 'bool' },
      { internalType: 'uint256', name: 'collateralFactorMantissa', type: 'uint256' },
      { internalType: 'enum ComptrollerV1Storage.Version', name: 'version', type: 'uint8' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'mintGuardianPaused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint8', name: 'rewardType', type: 'uint8' },
      { internalType: 'address payable', name: 'holder', type: 'address' },
      { internalType: 'contract QiToken[]', name: 'qiTokens', type: 'address[]' },
    ],
    name: 'claimReward',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint8', name: 'rewardType', type: 'uint8' },
      { internalType: 'address payable', name: 'holder', type: 'address' },
    ],
    name: 'claimReward',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * Benqi QiToken ABI (full)
 * Used for reading token information and balances
 */
export const QI_TOKEN_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'underlying',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOfUnderlying',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'exchangeRateStored',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Benqi QiToken ABI for mint (deposit)
 * Used for depositing tokens
 */
export const QI_TOKEN_MINT_ABI = parseAbi([
  'function mint(uint256 mintAmount) returns (uint256)',
  'function mint() payable',
  'function underlying() view returns (address)',
]);

/**
 * Benqi QiToken ABI for redeem (withdraw)
 * Used for withdrawing tokens
 */
export const QI_TOKEN_REDEEM_ABI = parseAbi([
  'function redeem(uint256 redeemTokens) returns (uint256)',
  'function redeemUnderlying(uint256 redeemAmount) returns (uint256)',
  'function underlying() view returns (address)',
]);

