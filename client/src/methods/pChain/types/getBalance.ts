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
 * @property balance - The total AVAX balance of the queried addresses
 * @property unlocked - The unlocked AVAX balance of the queried addresses
 * @property lockedStakeable - The locked stakeable AVAX balance of the queried addresses
 * @property lockedNotStakeable - The locked and not stakeable AVAX balance of the queried addresses
 * @property balances - The total balance of each asset, keyed by asset ID, as a decimal string
 * @property unlockeds - The unlocked balance of each asset, keyed by asset ID, as a decimal string
 * @property lockedStakeables - The locked stakeable balance of each asset, keyed by asset ID, as a decimal string
 * @property lockedNotStakeables - The locked and not stakeable balance of each asset, keyed by asset ID, as a decimal string
 * @property utxoIDs - The IDs of the UTXOs that reference the queried addresses
 */
export type GetBalanceReturnType = {
  balance: bigint;
  unlocked: bigint;
  lockedStakeable: bigint;
  lockedNotStakeable: bigint;
  balances: Record<string, string>;
  unlockeds: Record<string, string>;
  lockedStakeables: Record<string, string>;
  lockedNotStakeables: Record<string, string>;
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
