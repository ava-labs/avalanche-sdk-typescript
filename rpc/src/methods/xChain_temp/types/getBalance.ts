import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `avm.getBalance` method.
 *
 * @property address - The address to get the balance for.
 * @property assetID - The asset ID.
 */
export type GetBalanceParameters = {
  address: string;
  assetID: string;
};

/**
 * The return type for the `avm.getBalance` method.
 *
 * @property balance - The balance.
 * @property utxoIDs - The UTXO IDs.
 */
export type GetBalanceReturnType = {
  balance: bigint;
  utxoIDs: {
    /**
     * The transaction ID.
     */
    txID: string;
    /**
     * The output index.
     */
    outputIndex: number;
  }[];
};

export type GetBalanceErrorType = RequestErrorType;

export type GetBalanceMethod = {
  Method: "avm.getBalance";
  Parameters: GetBalanceParameters;
  ReturnType: GetBalanceReturnType;
};
