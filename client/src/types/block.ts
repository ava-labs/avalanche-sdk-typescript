/**
 * Extended Block type that includes Avalanche-specific fields in addition to all viem Block fields.
 *
 * This type extends viem's Block type with Avalanche-specific fields that are present in
 * Avalanche network blocks. All existing viem Block fields are preserved, and the following
 * Avalanche-specific fields are added as optional properties:
 *
 * **Timing Fields:**
 * - `timestampMilliseconds?: Hex` - Block timestamp in milliseconds (Avalanche-specific)
 * - `minDelayExcess?: Hex` - Minimum delay excess in the Avalanche network
 *
 * **Gas / Data Fields:**
 * - `blockGasCost?: bigint` - The block gas cost in the Avalanche network
 * - `extDataGasUsed?: bigint` - The external data gas used in the Avalanche network
 * - `extDataHash?: Hex` - The hash of external data in the Avalanche network
 *
 * **Metadata Fields:**
 * - `blockExtraData?: Hex` - Extra block data in the Avalanche network
 *
 * @example
 * ```ts
 * import { Block } from '@avalanche-sdk/client/types'
 * import { getBlock } from 'viem'
 *
 * const block: Block = await getBlock(client, { blockNumber: 123n })
 * // block now includes all viem Block fields plus:
 * // block.blockGasCost, block.extDataGasUsed, block.extDataHash,
 * // block.blockExtraData, block.timestampMilliseconds, block.minDelayExcess
 * ```
 */
import type {
  Address,
  BlockTag,
  Hash,
  Hex,
  Transaction,
  Withdrawal,
} from "viem";
// Import viem's Block type directly from its internal module path to avoid circular reference
// This bypasses the module augmentation in global.d.ts that would cause a circular dependency

export type Block<
  quantity = bigint,
  includeTransactions extends boolean = boolean,
  blockTag extends BlockTag = BlockTag,
  transaction = Transaction<
    bigint,
    number,
    blockTag extends "pending" ? true : false
  >
> = {
  /** Base fee per gas */
  baseFeePerGas: quantity | null;
  /** Total used blob gas by all transactions in this block */
  blobGasUsed: quantity;
  /** Difficulty for this block */
  difficulty: quantity;
  /** Excess blob gas */
  excessBlobGas: quantity;
  /** "Extra data" field of this block */
  extraData: Hex;
  /** Maximum gas allowed in this block */
  gasLimit: quantity;
  /** Total used gas by all transactions in this block */
  gasUsed: quantity;
  /** Block hash or `null` if pending */
  hash: blockTag extends "pending" ? null : Hash;
  /** Logs bloom filter or `null` if pending */
  logsBloom: blockTag extends "pending" ? null : Hex;
  /** Address that received this block’s mining rewards, COINBASE address */
  miner: Address;
  /** Unique identifier for the block. */
  mixHash: Hash;
  /** Proof-of-work hash or `null` if pending */
  nonce: blockTag extends "pending" ? null : Hex;
  /** Block number or `null` if pending */
  number: blockTag extends "pending" ? null : quantity;
  /** Root of the parent beacon chain block */
  parentBeaconBlockRoot?: Hex | undefined;
  /** Parent block hash */
  parentHash: Hash;
  /** Root of the this block’s receipts trie */
  receiptsRoot: Hex;
  sealFields: Hex[];
  /** SHA3 of the uncles data in this block */
  sha3Uncles: Hash;
  /** Size of this block in bytes */
  size: quantity;
  /** Root of this block’s final state trie */
  stateRoot: Hash;
  /** Unix timestamp of when this block was collated */
  timestamp: quantity;
  /** Total difficulty of the chain until this block */
  totalDifficulty: quantity | null;
  /** List of transaction objects or hashes */
  transactions: includeTransactions extends true ? transaction[] : Hash[];
  /** Root of this block’s transaction trie */
  transactionsRoot: Hash;
  /** List of uncle hashes */
  uncles: Hash[];
  /** List of withdrawal objects */
  withdrawals?: Withdrawal[] | undefined;
  /** Root of the this block’s withdrawals trie */
  withdrawalsRoot?: Hex | undefined;
  /** Block gas cost in the Avalanche network. */
  blockGasCost?: bigint;
  /** External data gas used in the Avalanche network. */
  extDataGasUsed?: bigint;
  /** Hash of external data in the Avalanche network. */
  extDataHash?: Hex;
  /** Extra block data in the Avalanche network. */
  blockExtraData?: Hex;
  /** Block timestamp in milliseconds (Avalanche-specific). */
  timestampMilliseconds?: Hex;
  /** Minimum delay excess in the Avalanche network. */
  minDelayExcess?: Hex;
};
