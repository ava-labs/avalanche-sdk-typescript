import { RequestErrorType } from "viem/utils";

export type GetUTXOsParameters = {
    addresses: string[];
    limit?: number;
    startIndex?: {
      address: string;
      utxo: string;
    };
    sourceChain?: string;
    encoding?: "hex";
  };

export type GetUTXOsReturnType = {
    numFetched: number;
    utxos: string[];
    endIndex: {
      address: string;
      utxo: string;
    };
};

export type GetUTXOsErrorType = RequestErrorType;

export type GetUTXOsMethod = {
  Method: "avax.getUTXOs";
  Parameters: GetUTXOsParameters;
  ReturnType: GetUTXOsReturnType;
};
