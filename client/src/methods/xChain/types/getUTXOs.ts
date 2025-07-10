import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `avm.getUTXOs` method.
 *
 * @property addresses - The addresses to get UTXOs for.
 * @property limit - The maximum number of UTXOs to return.
 * @property startIndex - The starting index of the UTXOs to return.
 * @property sourceChain - The source chain of the UTXOs to return.
 * @property encoding - The encoding of the UTXOs to return.
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
 * The return type for the `avm.getUTXOs` method.
 *
 * @property numFetched - The number of UTXOs fetched.
 * @property utxos - The UTXOs.
 * @property endIndex - The end index of the UTXOs.
 * @property sourceChain - The source chain of the UTXOs.
 * @property encoding - The encoding of the UTXOs.
 */
export type GetUTXOsReturnType = {
  numFetched: number;
  utxos: string[];
  endIndex: {
    /**
     * The address of the UTXO.
     */
    address: string;
    /**
     * The UTXO.
     */
    utxo: string;
  };
  sourceChain?: string;
  encoding: "hex";
};

export type GetUTXOsErrorType = RequestErrorType;

export type GetUTXOsMethod = {
  Method: "avm.getUTXOs";
  Parameters: GetUTXOsParameters;
  ReturnType: GetUTXOsReturnType;
};
