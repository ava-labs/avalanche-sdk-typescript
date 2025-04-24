import { RequestErrorType } from "viem/utils";

export type GetBalanceParameters = {
    address: string;
    assetID: string;
}

export type GetBalanceReturnType = {
    balance: bigint;
    utxoIDs: {
        txID: string;
        outputIndex: number;
    }[];
}

export type GetBalanceErrorType = RequestErrorType;

export type GetBalanceMethod = {
  Method: "avm.getBalance";
  Parameters: GetBalanceParameters;
  ReturnType: GetBalanceReturnType;
};

