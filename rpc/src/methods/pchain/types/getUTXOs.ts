import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getUTXOs` method.
 * Get the UTXOs that reference a given set of addresses.
 * @property addresses - The addresses to get UTXOs for
 * @property limit - The maximum number of UTXOs to return
 * @property startIndex - The index to start from. If omitted, starts from the beginning
 * @property sourceChain - The chain to get UTXOs from. If omitted, gets UTXOs from the P-Chain
 * @property encoding - The encoding format to use. Can only be hex when a value is provided
 */
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

/**
 * Return type for the `platform.getUTXOs` method.
 * @property numFetched - The number of UTXOs returned
 * @property utxos - The UTXOs that reference the given addresses
 * @property endIndex - The index of the last UTXO returned
 * @property sourceChain - The chain the UTXOs are from
 * @property encoding - The encoding format used
 */
export type GetUTXOsReturnType = {
  numFetched: number;
  utxos: string[];
  endIndex: {
    address: string;
    utxo: string;
  };
  sourceChain?: string;
  encoding: "hex";
};

export type GetUTXOsErrorType = RequestErrorType;

export type GetUTXOsMethod = {
  Method: "platform.getUTXOs";
  Parameters: GetUTXOsParameters;
  ReturnType: GetUTXOsReturnType;
};
