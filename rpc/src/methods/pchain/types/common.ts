export type Encoding = "hex" | "json";

export type PChainBlockType =
  | {
      encoding: "json";
      block: {
        parentID: string;
        height: number;
        time: number;
        id: string;
        txs: {
          unsignedTx: {
            networkID: number;
            blockchainID: string;
            memo: string;
            subnetID: string;
            outputs: {
              assetID: string;
              fxID: string;
              output: {
                addresses: string[];
                amount: number;
                locktime: number;
                threshold: number;
              };
            }[];
            inputs: {
              txID: string;
              outputIndex: number;
              assetID: string;
              fxID: string;
              input: {
                amount: number;
                signatureIndices: number[];
              };
            }[];
            validator: {
              nodeID: string;
              start: number;
              end: number;
              weight: number;
            };
            stake: {
              assetID: string;
              fxID: string;
              output: {
                addresses: string[];
                amount: number;
                locktime: number;
                threshold: number;
              };
            }[];
            rewardsOwner: {
              addresses: string[];
              locktime: number;
              threshold: number;
            };
          };
          credentials: {
            signatures: string[];
          }[];
        }[];
      };
    }
  | {
      encoding: "hex";
      block: string;
    };

export type PChainTransactionType =
  | {
      tx: {
        unsignedTx: {
          networkID: number;
          blockchainID: string;
          memo: string;
          subnetID: string;
          outputs: {
            assetID: string;
            fxID: string;
            output: {
              addresses: string[];
              amount: number;
              locktime: number;
              threshold: number;
            };
          }[];
          inputs: {
            txID: string;
            outputIndex: number;
            assetID: string;
            fxID: string;
            input: {
              amount: number;
              signatureIndices: number[];
            };
          }[];
          validator: {
            nodeID: string;
            start: number;
            end: number;
            weight: number;
          };
          stake: {
            assetID: string;
            fxID: string;
            output: {
              addresses: string[];
              amount: number;
              locktime: number;
              threshold: number;
            };
          }[];
          rewardsOwner: {
            addresses: string[];
            locktime: number;
            threshold: number;
          };
        };
        credentials: {
          signatures: string[];
        }[];
      };
      encoding: "json";
    }
  | {
      tx: string;
      encoding: "hex";
    };

/**
 * Describes the status of a blockchain.
 *
 * - `Validating`: The blockchain is being validated by this node.
 * - `Created`: The blockchain exists but isn’t being validated by this node.
 * - `Preferred`: The blockchain was proposed to be created and is likely to be created, but the transaction isn’t yet accepted.
 * - `Syncing`: This node is participating in the blockchain as a non-validating node.
 * - `Unknown`: The blockchain either wasn’t proposed or the proposal isn’t preferred.
 */
export type BlockchainStatus =
  | "Validating"
  | "Created"
  | "Preferred"
  | "Syncing"
  | "Unknown";


/**
 * Represents the status of a transaction.
 * 
 * - `Committed`: The transaction is (or will be) accepted by every node.
 * - `Pending`: The transaction is being voted on by this node.
 * - `Dropped`: The transaction will never be accepted by any node in the network. Check the `reason` field for more information.
 * - `Unknown`: The transaction hasn’t been seen by this node.
 * 
 */
export type PChainTransactionStatus = 
  | "Committed"
  | "Pending"
  | "Dropped"
  | "Unknown"