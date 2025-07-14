/**
 * The status of an atomic transaction
 *
 * - Accepted: The transaction is (or will be) accepted by every node. Check the blockHeight property
 * - Processing: The transaction is being voted on by this node
 * - Dropped: The transaction was dropped by this node because it thought the transaction invalid
 * - Unknown: The transaction hasn't been seen by this node
 */
export type CChainAtomicTxStatus =
  | "Accepted"
  | "Processing"
  | "Dropped"
  | "Unknown";
