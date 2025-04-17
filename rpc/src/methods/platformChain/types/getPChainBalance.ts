import { RequestErrorType } from "viem/utils";

/**
 * Represents the parameters for the `getBalance` method on the platform chain.
 */
export type GetPChainBalanceParameters = {
  /**
   * The addresses to query the balance for.
   */
  addresses: string[];
};

/**
 * Represents the return type for the `getBalance` method on the platform chain.
 */
export type GetPChainBalanceReturnType = {
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

export type GetPChainBalanceErrorType = RequestErrorType;

export type GetPChainBalanceMethod = {
  Method: "platform.getBalance";
  Parameters: GetPChainBalanceParameters;
  ReturnType: GetPChainBalanceReturnType;
};
