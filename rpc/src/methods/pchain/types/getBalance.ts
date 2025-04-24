import { RequestErrorType } from "viem/utils";

/**
 * Represents the parameters for the `getBalance` method.
 */
export type GetBalanceParameters = {
  /**
   * The addresses to query the balance for.
   */
  addresses: string[];
};

/**
 * Represents the return type for the `getBalance` method.
 */
export type GetBalanceReturnType = {
  /**
   * The total balance of the queried addresses.
   */
  balance: bigint;

  /**
   * The unlocked balance of the queried addresses.
   */
  unlocked: bigint;

  /**
   * The locked stakeable balance of the queried addresses.
   */
  lockedStakeable: bigint;

  /**
   * The locked and not stakeable balance of the queried addresses.
   */
  lockedNotStakeable: bigint;

  /**
   * The IDs of the UTXOs that reference the queried addresses.
   */
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

