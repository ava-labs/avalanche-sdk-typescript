import { RequestErrorType } from "viem/utils";

export type IssueTxParameters = {
    tx: string;
    encoding: "hex";
}
  
export type IssueTxReturnType = {
    txID: string;
}

export type IssueTxErrorType = RequestErrorType;

export type IssueTxMethod = {
    Method: "platform.issueTx";
    Parameters: IssueTxParameters;
    ReturnType: IssueTxReturnType;
};