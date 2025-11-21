import { parseAbi } from 'viem';

/**
 * AAVE PoolDataProvider ABI
 * Used for fetching pool data and reserves information
 */
export const POOL_DATA_PROVIDER_ABI = [
  {
    inputs: [],
    name: 'getAllReservesTokens',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'address', name: 'tokenAddress', type: 'address' },
        ],
        internalType: 'struct IPoolDataProvider.TokenData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
    name: 'getReserveData',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: 'accruedToTreasuryScaled', type: 'uint256' },
      { internalType: 'uint256', name: 'totalAToken', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: 'totalVariableDebt', type: 'uint256' },
      { internalType: 'uint256', name: 'liquidityRate', type: 'uint256' },
      { internalType: 'uint256', name: 'variableBorrowRate', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: 'liquidityIndex', type: 'uint256' },
      { internalType: 'uint256', name: 'variableBorrowIndex', type: 'uint256' },
      { internalType: 'uint40', name: 'lastUpdateTimestamp', type: 'uint40' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
    name: 'getReserveConfigurationData',
    outputs: [
      { internalType: 'uint256', name: 'decimals', type: 'uint256' },
      { internalType: 'uint256', name: 'ltv', type: 'uint256' },
      { internalType: 'uint256', name: 'liquidationThreshold', type: 'uint256' },
      { internalType: 'uint256', name: 'liquidationBonus', type: 'uint256' },
      { internalType: 'uint256', name: 'reserveFactor', type: 'uint256' },
      { internalType: 'bool', name: 'usageAsCollateralEnabled', type: 'bool' },
      { internalType: 'bool', name: 'borrowingEnabled', type: 'bool' },
      { internalType: 'bool', name: 'stableBorrowRateEnabled', type: 'bool' },
      { internalType: 'bool', name: 'isActive', type: 'bool' },
      { internalType: 'bool', name: 'isFrozen', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
    name: 'getATokenTotalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' },
    ],
    name: 'getUserReserveData',
    outputs: [
      { internalType: 'uint256', name: 'currentATokenBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'currentStableDebt', type: 'uint256' },
      { internalType: 'uint256', name: 'currentVariableDebt', type: 'uint256' },
      { internalType: 'uint256', name: 'principalStableDebt', type: 'uint256' },
      { internalType: 'uint256', name: 'scaledVariableDebt', type: 'uint256' },
      { internalType: 'uint256', name: 'stableBorrowRate', type: 'uint256' },
      { internalType: 'uint256', name: 'liquidityRate', type: 'uint256' },
      { internalType: 'uint40', name: 'stableRateLastUpdated', type: 'uint40' },
      { internalType: 'bool', name: 'usageAsCollateralEnabled', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
    name: 'getReserveTokensAddresses',
    outputs: [
      { internalType: 'address', name: 'aTokenAddress', type: 'address' },
      { internalType: 'address', name: 'stableDebtTokenAddress', type: 'address' },
      { internalType: 'address', name: 'variableDebtTokenAddress', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * AAVE PoolAddressesProvider ABI (basic)
 * Used for getting the Pool contract address
 */
export const POOL_ADDRESSES_PROVIDER_ABI = parseAbi([
  'function getPool() view returns (address)',
]);

/**
 * AAVE PoolAddressesProvider ABI (full)
 * Used for getting addresses by ID (e.g., RewardsController)
 */
export const POOL_ADDRESSES_PROVIDER_FULL_ABI = parseAbi([
  'function getPool() view returns (address)',
  'function getAddress(bytes32 id) view returns (address)',
]);

/**
 * AAVE Pool ABI
 * Used for deposit and withdraw operations
 */
export const POOL_ABI = parseAbi([
  'function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
  'function supplyWithPermit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
  'function withdraw(address asset, uint256 amount, address to) returns (uint256)',
]);

/**
 * AAVE RewardsController ABI
 * Used for claiming rewards
 */
export const REWARDS_CONTROLLER_ABI = parseAbi([
  'function claimRewards(address[] calldata assets, uint256 amount, address to, address reward) returns (uint256)',
  'function getRewardsList() view returns (address[])',
]);

