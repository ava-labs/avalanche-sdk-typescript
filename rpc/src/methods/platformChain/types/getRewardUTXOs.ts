import { RequestErrorType } from "viem/utils";

export type GetRewardUTXOsParameters = {
    txID: string;
    encoding?: "hex";
}
  
export type GetRewardUTXOsReturnType = {
    numFetched: number;
    utxos: string[];
    encoding: string;
}

export type GetRewardUTXOsErrorType = RequestErrorType;

export type GetRewardUTXOsMethod = {
    Method: "platform.getRewardUTXOs";
    Parameters: GetRewardUTXOsParameters;
    ReturnType: GetRewardUTXOsReturnType;
}