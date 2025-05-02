import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `avm.getAllBalances` method.
 *
 * @property addresses - The addresses to get balances for.
 */
export type GetAllBalancesParameters = {
  addresses: string[];
};

/**
 * The return type for the `avm.getAllBalances` method.
 *
 * @property balances - The balances.
 */
export type GetAllBalancesReturnType = {
  balances: {
    /**
     * The asset ID.
     */
    assetID: string;
    /**
     * The balance.
     */
    balance: bigint;
  }[];
};

export type GetAllBalancesErrorType = RequestErrorType;

export type GetAllBalancesMethod = {
  Method: "avm.getAllBalances";
  Parameters: GetAllBalancesParameters;
  ReturnType: GetAllBalancesReturnType;
};
