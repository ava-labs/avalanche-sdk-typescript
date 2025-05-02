/**
 * Represents an X-Chain block in either JSON or hex format.
 * The X-Chain is Avalanche's native platform for creating and trading assets.
 * @see https://build.avax.network/docs/api-reference/x-chain/api
 */
export type XChainBlockType =
  | {
      block: {
        /** ID of the parent block */
        parentID: string;
        /** Height of the block in the chain */
        height: number;
        /** Unix timestamp when the block was created */
        time: number;
        /** Merkle root of all transactions in the block */
        merkleRoot: string;
        /** Array of transactions in the block */
        txs: {
          unsignedTx: {
            /** Network ID of the blockchain */
            networkID: number;
            /** ID of the blockchain */
            blockchainID: string;
            /** Array of transaction outputs */
            outputs: {
              /** ID of the asset being transferred */
              assetID: string;
              /** ID of the FX (transfer) operation */
              fxID: string;
              output: {
                /** Array of addresses that can spend this output */
                addresses: string[];
                /** Amount of the asset */
                amount: number;
                /** Unix timestamp when this output can be spent */
                locktime: number;
                /** Number of signatures required to spend this output */
                threshold: number;
              };
            }[];
            /** Array of transaction inputs */
            inputs: {
              /** ID of the transaction being spent */
              txID: string;
              /** Index of the output being spent */
              outputIndex: number;
              /** ID of the asset being spent */
              assetID: string;
              /** ID of the FX (transfer) operation */
              fxID: string;
              input: {
                /** Amount of the asset being spent */
                amount: number;
                /** Indices of the signatures required */
                signatureIndices: number[];
              };
            }[];
            /** Optional memo field for the transaction */
            memo: string;
          };
          /** Array of credentials (signatures) for the transaction */
          credentials: {
            /** ID of the FX (transfer) operation */
            fxID: string;
            credential: {
              /** Array of signatures */
              signatures: string[];
            };
          }[];
          /** ID of the transaction */
          id: string;
        }[];
        /** ID of the block */
        id: string;
      };
      /** Encoding format for the block data */
      encoding: "json";
    }
  | {
      /** Encoding format for the block data */
      encoding: "hex";
      /** Block data in hex format */
      block: string;
    };

/**
 * Represents an X-Chain transaction in either JSON or hex format.
 * Transactions on the X-Chain can transfer assets between addresses or export assets to other chains.
 * @see https://build.avax.network/docs/api-reference/x-chain/api
 */
export type XChainTransactionType =
  | {
      tx: {
        unsignedTx: {
          /** Network ID of the blockchain */
          networkID: number;
          /** ID of the blockchain */
          blockchainID: string;
          /** Array of transaction inputs */
          inputs: {
            /** ID of the transaction being spent */
            txID: string;
            /** Index of the output being spent */
            outputIndex: number;
            /** ID of the asset being spent */
            assetID: string;
            /** ID of the FX (transfer) operation */
            fxID: string;
            input: {
              /** Amount of the asset being spent */
              amount: number;
              /** Indices of the signatures required */
              signatureIndices: number[];
            };
          }[];
          /** Array of transaction outputs */
          outputs: {
            /** ID of the asset being transferred */
            assetID: string;
            /** ID of the FX (transfer) operation */
            fxID: string;
            output: {
              /** Array of addresses that can spend this output */
              addresses: string[];
              /** Amount of the asset */
              amount: number;
              /** Unix timestamp when this output can be spent */
              locktime: number;
              /** Number of signatures required to spend this output */
              threshold: number;
            };
          }[];
          /** Optional memo field for the transaction */
          memo: string;
          /** ID of the destination chain for cross-chain transfers */
          destinationChain: string;
          /** Array of outputs being exported to another chain */
          exportedOutputs: {
            /** ID of the asset being exported */
            assetID: string;
            /** ID of the FX (transfer) operation */
            fxID: string;
            output: {
              /** Array of addresses that can spend this output */
              addresses: string[];
              /** Amount of the asset */
              amount: number;
              /** Unix timestamp when this output can be spent */
              locktime: number;
              /** Number of signatures required to spend this output */
              threshold: number;
            };
          }[];
        };
        /** Array of credentials (signatures) for the transaction */
        credentials: {
          /** ID of the FX (transfer) operation */
          fxID: string;
          credential: {
            /** Array of signatures */
            signatures: string[];
          };
        }[];
        /** ID of the transaction */
        id: string;
      };
      /** Encoding format for the transaction data */
      encoding: "json";
    }
  | {
      /** Encoding format for the transaction data */
      encoding: "hex";
      /** Transaction data in hex format */
      tx: string;
    };

/**
 * Represents the possible statuses of an X-Chain transaction.
 * - Accepted: Transaction has been accepted and included in a block
 * - Processing: Transaction is being processed
 * - Rejected: Transaction was rejected
 * - Unknown: Transaction status cannot be determined
 */
export type XChainTransactionStatus =
  | "Accepted"
  | "Processing"
  | "Rejected"
  | "Unknown";
