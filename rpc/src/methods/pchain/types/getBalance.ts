import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getBalance` method.
 * Get the balance of AVAX controlled by a given address.
 * @property addresses - The addresses to get the balance of
 */
export type GetBalanceParameters = {
  /**
   * @property addresses - The addresses to get the balance of
   */
  addresses: string[];
};

/**
 * Return type for the `platform.getBalance` method.
 * @property balance - The total balance of the queried addresses
 * @property unlocked - The unlocked balance of the queried addresses
 * @property lockedStakeable - The locked stakeable balance of the queried addresses
 * @property lockedNotStakeable - The locked and not stakeable balance of the queried addresses
 * @property utxoIDs - The IDs of the UTXOs that reference the queried addresses
 */
export type GetBalanceReturnType = {
  balance: bigint;
  unlocked: bigint;
  lockedStakeable: bigint;
  lockedNotStakeable: bigint;
  utxoIDs: {
    /**
     * The transaction ID of the UTXO.
     */
    txID: string;

    /**
     * The output index of the UTXO.
     */
    outputIndex: number;
  }[];
};

export type GetBalanceErrorType = RequestErrorType;

export type GetBalanceMethod = {
  Method: "platform.getBalance";
  Parameters: GetBalanceParameters;
  ReturnType: GetBalanceReturnType;
};
