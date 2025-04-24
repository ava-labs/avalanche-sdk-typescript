export type XChainBlockType =
  | {
      block: {
        parentID: string;
        height: number;
        time: number;
        merkleRoot: string;
        txs: {
          unsignedTx: {
            networkID: number;
            blockchainID: string;
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
            memo: string;
          };
          credentials: {
            fxID: string;
            credential: {
              signatures: string[];
            };
          }[];
          id: string;
        }[];
        id: string;
      };
      encoding: "json";
    }
  | {
      encoding: "hex";
      block: string;
    };

export type XChainTransactionType =
  | {
      tx: {
        unsignedTx: {
          networkID: number;
          blockchainID: string;
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
          memo: string;
          destinationChain: string;
          exportedOutputs: {
            assetID: string;
            fxID: string;
            output: {
              addresses: string[];
              amount: number;
              locktime: number;
              threshold: number;
            };
          }[];
        };
        credentials: {
          fxID: string;
          credential: {
            signatures: string[];
          };
        }[];
        id: string;
      };
      encoding: "json";
    }
  | {
      encoding: "hex";
      tx: string;
    };


export type XChainTransactionStatus = 
  | "Accepted"
  | "Processing"
  | "Rejected"
  | "Unknown"