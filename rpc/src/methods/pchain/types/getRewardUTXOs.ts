import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getRewardUTXOs` method.
 * Get the reward UTXOs for a transaction.
 * @property txID - The ID of the transaction to get reward UTXOs for
 * @property encoding - The encoding format to use. Can only be hex when a value is provided
 */
export type GetRewardUTXOsParameters = {
  txID: string;
  encoding?: "hex";
};

/**
 * Return type for the `platform.getRewardUTXOs` method.
 * @property numFetched - The number of UTXOs returned
 * @property utxos - The reward UTXOs
 * @property encoding - The encoding format used
 */
export type GetRewardUTXOsReturnType = {
  numFetched: number;
  utxos: string[];
  encoding: string;
};

export type GetRewardUTXOsErrorType = RequestErrorType;

export type GetRewardUTXOsMethod = {
  Method: "platform.getRewardUTXOs";
  Parameters: GetRewardUTXOsParameters;
  ReturnType: GetRewardUTXOsReturnType;
};
