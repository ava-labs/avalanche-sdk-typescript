import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `avax.getUTXOs` method.
 *
 * @param addresses - The addresses to get the UTXOs for. Each returned UTXO will reference at least one address in this list.
 * @param limit - The maximum number of UTXOs to return. If omitted or greater than 1024, it is set to 1024.
 * @param startIndex - The starting index for pagination. If omitted, will fetch all UTXOs up to limit. When using pagination:
 *                    - UTXOs are not guaranteed to be unique across multiple calls
 *                    - Consistency is not guaranteed across multiple calls as the UTXO set may change between calls
 * @param sourceChain - The source chain of the UTXOs to return.
 * @param encoding - The encoding format for the returned UTXOs. Can only be "hex" when a value is provided.
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
 * The return type for the `avax.getUTXOs` method.
 *
 * @param numFetched - The number of UTXOs fetched in this response.
 * @param utxos - The list of UTXOs fetched, where each UTXO references at least one address from the input addresses.
 * @param endIndex - The end index of the UTXOs fetched. Used for pagination - to get the next set of UTXOs,
 *                  use this value as startIndex in the next call.
 */
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
